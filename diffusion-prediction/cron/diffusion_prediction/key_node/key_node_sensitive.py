# -*- coding: utf-8 -*-
import sys
import time
import tempfile
reload(sys)
sys.path.append('../../')
from global_utils import key_es,hash_index_name,hash_index_type,hash_tag
from global_config import KEY_NODE_USER_FANS_TOP_X,SENTIMENT_VALUE_MIN,SENTIMENT_VALUE_MAX
'''
KEY_NODE_ES_HOST = '10.128.131.138'
KEY_NODE_ES_PORT = '9200'
from elasticsearch import Elasticsearch
key_es = Elasticsearch(KEY_NODE_ES_HOST,timeout=6000)
hash_index_name = 'event'
hash_index_type = 'text'
KEY_NODE_TOP_X = 10
SENSITIVE_VALUE_MIN = 0  #sensitive大于0表示敏感
SENSITIVE_VALUE_MAX = 10000
'''
#hash_tag = '赵雅淇洒泪道歉'

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
    
get_sensitive_user_fans_rank(hash_tag)