# -*- coding:UTF-8 -*-
#import time
from elasticsearch import Elasticsearch
from global_utils import key_es as es
#from time_utils import ts2datetime, datetime2ts


#use to mappings for key nodes es
def key_nodes_es_mappings():
    index_info = {
            'settings':{
                'number_of_shards':5,
                'number_of_replicas':0
                },
            'mappings':{
                'node':{
                    'properties':{
                        'hash_tag':{
                            'type': 'string',
                            'index': 'no'
                            },
                        'fans_rank':{
                            'type':'string',
                            'index':'no'
                        },
                        'negtive_rank':{
                            'type':'string',
                            'index':'no'
                        },
                        'pagerank_rank':{
                            'type':'string',
                            'index':'no'
                        },
                        'sensitive_rank':{
                            'type':'string',
                            'index':'no'
                        }
                        }
                    }
                }
        }
    index_name = 'key_nodes_results'
    exist_indice = es.indices.exists(index=index_name)
    if exist_indice:
        es.indices.delete(index=index_name)
        
    es.indices.create(index=index_name, body=index_info, ignore=400)

    return True


#use to mappings for key mblogs es
def key_mblogs_es_mappings():
    index_info = {
            'settings':{
                'number_of_shards':5,
                'number_of_replicas':0
                },
            'mappings':{
                'mblog':{
                    'properties':{
                        'hash_tag':{
                            'type': 'string',
                            'index': 'not_analyzed'
                            },
                        'retweet_rank':{
                            'type':'string',
                            'index':'no'
                        },
                        'negtive_rank':{
                            'type':'string',
                            'index':'no'
                        }
                        }
                    }
                }
        }
    index_name = 'key_mblogs_results'
    exist_indice = es.indices.exists(index=index_name)
    if exist_indice:
        es.indices.delete(index=index_name)
        
    es.indices.create(index=index_name, body=index_info, ignore=400)

    return True


#use to mappings for key edges es
def key_edges_es_mappings():
    index_info = {
            'settings':{
                'number_of_shards':5,
                'number_of_replicas':0
                },
            'mappings':{
                'edge':{
                    'properties':{
                        'hash_tag':{
                            'type': 'string',
                            'index': 'not_analyzed'
                            },
                        'present_edges':{
                            'type':'string',
                            'index':'not_analyzed'
                        },
                        'future_edges':{
                            'type':'string',
                            'index':'not_analyzed'
                        }
                        }
                    }
                }
        }
    index_name = 'key_edges_results'
    exist_indice = es.indices.exists(index=index_name)
    if exist_indice:
        es.indices.delete(index=index_name)
        
    es.indices.create(index=index_name, body=index_info, ignore=400)

    return True


#use to mappings for information maximization es
def info_max_es_mappings():
    index_info = {
            'settings':{
                'number_of_shards':5,
                'number_of_replicas':0
                },
            'mappings':{
                'info_max':{
                    'properties':{
                        'hash_tag':{
                            'type': 'string',
                            'index': 'not_analyzed'
                            },
                        'info_max':{
                            'type':'string',
                            'index':'not_analyzed'
                        }
                        }
                    }
                }
        }
    index_name = 'info_max_results'
    exist_indice = es.indices.exists(index=index_name)
    if exist_indice:
        es.indices.delete(index=index_name)
        
    es.indices.create(index=index_name, body=index_info, ignore=400)

    return True


if __name__=='__main__':
    #test
    pinyin = '1'
    key_nodes_mark = key_nodes_es_mappings(pinyin)
    key_mblogs_mark = key_mblogs_es_mappings(pinyin)
    key_edges_mark = key_edges_es_mappings(pinyin)
    info_max_mark = info_max_es_mappings(pinyin)
