# -*- coding: utf-8 -*-
import sys
import time
import tempfile
reload(sys)
sys.path.append('../../')
from global_utils import key_es,hash_index_name,hash_index_type
from global_config import KEY_NODE_USER_FANS_TOP_X,SENTIMENT_VALUE_MIN,SENTIMENT_VALUE_MAX
'''
KEY_NODE_ES_HOST = '10.128.131.138'
KEY_NODE_ES_PORT = '9200'
from elasticsearch import Elasticsearch
key_es = Elasticsearch(KEY_NODE_ES_HOST,timeout=6000)
hash_index_name = 'event'
hash_index_type = 'text'
KEY_NODE_TOP_X = 10
SENTIMENT_VALUE_MIN = 1  #sentiment从2至7表示负向情绪
SENTIMENT_VALUE_MAX = 8
'''
hash_tag = '赵雅淇洒泪道歉'

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
    
    print negtive_mblog_retweet_rank

    if negtive_mblog_retweet_rank:
        return negtive_mblog_retweet_rank
    else:
        print 'es negtive mblog retweet rank error'
        return 'NULL'
    
get_negtive_mblog_retweet_rank(hash_tag)