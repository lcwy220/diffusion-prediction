# -*- coding: utf-8 -*-
import sys
import time
import tempfile
import pinyin
reload(sys)
sys.path.append('../')
from global_utils import key_es,hash_index_name,hash_index_type,hash_tag
from global_config import KEY_NODE_TOP_X,SENTIMENT_VALUE_MIN,SENTIMENT_VALUE_MAX,\
                          SENSITIVE_VALUE_MIN,SENSITIVE_VALUE_MAX,\
                          INFLUENCE_VALUE_MIN,INFLUENCE_VALUE_MAX
from utils import save_key_nodes_results,save_key_mblogs_results,\
                  save_key_edges_results,save_info_max_results

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
    
    print user_fans_rank

    if user_fans_rank:
        return user_fans_rank
    else:
        print 'es user fans rank error'
        return 'NULL'


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
    
    print negtive_user_fans_rank

    if negtive_user_fans_rank:
        return negtive_user_fans_rank
    else:
        print 'es negtive user fans rank error'
        return 'NULL'
   

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
    print input_tmp_path
    
    print 'step 2: pagerank', ts2date(time.time())
    all_uids_count, dg_sorted_uids, pr_sorted_uids = pagerank(ITER_COUNT, input_tmp_path, TOP_N, 'all')
    print 'pr_sorted_uids:',pr_sorted_uids
    print 'step 3: save', ts2date(time.time())
    save_count_results(all_uids_count, es_num)
    save_dg_pr_results(dg_sorted_uids, es_num, 'dg')    
    save_dg_pr_results(pr_sorted_uids, es_num, 'pr')    
    print 'save done', ts2date(time.time())


def get_sensitive_user_fans_rank(hash_tag):
   
    query_body = {
        'query':{  
            'bool':{
                'should':[{
                    'bool':{
                        'must':[
                            {'term':{'event': hash_tag}},
                            {'range':{'sensitive':{'gt':SENSITIVE_VALUE_MIN,'lt':SENSITIVE_VALUE_MAX}}},
                            {'range':{'influence':{'gt':INFLUENCE_VALUE_MIN,'lt':INFLUENCE_VALUE_MAX}}}
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
    
    print sensitive_user_fans_rank

    if sensitive_user_fans_rank:
        return sensitive_user_fans_rank
    else:
        print 'es sensitive user fans rank error'
        return 'NULL'
    
def compute_key_nodes(hash_tag):
    fans_rank = get_user_fans_rank(hash_tag)
    negtive_rank = get_negtive_user_fans_rank(hash_tag)
    #pagerank_rank = pagerank_rank()
    pagerank_rank = {}
    sensitive_rank = get_sensitive_user_fans_rank(hash_tag)
    save_key_nodes_results(hash_tag,fans_rank,negtive_rank,pagerank_rank,sensitive_rank)


if __name__ == '__main__':
    
    compute_key_nodes(hash_tag)
