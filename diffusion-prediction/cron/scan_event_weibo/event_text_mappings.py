# -*- coding: UTF-8 -*-

import sys
reload(sys)
sys.path.append("../../")

from global_utils import es_prediction as es

def get_mappings(index_name):
    index_info = {
            'settings':{
                'analysis':{
                    'analyzer':{
                        'my_analyzer':{
                            'type': 'pattern',
                            'pattern': '&'
                        }
                    }
                }
            },
            'mappings':{
                'text':{
                    'properties':{
                        'text':{
                            'type': 'string',
                            'index': 'not_analyzed'
                            },
                        'event':{
                            'type': 'string',
                            'index': 'not_analyzed'
                            },
                        'mid':{
                            'type': 'string',
                            'index': 'not_analyzed'
                            },
                        'category':{
                            'type': 'string',
                            'index': 'not_analyzed'
                            },
                        'ip':{
                            'type': 'string',
                            'index': 'not_analyzed'
                            },
                        'directed_uid':{
                            'type':'long',
                            },
                        'directed_uname':{
                            'type': 'string',
                            'index': 'not_analyzed'
                            },
                        'rel_directed_uname':{
                            'type': 'string',
                            'index': 'not_analyzed'
                            },
                        'sum_retweet':{
                            'type': 'long'
                            },
                        'timestamp':{
                            'type': 'long'
                            },
                        'sentiment': {
                            'type': 'string',
                            'index': 'not_analyzed'
                            },
                        'geo':{
                            'type': 'string',
                            'analyzer': 'my_analyzer'
                            },
                        'keywords_dict':{
                            'type': 'string',
                            'index': 'not_analyzed'
                            },
                        'keywords_string':{
                            'type': 'string',
                            'analyzer': 'my_analyzer'
                            },
                        'sensitive_words_dict':{
                            'type': 'string',
                            'index': 'not_analyzed'
                            },
                        'sensitive_words_string':{
                            'type': 'string',
                            'analyzer': 'my_analyzer'
                            },
                        'message_type':{
                            'type': 'long'
                            },
                        'uid':{
                            'type': 'string',
                            'index': 'not_analyzed'
                            },
                        'root_uid':{
                            'type': 'string',
                            'index': 'not_analyzed'
                            },
                        'root_mid':{
                            'type': 'string',
                            'index': 'not_analyzed'
                            },
                         # uncut weibo text
                        'origin_text':{
                            'type': 'string',
                            'index': 'not_analyzed'
                            },
                        'origin_keywords_dict':{
                            'type': 'string',
                            'index': 'not_analyzed'
                            },
                        'origin_keywords_string':{
                            'type': 'string',
                            'analyzer': 'my_analyzer'
                            }
                        }
                    }
                }
            }
    exist_indice = es.indices.exists(index=index_name)
    if not exist_indice:
        es.indices.create(index=index_name, body=index_info, ignore=400)

if __name__=='__main__':
    get_mappings("event-0118")
    #es.indices.put_mapping(index="monitored_text", doc_type="text", body={'properties':{"category":{"type":"string"}}}, ignore=400)
