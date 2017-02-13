# -*- coding: utf-8 -*-
import redis
import sys
import time
import tempfile
from elasticsearch import Elasticsearch
from global_config import KEY_NODE_ES_HOST,KEY_NODE_ES_PORT,\
                          KEY_ES,HASH_INDEX_NAME,HASH_INDEX_TYPE,HASH_TAG,SIZE_K,\
                          BE_RETWEET_ES_HOST,BE_RETWEET_ES_PORT,BE_RETWEET_ES,\
                          BE_RETWEET_INDEX_NAME,BE_RETWEET_INDEX_TYPE,\
			  PAGERANK_INDEX_NAME,PAGERANK_INDEX_TYPE

#from spam.pagerank_for_portrait import pagerank
from pagerank_config import PAGERANK_ITER_MAX # 默认值为1

#from cron_user_portrait_network_mappings import network_es_mappings, network_count_es_mappings
#from utils import scan_retweet, save_dg_pr_results, get_es_num, save_count_results
from time_utils import ts2date


key_es = KEY_ES
hash_index_name = HASH_INDEX_NAME
hash_index_type = HASH_INDEX_TYPE
hash_tag = HASH_TAG
k=SIZE_K

be_retweet_es = BE_RETWEET_ES
be_retweet_index_name =  BE_RETWEET_INDEX_NAME
be_retweet_index_type = BE_RETWEET_INDEX_TYPE

pagerank_index_name = PAGERANK_INDEX_NAME
pagerank_index_type = PAGERANK_INDEX_TYPE

def search_hash_tag(hash_tag):
    query_body = {
        'query':{  
            'bool':{
                'should':[{'bool':{'must':{'term':{'event': hash_tag}}}}]
            }
        },
        'sort':[{'timestamp': 'asc'}],        
        'size':k
    }
    
    result_dic = {}
    result_dic['uid']=[]
    result_dic['root_uid']=[]

        
    es_result = key_es.search(index=hash_index_name, doc_type=hash_index_type,\
                                    body=query_body)['hits']['hits']
    try: 
        print len(es_result)        
        
        for item in es_result:
            #print item
            result_dic['uid'].append(item['_source']['uid'])
            if item['_source'].has_key('root_uid'):
                result_dic['root_uid'].append(item['_source']['root_uid'])
            else:
                result_dic['root_uid'].append('None')
        return result_dic
    except:
        result_dic = {}
        print 'No results!'
        return result_dic


def get_net_dic():
    
    result_dic = search_hash_tag(hash_tag)

    net_dic = {}

    for i in range(len(result_dic['root_uid'])):
        
        if result_dic['root_uid'][i] != 'None':   #避免加入离散点
       
            #统计转发次数
            if net_dic.has_key(result_dic['root_uid'][i]):
                if net_dic[result_dic['root_uid'][i]].has_key(result_dic['uid'][i]):
                    net_dic[result_dic['root_uid'][i]][result_dic['uid'][i]] +=1
                    
                else:
                    net_dic[result_dic['root_uid'][i]][result_dic['uid'][i]] = 1
            else:
                if net_dic.has_key(result_dic['uid'][i]):
                    if net_dic.has_key(result_dic['uid'][i]).has_key(result_dic['root_uid'][i]):
                        net_dic[result_dic['uid'][i]][result_dic['root_uid'][i]] +=1 
                net_dic[result_dic['root_uid'][i]]={}
                net_dic[result_dic['root_uid'][i]][result_dic['uid'][i]] = 1
            
        else:
            continue
    
    return net_dic


def get_net_dic_pr(result_dic):
  
    net_dic_pr = {}

    for i in range(len(result_dic['uid'])):
        
        if result_dic['root_uid'][i] != 'None':   #避免加入离散点
       
            
            #统计转发次数，为后面加权
            
            if net_dic_pr.has_key(result_dic['root_uid'][i]):
                if net_dic_pr[result_dic['uid'][i]].has_key(result_dic['root_uid'][i]):
                    net_dic_pr[result_dic['uid'][i]][result_dic['root_uid'][i]] +=1
                else:
                    net_dic_pr[result_dic['uid'][i]][result_dic['root_uid'][i]] = 1
            else:
                net_dic_pr[result_dic['uid'][i]]={}
                net_dic_pr[result_dic['uid'][i]][result_dic['root_uid'][i]] = 1
        else:
            continue
    
    return net_dic_pr


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
