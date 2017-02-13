# -*- coding: utf-8 -*-
"""
Created on Tue Dec 13 23:45:07 2016

@author: YuanHR
"""

from elasticsearch import Elasticsearch
from igraph import *
import time
import json
from global_utils import search_hash_tag,get_net_dic,hash_tag,\
                         be_retweet_es,be_retweet_index_name,be_retweet_index_type


#hash_tag = '赵雅淇洒泪道歉'

def uid2id(undirect_dic):
    i = 1
    id_dic = {}
    for key in undirect_dic:
	if id_dic.has_key(key) == False:
	    id_dic[key] = i
	    i+=1
	else:
	    continue
	
    for key in undirect_dic:
	for k in range(len(undirect_dic[key])):
	    if id_dic.has_key(key) == False:
	        id_dic[key] = i
		i+=1
	    else:
		continue
    return id_dic

def save_to_txt(undirect_dic):

    id_dic = uid2id(undirect_dic)
    f=open('id_data.txt','w+')
    for key in undirect_dic:
        uid_str = []
        uid_str.append(str(id_dic[key]))
        for i in range(len(undirect_dic[key])):
            uid_str.append(str(id_dic[undirect_dic[key][i]]))
        uid_str = ' '.join(uid_str)
        f.write(uid_str+'\n')
    f.close()

def get_undirect_dic(result_dic):
    if result_dic:
        undirect_dic = {}
        for i in range(len(result_dic['root_uid'])):
            if result_dic['root_uid'][i] != 'None':   #避免加入离散点
                if undirect_dic.has_key(result_dic['root_uid'][i]):
                    undirect_dic[result_dic['root_uid'][i]].append(result_dic['uid'][i])
                else:
                    undirect_dic[result_dic['root_uid'][i]]=[]
                    undirect_dic[result_dic['root_uid'][i]].append(result_dic['uid'][i])

                if undirect_dic.has_key(result_dic['uid'][i]):
                    undirect_dic[result_dic['uid'][i]].append(result_dic['root_uid'][i])
                else:
                    undirect_dic[result_dic['uid'][i]]=[]
                    undirect_dic[result_dic['uid'][i]].append(result_dic['root_uid'][i]) 
        return undirect_dic
    

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
                #print 'key:',key
                #print 'item:',item
                #print 'net_dic',net_dic
                #print 'type:',type(item)
                #print 'net_dic[][]',net_dic[key][item]
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
    
    #top_x = int(g_community_total*0.005)  #设置社区top_x值
    
    top_x = 0
    top_commu_x = 0
    min_commu = len_vertices*0.70
    print '社区总数：',g_community_total
    print 'g_community_sorted:',g_community_sorted
    # i = 0
    for i in range(g_community_total):
       # i += 1
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
    print '123edges'
    nodes_dg = {}
    for k in g.vs:
    	#print 'k::::',k
        #print 'k.index',k.index
   
        nodes_dg[vertexID_2_uid[k.index]] = g.degree(k.index,mode = ALL,loops=False)
        
    sort_nodes_dg = sorted(nodes_dg.items(),key=lambda x:x[1],reverse=True)[:10]
    print 'sort_nodes_dg:',sort_nodes_dg
    return sort_nodes_dg
 
'''
def get_be_retweet_num(uid):
    query_body = {
        'query':{
            'term':{'uid':uid}
        }

    } 
    
    be_retweet_result = be_retweet_es.mget(index=be_retweet_name,doc_type=be_retweet_type,body=query_body)['docs']
   
    print 'be_retweet_result:',be_retweet_result
    return be_retweet_result
'''    
def get_future_edges(sort_nodes_dg):
    hub_list = []
    hub_node = {}
    for i in range(len(sort_nodes_dg)):
        hub_list.append(sort_nodes_dg[i][0])
   # hub_list.append(sort_nodes_dg[0][0])
   # hub_list.append(sort_nodes_dg[1][0])
    #print 'hub_list:',hub_list 
    #print 'be_retweet_index_name:',be_retweet_index_name
    #print 'be_retweet_index_type:',be_retweet_index_type
    #print 'query_body:',{'ids':hub_list}   

    be_retweet_result = be_retweet_es.mget(index=be_retweet_index_name,doc_type=be_retweet_index_type,body={'ids':hub_list})['docs']
    #print 'type:',type(be_retweet_result)
    #print 'result:',be_retweet_result
    be_retweet_dic = {}
    sorted_be_retweet_dic = {}
    for i in range(len(be_retweet_result)):

        uid = be_retweet_result[i]['_id']
        be_retweet_dic[uid] = json.loads(be_retweet_result[i]['_source']['uid_be_retweet'])   
    for key_item in be_retweet_dic: 
        sorted_be_retweet_dic[key_item] = sorted(be_retweet_dic[key_item].items(),key=lambda x:int(x[1]),reverse = True)[:10]
    print sorted_be_retweet_dic
   # be_retweet_result = get_be_retweet_num(key)
    #    if hub_node.has_key(key) == False:
     #       hub_node[key] = []
        #    hub_node[key].append()

         
    
    

  
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
    

def ts2datetime_full(ts):
    return time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(ts))


def compute_key_edge():
   
    #执行函数
    #print 'hash_tag',hash_tag
    #result_dic = search_uid()
    result_dic = search_hash_tag(hash_tag)
    #print 'result',result_dic 
    
    if not result_dic:
        return '{}'
    
    #得到点和边的集合

    vertices,edges,net_dic = get_vertices_edges()
    
    global len_vertices
    
    len_vertices = len(vertices)
    
    undirect_dic = get_undirect_dic(result_dic)
    save_to_txt(undirect_dic)
    
    
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
    
    save_key_edges_results(weak_link_sorted,sorted_future_edges)
    return weak_link_sorted,sorted_future_edges
    

if __name__=='__main__':

     #开始时间
    log_time_ts = time.time()
    log_time_date = ts2datetime_full(log_time_ts)
    print 'start_time:',log_time_date

    vertices = []
    edges = []
    net_dic = {}
    undirect_dic = {}
 
    compute_key_edge()

    #结束时间
    log_time_ts = time.time()
    log_time_date = ts2datetime_full(log_time_ts)
    print 'end_time:' + log_time_date
    
    



    

