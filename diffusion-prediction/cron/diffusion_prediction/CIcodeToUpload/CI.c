#include<stdio.h>
#include<stdlib.h>
#include<math.h>

#define MAXSIZE 1000000
#define INFINITUM 1e12
#define G_MIN 1e-2
#define G_THRESHOLD 1e-2

typedef enum{OFF, ON} on_off;
typedef enum{OUT, IN} out_in;
typedef enum{NO, YES} no_yes;

typedef long int int_t;

int_t get_num_nodes(const char *FILENAME) {
	int_t i, node, N;
	int n;
	char line[MAXSIZE], *start;
	FILE *list;
	
	list = fopen(FILENAME, "r");
	N = 0;
	while( fgets(line, MAXSIZE, list) != NULL) {
		start = line;
		while( sscanf(start, "%ld%n", &node, &n) == 1) {
			start += n;
		}
		N += 1;
	}
	fclose(list);
	return N;
}
int_t **makeRandomGraph(const char *FILENAME, int_t N) {	
	int_t i, j, node, nj, cnt; 
	int_t *deg, **adj_list, **adj_mat;
	int n;
	char line[MAXSIZE], *start;
	FILE *list;
	
	deg = (int_t *)calloc(N + 1, sizeof(int_t));
	for(i = 1; i <= N; i++)
		deg[i] = -1;
	
	adj_list = (int_t **)calloc(N + 1, sizeof(int_t *));
	adj_list[0] = (int_t *)calloc(1, sizeof(int_t));
	//count number of neighbours

	//给每一行元素动态分配内存
	list = fopen(FILENAME, "r");
	i = 1;
	while( fgets(line, MAXSIZE, list) != NULL) { 
		start = line;
		while( sscanf(start, "%ld%n", &node, &n) == 1) {
			start += n;
			deg[i] += 1;
		}		
		adj_list[i] = (int_t *)calloc(deg[i] + 1, sizeof(long int));
		i++;
	}
	fclose(list);
	
	//得到数据文件的邻接矩阵
	list = fopen(FILENAME, "r");
	i = 1;
	while( fgets(line, MAXSIZE, list) != NULL) { 
		start = line;
		j = 0;
		while( sscanf(start, "%ld%n", &node, &n) == 1) {
			start += n;
			adj_list[i][j] = node;
			j++;
		}
		adj_list[i][0] = deg[i];
		i++;
	}
	
	fclose(list);
	free(deg);
	
	return adj_list;
}

typedef struct{
	out_in n;
	int_t deg, compNum, compSize;
}varNode;

typedef struct{
	double fit;
	int_t id;
}FIT;

void merge(FIT *a, FIT *b, FIT *c, int_t m, int_t n) {
	int_t i, j, k;
	i = 0;
	j = 0;
	k = 0;
    while(i < m && j < n) {
		if(a[i].fit < b[j].fit) { 
			c[k].fit = a[i].fit;
			c[k].id = a[i].id;
			k++;
			i++;
		}
		else {
			c[k].fit = b[j].fit;
			c[k].id = b[j].id;
			k++;
			j++;
		}
	}
	while(i<m) {
		c[k].fit = a[i].fit;
		c[k].id = a[i].id;
		k++;
		i++;
	}
    while(j<n) {
		c[k].fit = b[j].fit;
		c[k].id = b[j].id;
		k++;
		j++;
	}
}
void sort(FIT *F, int_t n) {
	int_t j, k, a = 1, inc = 0, cnt=0, lenght = 0, temp = n;
    FIT *wf, *yf;
    while(temp != 0) {
		while(a < temp - a)
			a *=2;
		lenght +=a;
		wf = calloc(a, sizeof(FIT));		
		for(k = 1; k < a; k *= 2){
			for(j = 0; j < a - k; j += 2 * k) {
				merge(F + j + inc, F + j + k + inc, wf + j, k, k);
			}
			for(j = 0; j < a; ++j) {
				F[j + inc].fit = wf[j].fit;
				F[j + inc].id = wf[j].id;
			}
		}
		++cnt;
		free(wf);
		inc +=a;
		temp -=a;	   
		if(cnt >= 2 ) {
			yf = calloc(lenght, sizeof(FIT));
			merge(F, F + lenght-a, yf, lenght-a, a);
			for(j = 0; j < lenght; ++j) {
				F[j].fit = yf[j].fit;
				F[j].id = yf[j].id;
			}			
			free(yf);
		}
		a = 1;
    }
}

int_t setNeighborComp(int_t **Graph, int_t N, int_t compNumber, int_t currentNode, varNode *Node){
	int_t k;
	int_t temp = 1;
	int_t delta = 1;
	int_t neigh;
	int_t *queue, *read, *write;
	queue = (int_t *)calloc(N + 1, sizeof(int_t)); //cannot be larger than N
	
	queue[0] = currentNode;
	read = queue;
	write = queue + 1;
	while(read != write) {
		for(k = 1; k <= Graph[*read][0]; k++) {
			neigh =  Graph[*read][k];
			if(Node[neigh].compNum <= 0 && Node[neigh].n == IN) {
				Node[neigh].compNum = compNumber;
				queue[temp] = neigh;
				temp += 1;
			}
		}
		read += 1;
		write += temp - delta;
		delta = temp;
	}
	free(queue);
	return 1;
}
int_t bigCompNodes(varNode *Node, int_t **Graph, int_t N){
	int_t i, compNumber, size_largest_comp, *Size_comp;
	compNumber = 0;
	
	for(i = 1; i <= N; i++){ 
		Node[i].compNum = 0;
		Node[i].compSize = 0;
	}
	for(i = 1; i <= N; i++){
		if(Node[i].compNum <= 0 && Node[i].n == IN){
			compNumber++;
			Node[i].compNum = compNumber; 
			setNeighborComp(Graph, N, compNumber, i, Node);
		}
	}    
	Size_comp = (int_t *)calloc(compNumber+1, sizeof(int_t));
   
    for(i = 1; i <= N; i++)
        Size_comp[Node[i].compNum] = Size_comp[Node[i].compNum]+1;
	for(i = 1; i <= N; i++)
		Node[i].compSize = Size_comp[Node[i].compNum];
	
    size_largest_comp = Size_comp[1];
    for(i = 1; i <= compNumber; i++){
        if(size_largest_comp < Size_comp[i])
            size_largest_comp = Size_comp[i];
    }
	free(Size_comp);
    return size_largest_comp;
}

double get_CI(int_t i, varNode *Node, int_t N, int_t **Graph, int L, int_t *queue, int_t *check, int_t *lenght) {
	int_t *r, *w, temp, delta, cnt, k, neigh, index, deg;
	int s;
	double CI;
	
	if(Node[i].deg == 0 || Node[i].deg == 1) {return 0;}
	else {
		queue[0] = i;
		check[i] = ON;
		r = queue;
		w = queue + 1;
		temp = 1;
		delta = 1;
		lenght[0] = 1;
		s = 1;
		cnt = 0;
		while(r != w) {
			if(s <= L) {
				deg = Graph[*r][0];
				for(k = 1; k <= deg; k++) {
					neigh = Graph[*r][k];
					if( (Node[neigh].n == IN) && (check[neigh] == OFF)) {
						queue[temp++] = neigh;
						check[neigh] = ON;
						lenght[s] += 1;
					}
				}
			}
			r += 1;
			w += temp - delta;
			delta = temp;
			cnt += 1;
			if(cnt == lenght[s-1]) {
				s++;
				cnt = 0;
			}
		}
		index = 0;
		for(s = 0; s < L; s++)
			index += lenght[s];
		CI = 0.;
		for(k = index; k < (index + lenght[L]); k++) {
			CI += (Node[queue[k]].deg - 1.);
		}
		CI *= (Node[i].deg - 1.);
		for(k = 0; k < temp; k++)
			check[queue[k]] = OFF;
		for(s = 0; s <= L; s++)
			lenght[s] = 0;
		return CI;
	}
}

void get_influencers(varNode *Node, int_t N, int_t **Graph, int L, int_t DECIM_STEP) {
	int_t i, j, cnt, last, toBeRemoved;
	int_t G_STEP;
	double G;
	
	int_t *queue, *check, *lenght;
	queue  = (int_t *)calloc(N + 1, sizeof(int_t));
	check  = (int_t *)calloc(N + 1, sizeof(int_t));
	lenght = (int_t *)calloc(L + 1, sizeof(int_t));
	
	FIT *fit = (FIT *)calloc(N, sizeof(FIT));
	
	G_STEP = (int_t)((0.0025)*N);
	
	for(i = 1; i <= N; i++) {
		Node[i].n = IN;
		Node[i].deg = Graph[i][0];
	}	
	for(i = 1; i <= N; i++) {
		fit[i-1].fit = get_CI(i, Node, N, Graph, L, queue, check, lenght);
		fit[i-1].id = i;		
	}
	sort(fit, N);
	
	cnt = 0;
	last = N - 1;
	G = 1.0;
	while(cnt < N && G > 1e-3) {
		toBeRemoved = fit[last].id;
		Node[toBeRemoved].n = OUT;
		last--;
		for(j = 1; j <= Graph[toBeRemoved][0]; j++)
			Node[Graph[toBeRemoved][j]].deg--;
		cnt++;
		
		if(!(cnt % DECIM_STEP)){
			for(i = 1; i <= N; i++) {
				if(Node[i].n == IN) {
					fit[i-1].fit = get_CI(i, Node, N, Graph, L, queue, check, lenght);
					fit[i-1].id = i;
				}
				else {
					fit[i-1].fit = -INFINITUM;
					fit[i-1].id = i;
				}
			}
			sort(fit, N);
			last = N - 1;
		}
		if(!(cnt % G_STEP)){
			G = (double)(bigCompNodes(Node,Graph, N))/N;
			fprintf(stdout, "%f %f\n", (double)cnt/N, G);
			fflush(stdout);
		}
	}
	free(fit);
}
		
int_t how_many_comp_would_join(int_t i, varNode *Node, int_t N, int_t **Graph) {
	int_t j, k, nj, deg_i, *flag;
	int num_joint_comp;
	no_yes choose_nj;
	
	if(Node[i].n == OUT) {
		num_joint_comp = 1;
		deg_i = Graph[i][0];		
		flag = (int_t *)calloc(deg_i + 1, sizeof(int_t));
		
		for(j = 1; j <= deg_i; j++)
			flag[j] = N+1;  //A number larger than N
		for(j = 1; j <= deg_i; j++) {
			nj = Graph[i][j];
			choose_nj = YES;
			for(k = 1; k <= num_joint_comp; k++){
				if(flag[k] == Node[nj].compNum)
					choose_nj = NO;
			}
			if(Node[nj].n == IN && choose_nj == YES) {
				flag[j] = Node[nj].compNum;
				num_joint_comp++;
			}
		}
		free(flag);
		return (num_joint_comp-1);
	}
	else {return N+2;} //A number larger than N
}

int_t *get_influencers_list(varNode *Node, int_t N, int_t **Graph, int L, int_t DECIM_STEP) {
	int_t i, j, cnt, last, first, toBeRemoved, toBeInserted;
	double G, G0;
	
	int_t *queue, *check, *lenght;
	queue  = (int_t *)calloc(N + 1, sizeof(int_t));
	check  = (int_t *)calloc(N + 1, sizeof(int_t));
	lenght = (int_t *)calloc(L + 1, sizeof(int_t));
	
	FIT *fit = (FIT *)calloc(N, sizeof(FIT));
	int_t *list_removed = (int_t *)calloc(N + 1, sizeof(int_t));
	double *giant_clust = (double *)calloc(N + 1, sizeof(double));
	int_t *list_influencer;
	
	for(i = 1; i <= N; i++) {
		Node[i].n = IN;
		Node[i].deg = Graph[i][0];
	}	
	for(i = 1; i <= N; i++) {
		fit[i-1].fit = get_CI(i, Node, N, Graph, L, queue, check, lenght);
		fit[i-1].id = i;		
	}
	sort(fit, N);
	
	cnt = 0;
	last = (N - 1);
	G0 = (double)(bigCompNodes(Node,Graph, N))/N;
	G = G0;
	while((cnt < N) && (G > G_MIN)) {
		toBeRemoved = fit[last].id;
		Node[toBeRemoved].n = OUT;
		last--;
		for(j = 1; j <= Graph[toBeRemoved][0]; j++)
			Node[Graph[toBeRemoved][j]].deg--;
		////////
		list_removed[cnt] = toBeRemoved;
		giant_clust[cnt] = G;
		///////
		cnt++;
		if(!(cnt % DECIM_STEP)){
			for(i = 1; i <= N; i++) {
				if(Node[i].n == IN) {
					fit[i-1].fit = get_CI(i, Node, N, Graph, L, queue, check, lenght);
					fit[i-1].id = i;
				}
				else {
					fit[i-1].fit = -INFINITUM;
					fit[i-1].id = i;
				}
			}   //Assign CI
			sort(fit, N);
			last = N - 1;
			G = (double)(bigCompNodes(Node,Graph, N))/N;
			
			//if(!(cnt % (int)(0.01*N))){
			//	fprintf(stdout, "#%.0f %% completed\n", (100.*(G0-G)/G0));
			//	fflush(stdout);
			//}
			 
		}
	}
	free(fit);
	
	
	////////
	fprintf(stdout, "\n");
	fflush(stdout);
	////////
	//REINSERTION
	
	int_t NumRemoved = cnt;
	cnt--;
	while(giant_clust[cnt] < G_THRESHOLD){
		Node[list_removed[cnt--]].n = IN;
		NumRemoved--;
	}
	
	fit = (FIT *)calloc(NumRemoved, sizeof(FIT));
	list_influencer = (int_t *)calloc(NumRemoved, sizeof(int_t));   //list with Influencers
	
	bigCompNodes(Node, Graph, N);
	for(i = 0; i < NumRemoved; i++){
		fit[i].fit = how_many_comp_would_join(list_removed[i], Node, N, Graph);
		fit[i].id  = list_removed[i];
	}
	sort(fit, NumRemoved);
	cnt = NumRemoved;
	first = 0;
	while(cnt > 0) {
		toBeInserted = fit[first].id;
		Node[toBeInserted].n = IN;
		first++;
		cnt--;
		list_influencer[cnt] = toBeInserted;
		if(!(cnt % DECIM_STEP)) {
			G = (double)(bigCompNodes(Node,Graph, N))/N;
			for(i = 0; i < NumRemoved; i++){
				if(Node[list_removed[i]].n == OUT) {
					fit[i].fit = how_many_comp_would_join(list_removed[i], Node, N, Graph);
					fit[i].id  = list_removed[i];
				}
				else {
					fit[i].fit = INFINITUM;
					fit[i].id  = list_removed[i];
				}
			}
			sort(fit, NumRemoved);
			first = 0;
			fprintf(stdout, "%f %f\n", (double)cnt/N, G);
			fflush(stdout);
		}
	}
	
	FILE *list_inf = fopen("Influencers.txt", "w");
	//fprintf(list_inf, "#LIST OF INFLUENCERS (IN DECREASING ORDER OF INFLUENCE)\n\n");
	//fprintf(list_inf, "#$1 = Rank $2 = Node_ID $3 = Degree\n\n");
	for(i = 0; i < NumRemoved; i++)
		fprintf(list_inf, "%ld %ld %ld\n", i+1, list_influencer[i], Graph[list_influencer[i]][0]);
	fclose(list_inf);
	free(queue);
	free(check);
	free(lenght);
	free(list_removed);
	free(fit);
	
	return list_influencer;
}


int main(int argc, char *argv[]){
	
	int_t i, N, **Graph, DECIM_STEP;
	int L;
	const char *network;
	
	if (argc != 3) {
		fprintf(stderr, "usage: %s <NETWORK_FILENAME> <L>\n", argv[0]);
		exit(1);
	}     //如果不是三个参数报错，第一个参数为当前文件名，第二个参数为数据文件名，第三个参数为半径大小

	network = argv[1];
	L = atoi(argv[2]);    //把字符串转换成整型数
	
	N = get_num_nodes(network);
	varNode *Node = (varNode *)calloc(N + 1, sizeof(varNode));     //动态分配内存
    Graph = makeRandomGraph(network, N);
    fprintf(stdout, "# Nodes %ld\n", N); 
	fprintf(stdout, "#L = %d\n\n", L);
	fflush(stdout);
	
	DECIM_STEP = (int_t)(0.001*N);
	
	int_t *list_influencer = get_influencers_list(Node, N, Graph, L, DECIM_STEP);
	
	return 0;
}
	
	

	

