The Collective Influence (CI) Algorithm is an algorithm to identify the most important nodes in a complex network. It returns the minimal number of structural influencers to fragment the giant component.

For more information see: F. Morone, H. A. Makse. Influence maximization in complex networks through optimal percolation, Nature 524,65-68 (06 August 2015)

Full explanation of the algorithm is found in the Supplementary Information Section of the Nature paper at the Nature website.

The code implements also a refinement of the main CI algorithm in order to minimize the giant component when G > 0, by adding back nodes in the 
network after the percolation threshold has been detected. You can find more details in the Supplementary material Sec VA of the aforementioned paper.


To compile the source code use the command



gcc -o CI CI.c -lm -O3 



The program requires as input the file containing  the network 
and  the value of L (the radius of the Ball).


To run use the command:



./CI <NETWORK_FILENAME> <L>



The file with the network must be in the form of an adjacency list of this type:


1 3255 18210 24119 70247 

2 9205 88665 89859 

3 32824 53070 

4 25046 41508 
.........
3255 1 34913 73168



For each line the first number is the node_ID and the following numbers its neighbors.



The program prints at screen the values of (q,G), where q is the fraction of removed nodes, and creates a file "Influencers.txt" with a list of the influencers in the network, ordered by decreasing influence. 