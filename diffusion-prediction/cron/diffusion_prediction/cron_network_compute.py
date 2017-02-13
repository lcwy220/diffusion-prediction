# -*- coding: utf-8 -*-
import sys
import time
import tempfile
import pinyin
import json
from igraph import *
from collections import defaultdict
reload(sys)
sys.path.append('../')
from global_utils import key_es,hash_index_name,hash_index_type,hash_tag,\
                         get_net_dic_pr,get_undirect_dic,\
                         search_hash_tag,get_net_dic,\
                         be_retweet_es,be_retweet_index_name,be_retweet_index_type,\
			 pagerank_index_name,pagerank_index_type

from global_config import KEY_NODE_TOP_X,SENTIMENT_VALUE_MIN,SENTIMENT_VALUE_MAX,\
                          SENSITIVE_VALUE_MIN,SENSITIVE_VALUE_MAX,\
                          INFLUENCE_VALUE_MIN,INFLUENCE_VALUE_MAX

from utils import save_key_nodes_results,save_key_mblogs_results,\
                  save_key_edges_results,save_info_max_results,\
                  save_dg_pr_results, get_es_num, write_tmp_file

from time_utils import ts2date


from spam.pagerank_for_portrait import pagerank
from pagerank_config import ITER_COUNT,TOP_N # 默认值为1

#信息引导集
import sys,os,subprocess,commands
from subprocess import Popen,PIPE

#from cron_user_portrait_network_mappings import network_es_mappings, network_count_es_mappings



'''
KEY_NODE_ES_HOST = '10.128.131.138'
KEY_NODE_ES_PORT = '9200'
from elasticsearch import Elasticsearch
key_es = Elasticsearch(KEY_NODE_ES_HOST,timeout=6000)
hash_index_name = 'event'
hash_index_type = 'text'
KEY_NODE_TOP_X = 10

'''
#hash_tag = '赵雅淇洒泪道歉'
#hash_tag = HASH_TAG


#关键点计算

#关键点类型一
def get_user_fans_rank(hash_tag):
   
    query_body = {
        'query':{  
            'bool':{
                'should':[{'bool':{'must':{'term':{'event': hash_tag}}}}]
            }
        },
        'sort':[{'user_fansnum': 'desc'}],        #按降序排列
        'size':KEY_NODE_TOP_X
    }


    user_fans_rank = key_es.search(index=hash_index_name, doc_type=hash_index_type,\
                                    body=query_body)['hits']['hits']
    
    #print user_fans_rank

    if user_fans_rank:
        return user_fans_rank
    else:
        print 'es user fans rank error'
        return 'NULL'

#关键点类型二
def get_negtive_user_fans_rank(hash_tag):
   
    query_body = {
        'query':{  
            'bool':{
                'should':[{
                    'bool':{
                        'must':[
                            {'term':{'event': hash_tag}},
                            {'range':{'sentiment':{'gt':SENTIMENT_VALUE_MIN,'lt':SENTIMENT_VALUE_MAX}}}
                        ]
                    }
                }]
            }
        },
        'sort':[{'user_fansnum': 'desc'}],        #按降序排列
        'size':KEY_NODE_TOP_X
    }


    negtive_user_fans_rank = key_es.search(index=hash_index_name, doc_type=hash_index_type,\
                                    body=query_body)['hits']['hits']
    
    #print negtive_user_fans_rank

    if negtive_user_fans_rank:
        return negtive_user_fans_rank
    else:
        print 'es negtive user fans rank error'
        return 'NULL'
   
#关键点类型三

def pagerank_rank():
    timestamp = time.time()
    net_dic_pr = get_net_dic_pr()
    
    '''
    es_num = get_es_num(timestamp)
    
    if es_num == 0:
        network_es_mappings()
        network_count_es_mappings()
    '''
    tmp_file = tempfile.NamedTemporaryFile(delete=False)

    print 'step 1: write', ts2date(timestamp)
    for key in net_dic_pr:

        write_tmp_file(tmp_file,key,net_dic_pr[key])

    tmp_file.close()
    if not tmp_file:
        return
    input_tmp_path = tmp_file.name
    #print input_tmp_path
    
    print 'step 2: pagerank', ts2date(time.time())
    all_uids_count, dg_sorted_uids, pr_sorted_uids = pagerank(ITER_COUNT, input_tmp_path, TOP_N, 'all')
    #print 'pr_sorted_uids:',pr_sorted_uids
    print 'step 3: save', ts2date(time.time())
    #save_count_results(all_uids_count, es_num)
    save_dg_pr_results(dg_sorted_uids, es_num, 'dg')    
    save_dg_pr_results(pr_sorted_uids, es_num, 'pr')    
    print 'save done', ts2date(time.time())


#关键点类型四

def get_sensitive_user_fans_rank(hash_tag):
   
    query_body = {
        'query':{  
            'bool':{
                'should':[{
                    'bool':{
                        'must':[
                            {'term':{'event': hash_tag}},
                            {'range':{'sensitive':{'gt':SENSITIVE_VALUE_MIN,'lt':SENSITIVE_VALUE_MAX}}}
                        ]
                    }
                }]
            }
        },
        'sort':[{'user_fansnum': 'desc'}],        #按降序排列
        'size':KEY_NODE_TOP_X
    }


    sensitive_user_fans_rank = key_es.search(index=hash_index_name, doc_type=hash_index_type,\
                                    body=query_body)['hits']['hits']
    
    #print sensitive_user_fans_rank

    if sensitive_user_fans_rank:
        return sensitive_user_fans_rank
    else:
        print 'es sensitive user fans rank error'
        return 'NULL'


#关键微博计算

#关键微博类型一
def get_mblog_retweet_rank(hash_tag):
   
    query_body = {
        'query':{  
            'bool':{
                'should':[{'bool':{'must':{'term':{'event': hash_tag}}}}]
            }
        },
        'sort':[{'retweeted': 'desc'}],        #按降序排列
        'size':KEY_NODE_TOP_X
    }


    mblog_retweet_rank = key_es.search(index=hash_index_name, doc_type=hash_index_type,\
                                    body=query_body)['hits']['hits']
    
    #print mblog_retweet_rank

    if mblog_retweet_rank:
        return mblog_retweet_rank
    else:
        print 'es mblog retweet rank error'
        return 'NULL'

#关键微博类型二
def get_negtive_mblog_retweet_rank(hash_tag):
   
    query_body = {
        'query':{  
            'bool':{
                'should':[{
                    'bool':{
                        'must':[
                            {'term':{'event': hash_tag}},
                            {'range':{'sentiment':{'gt':SENTIMENT_VALUE_MIN,'lt':SENTIMENT_VALUE_MAX}}}
                        ]
                    }
                }]
            }
        },
        'sort':[{'retweeted': 'desc'}],        #按降序排列
        'size':KEY_NODE_TOP_X
    }


    negtive_mblog_retweet_rank = key_es.search(index=hash_index_name, doc_type=hash_index_type,\
                                    body=query_body)['hits']['hits']
    
    #print negtive_mblog_retweet_rank

    if negtive_mblog_retweet_rank:
        return negtive_mblog_retweet_rank
    else:
        print 'es negtive mblog retweet rank error'
        return 'NULL'


#关键边和未来边计算

def get_vertices_edges():
 
    global edges 
    edges = set()
    vertices = set()
    net_dic = get_net_dic()
    for key in net_dic:
        vertices.add(key)
        for item in net_dic[key]:
            if item != key:
                vertices.add(item)
                edges.add((key,item,int(net_dic[key][item])))  #给边加权   
    
    vertices = list(vertices)
    edges = list(edges)
   
    print '边总数:',len(edges)
    print '节点总数:',len(vertices)

    return vertices,edges,net_dic


def draw_graph(vertices,edges):    
   
    #定义无向图
    g = Graph()
    
    for vertex in vertices:      
        g.add_vertex(vertex)

    for i in range(len(edges)): 
        g.add_edge(edges[i][0],edges[i][1],weight = edges[i][2])
    
    print 'degree_top30:',sorted(g.degree(),reverse=True)[:30]
    
    vertexID_2_uid = {}

    for k in g.vs:
        vertexID_2_uid[k.index] = k['name']   
    #多水平算法

    #起始时间
    start_time_ts = time.time()
    start_time_datetime = ts2datetime_full(start_time_ts)
    print 'community_multilevel_start:',start_time_datetime
    
    #划分社区

    g_community = g.community_multilevel(weights = g.es["weight"],return_levels=False)
    
    
    #结束时间
    end_time_ts = time.time()
    end_time_date = ts2datetime_full(end_time_ts)
    print 'community_multilevel_end:',end_time_date
    
    '''
    #标签传递算法
    #起始时间
    start_time_ts = time.time()
    start_time_datetime = ts2datetime_full(start_time_ts)
    print 'community_label_propagation_start:',start_time_datetime

    g_community = g.community_label_propagation(weights = g.es["weight"])
        
    end_time_ts = time.time()
    end_time_date = ts2datetime_full(end_time_ts)
    print 'community_label_propagation_end:',end_time_date
    '''
    
    return g_community,g,edges,vertexID_2_uid


def search_key_edges(g_community,g,edges):
    
    g_community_total = g_community.__len__()
    #print 'g_community_total!!!!!!',g_community_total
    g_community_unsorted = []
    for i in range(g_community_total):
        g_community_unsorted.append((i,len(g_community[i])))
        
    g_community_sorted = sorted(g_community_unsorted,key=lambda x:x[1],reverse=True)
    
    top_x = 0
    top_commu_x = 0
    min_commu = len_vertices*0.70
    print '社区总数：',g_community_total
    print 'g_community_sorted:',g_community_sorted

    for i in range(g_community_total):

        top_x = top_x + g_community_sorted[i][1]

        top_commu_x = i+1

        if top_x > min_commu:
            print 'top社区数:',top_commu_x
            break
    print 'top社区中节点总数：',top_x
    print 'top社区中节点覆盖比率：',float(top_x)/len_vertices
    
    g_community_sorted_top_x = g_community_sorted[:top_commu_x]
    print 'g_community_sorted_top_x:',g_community_sorted_top_x
    top_community_dic={}
    g_community_sorted_top_x_commu = []
    
    
    for i in range(len(g_community_sorted_top_x)):
             
        commu_id_i = g_community_sorted_top_x[i][0]
        g_community_sorted_top_x_commu.append(commu_id_i)
        
        for j in range(len(g_community[commu_id_i])):
            commu_vertex_uid = g.vs[g_community[commu_id_i][j]]['name']       
            top_community_dic[commu_vertex_uid] = commu_id_i
        
   
    #定义社区间边的字典集合    
    key_edges_dic = {}
    for edge_s_commu in g_community_sorted_top_x_commu:    
        for edge_t_commu in g_community_sorted_top_x_commu:
            if edge_s_commu != edge_t_commu:
                if key_edges_dic.has_key((edge_t_commu,edge_s_commu)) == False:
                    key_edges_dic[(edge_s_commu,edge_t_commu)] = []
    
    for i in range(len(edges)):
        edge_s = edges[i][0]
        edge_t = edges[i][1]
        if top_community_dic.has_key(edge_s) and top_community_dic.has_key(edge_t):
            
            edge_s_commu = top_community_dic[edge_s]
            edge_t_commu = top_community_dic[edge_t]
            
            if edge_s_commu != edge_t_commu:
                
                if key_edges_dic.has_key((edge_s_commu,edge_t_commu)):
                    key_edges_dic[(edge_s_commu,edge_t_commu)].append(edges[i])
                else:
                    key_edges_dic[(edge_t_commu,edge_s_commu)].append(edges[i])
     
    return key_edges_dic,g
                  

def nodes_degree(vertices,g, vertexID_2_uid):

    nodes_dg = {}
    for k in g.vs:

        nodes_dg[vertexID_2_uid[k.index]] = g.degree(k.index,mode = ALL,loops=False)
        
    sort_nodes_dg = sorted(nodes_dg.items(),key=lambda x:x[1],reverse=True)[:10]
    print 'sort_nodes_dg:',sort_nodes_dg

    return sort_nodes_dg

 
def get_future_edges(sort_nodes_dg):
    hub_list = []
    hub_node = {}
    for i in range(len(sort_nodes_dg)):
        hub_list.append(sort_nodes_dg[i][0])
  
    be_retweet_result = be_retweet_es.mget(index=be_retweet_index_name,doc_type=be_retweet_index_type,body={'ids':hub_list})['docs']
    print 'be_retweet_result::',be_retweet_result[0]['_source'].keys()
    total_be_retweet_num = 0
    top_be_retweet_uid_dic = defaultdict(list)

    for result in be_retweet_result:
	uid_be_retweet_dic = json.loads(result['_source']['uid_be_retweet'])
	uid_be_retweet_dic_new = {}
        for key in uid_be_retweet_dic:
	    uid_be_retweet_dic_new[key] = int(uid_be_retweet_dic[key])
	    total_be_retweet_num += int(uid_be_retweet_dic[key])
	sort_uid_be_retweet = sorted(uid_be_retweet_dic_new.items(),key=lambda x:x[1],reverse=True)[:10]
	top_be_retweet_uid_dic[result['_source']['uid']].append(sort_uid_be_retweet)
	
	'''
	i = 0
	be_retweet_count = 0
	cover_rate = 0.05
	for item in sort_uid_be_retweet:
	    be_retweet_count += item[1]
	    top_be_retweet_uid_dic[result['_source']['uid']].append(item)
	    if be_retweet_count > total_be_retweet_num*cover_rate:
		break
	'''

    be_retweet_dic = {}
    sorted_be_retweet_dic = {}
    for i in range(len(be_retweet_result)):

        uid = be_retweet_result[i]['_id']
        be_retweet_dic[uid] = json.loads(be_retweet_result[i]['_source']['uid_be_retweet'])   
    for key_item in be_retweet_dic: 
        sorted_be_retweet_dic[key_item] = sorted(be_retweet_dic[key_item].items(),key=lambda x:int(x[1]),reverse = True)[:100]
    
    #print 'sorted_be_retweet_dic:::',sorted_be_retweet_dic
    #结合pagerank（从pagerank数据库取数据）
    
    future_edges = []
    uid_list = []
    for item in sorted_be_retweet_dic:
	for uid_num in sorted_be_retweet_dic[item]:
            uid_list.append(uid_num[0])
        pagerank_es_results = key_es.mget(index=pagerank_index_name, doc_type=pagerank_index_type,body={'ids':uid_list})['docs']
         
	print 'pagerank_es_results:::',pagerank_es_results
        sorted_pagerank_uids = sorted(pagerank_es_results,key=lambda x:x['_source']['rank_pr'],reverse=True)[:20]
	for uid_result in sorted_pagerank_uids:
            future_edges.append((item,uid_result['_source']['uid']))
       
    print future_edge

  
def calculate_weak_link(key_edges_dic,g):
    weak_link_dic = {}
    for key in key_edges_dic:
        weak_link_dic[key] = []
        edges_id_tuple = key_edges_dic[key]
        
        for i in range(len(edges_id_tuple)):
           
            for k in g.vs:
              
                if edges_id_tuple[i][0] == k['name']:
                    
                    id_m = k.index
                    #print '251!!!!',id_m
                    degree_m = g.vs[id_m].degree()
                elif edges_id_tuple[i][1] == k['name']:
                    id_n = k.index
                    degree_n = g.vs[id_n].degree()
         
            similarity = g.similarity_dice([id_m,id_n])
       
            common_m_n = round(similarity[0][1]*(degree_m+degree_n)/2)
           
            if degree_m - 1 + degree_n - 1 - common_m_n != 0: 
                weak_link_m_n = common_m_n/(degree_m - 1 + degree_n - 1 - common_m_n)
            else:
                weak_link_m_n = 'None'
            weak_link_dic[key].append((edges_id_tuple[i][0],edges_id_tuple[i][1],weak_link_m_n))
    for k, v in weak_link_dic.items():
        if not v: weak_link_dic.pop(k)  
             
    return weak_link_dic

    
    
def cut_weak_link(weak_link_dic):
    
    weak_link_sorted={}   
    
    for item in weak_link_dic:
        
        weak_link_commu = item
        weak_link_sorted[weak_link_commu] = []
        if weak_link_dic[item]:
            weak_link_sorted[weak_link_commu].append(sorted(weak_link_dic[item],key=lambda x:x[2],reverse=True))  
    print '弱连接边社区对：',len(weak_link_sorted.keys())
    print '弱连接边集合：',weak_link_sorted
    
    return weak_link_sorted
    

def uid2id(undirect_dic):
    i = 1
    id_dic = {}
    for key in undirect_dic:
        if id_dic.has_key(key) == False:
            id_dic[key] = i
            i+=1
        else:
            continue
    #print 'undirect_dic:::',undirect_dic    
    '''
    for key in undirect_dic:
        for k in range(len(undirect_dic[key])):
            if id_dic.has_key(key) == False:
                id_dic[key] = i
                i+=1
            else:
                continue
    '''
    return id_dic

def save_to_txt(undirect_dic,id_dic):

    #id_dic = uid2id(undirect_dic)
    f=open('id_data.txt','w+')
    for key in undirect_dic:
	#print 'type_undirect_dic:::',undirect_dic[key]
        uid_str = []
        uid_str.append(str(id_dic[key]))
        for i in range(len(undirect_dic[key])):
            uid_str.append(str(id_dic[undirect_dic[key][i]]))
        uid_str = ' '.join(uid_str)
        f.write(uid_str+'\n')
    f.close()


#信息引导集及保存入表

def start_ci(filename,L,id_dic):
    print 'start_CI:',time.ctime()
    L = str(L)
    command_popen = './CI'+' '+filename+' '+L
    print 'command_popen',command_popen
    p2 = Popen(command_popen,shell=True,stdout=PIPE)
    result = p2.stdout.read()
    #print "out:",result
    print 'end_CI:',time.ctime()
    #return result
    
    #读取Influencers.txt文件

    fo=open('Influencers.txt','r+')
    lines = fo.readlines()
    influencer_list=[]
    for line in lines:
        line = line.split('')
        influencer_list.append(line)
    #print id_list

    influencer_uid_dic = {}
    for i in range(len(influencer_list)):
        for key in id_dic:
            if id_dic[key] == influencer_list[i][1]:
                influencer_uid_dic['rank'] = influencer_list[i][0]
		influencer_uid_dic['uid']= key
		influencer_uid_dic['degree']= influencer_list[i][2]
    #print 'uid_list',uid_list

    #return uid_list
    save_info_max_results(hash_tag,influencer_uid_dic)


def ts2datetime_full(ts):
    return time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(ts))

    

#关键点保存入表
def compute_key_nodes(hash_tag):
    fans_rank = get_user_fans_rank(hash_tag)
    negtive_rank = get_negtive_user_fans_rank(hash_tag)
    #pagerank_rank = pagerank_rank()
    pagerank_rank = {}
    sensitive_rank = get_sensitive_user_fans_rank(hash_tag)
    save_key_nodes_results(hash_tag,fans_rank,negtive_rank,pagerank_rank,sensitive_rank)

    
#关键微博保存入表
def compute_key_mblogs(hash_tag):

    retweet_rank = get_mblog_retweet_rank(hash_tag)
    negtive_rank = get_negtive_mblog_retweet_rank(hash_tag)
    save_key_mblogs_results(hash_tag,retweet_rank,negtive_rank)


#关键边保存入表
def compute_key_edge(hash_tag):
   
    #执行函数

    result_dic = search_hash_tag(hash_tag)

    if not result_dic:
        return '{}'
    
    #得到点和边的集合

    vertices,edges,net_dic = get_vertices_edges()
    
    global len_vertices
    
    len_vertices = len(vertices)
    
    undirect_dic = get_undirect_dic(result_dic)
    #print 'undirect_dic:::',undirect_dic
    id_dic = uid2id(undirect_dic)
    save_to_txt(undirect_dic,id_dic)
    
    
    #由边和点进行画图
    g_community,g,edges,vertexID_2_uid = draw_graph(vertices,edges)
    
    #寻找社区之间的边
    key_edges_dic,g = search_key_edges(g_community,g,edges)

    #计算弱连接边集合
    weak_link_dic = calculate_weak_link(key_edges_dic,g)

    #返回阻塞边集合
    weak_link_sorted = cut_weak_link(weak_link_dic)

    sort_nodes_dg = nodes_degree(vertices,g,vertexID_2_uid)

    sorted_future_edges = get_future_edges(sort_nodes_dg)
    
    save_key_edges_results(hash_tag,weak_link_sorted,sorted_future_edges)

    #return weak_link_sorted,sorted_future_edges
    filename = 'id_data.txt'
    
    start_ci(filename,L,id_dic)


if __name__ == '__main__':

    time_1 = time.time()

    compute_key_nodes(hash_tag)
    
    time_2 = time.time()
    
    compute_key_mblogs(hash_tag)
    
    time_3 = time.time()
    
    compute_key_edge(hash_tag)
    
    time_4 = time.time()

    print 'key_nodes_time:::',time_2-time_1
    print 'key_mblogs_time:::',time_3-time_2
    print 'key_edges_time:::',time_4-time_3

    
