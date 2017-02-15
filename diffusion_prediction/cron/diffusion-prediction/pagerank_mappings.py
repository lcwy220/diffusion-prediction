# -*- coding:UTF-8 -*-
from elasticsearch import Elasticsearch
from global_utils import key_es as es


#pagerank_results_count



#use to mappings for pagerank es
def pagerank_es_mappings():
    index_info = {
            'settings':{
                'number_of_shards':5,
                'number_of_replicas':0
                },
            'mappings':{
                'pagerank':{
                    'properties':{
                        'uid':{
                            'type': 'long'
                            }
                        }
                    }
                }
        }
    index_name = 'pagerank_results'
    exist_indice = es.indices.exists(index=index_name)
    if exist_indice:
        es.indices.delete(index=index_name)
        
    es.indices.create(index=index_name, body=index_info, ignore=400)

    return True
