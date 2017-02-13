# -*- coding: utf-8 -*-
import sys
import time
import tempfile
reload(sys)
sys.path.append('../../')
from global_utils import key_es,hash_index_name,hash_index_type
from global_config import KEY_NODE_TOP_X
'''
KEY_NODE_ES_HOST = '10.128.131.138'
KEY_NODE_ES_PORT = '9200'
from elasticsearch import Elasticsearch
key_es = Elasticsearch(KEY_NODE_ES_HOST,timeout=6000)
hash_index_name = 'event'
hash_index_type = 'text'
KEY_NODE_TOP_X = 10

'''
hash_tag = '赵雅淇洒泪道歉'

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
    
    print mblog_retweet_rank

    if mblog_retweet_rank:
        return mblog_retweet_rank
    else:
        print 'es mblog retweet rank error'
        return 'NULL'
    
get_mblog_retweet_rank(hash_tag)