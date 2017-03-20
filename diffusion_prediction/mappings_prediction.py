# -*- coding:utf-8 -*-

import sys
import json
import pinyin
from elasticsearch import Elasticsearch
from elasticsearch.helpers import scan
from global_utils import es_prediction as es
from global_config import type_manage_prediction_task, index_manage_prediction_task, \
                            type_macro_feature_result


def manage_prediction_task():
    index_info = {
        'settings':{
            'number_of_replicas': 0,
            'number_of_shards': 5
        },
        "mappings":{
            type_manage_prediction_task:{
                "properties":{
                    "task_name":{
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "pinyin_task_name":{
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "must_keywords":{
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "should_keywords":{
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "query_body":{
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "prediction_time":{ # next stage prediction time
                        "type": "long"
                    },
                    "prediction_count":{ # next stage prediction value
                        "type": "long"
                    },
                    "submit_user":{
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "processing_status":{
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "stop_time":{ # task end time
                        "type": "long"
                    },
                    "start_time":{ # task end time
                        "type": "long"
                    },
                    "submit_time":{ # task start time
                        "type": "long"
                    },
                    "remark":{
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "macro_during":{
                        "type": "long",
                    },
                    "micro_during":{
                        "type": "long",
                    },
                    "scan_text_time":{
                        "type": "long",
                    },
                    "scan_text_processing":{
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "finish":{
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "macro_value_finish":{
                        "type":"string",
                        "index":"not_analyzed"
                    },
                    "macro_trendline_finish":{
                        "type":"string",
                        "index":"not_analyzed"
                    }
                }
            }
        }
    }

    if not es.indices.exists(index=index_manage_prediction_task):

        es.indices.create(index=index_manage_prediction_task, body=index_info, ignore=400)


def macro_feature_result(pinyin_task_name):

    #pinyin_task_name = pinyin.get(task_name, format="strip", delimiter="_")
    index_macro_feature_result = 'macro_feature_results' + pinyin_task_name 

    index_info = {
        "mappings":{
            type_macro_feature_result:{
                "properties":{
                    'event':{
                        'type':'string',
                        'index':'not_analyzed'
                    },
                    'topic_field':{
                        'type':'string',
                        'index':'not_analyzed'
                    },
                    'total_num':{
                        'type':'long'
                    },
                    'total_user_fans':{
                        'type':'long'
                    },
                    'total_comment':{
                        'type':'long'
                    },
                    'total_retweet':{
                        'type':'long'
                    },
                    'total_sensitive':{
                        'type':'long'
                    },
                    'total_sensitive_ratio':{
                        'type':'double'
                    },
                    'total_negtive':{
                        'type':'long'
                    },
                    'total_important_user':{
                        'type':'long'
                    },
                    'total_origin_type':{
                        'type':'long'
                    },
                    'origin_ratio':{
                        'type':'double'
                    },
                    'total_retweet_type':{
                        'type':'long'
                    },
                    'retweet_ratio':{
                        'type':'double'
                    },
                    'total_comment_type':{
                        'type':'long'
                    },
                    'comment_ratio':{
                        'type':'double'
                    },
                    'at_count':{
                        'type':'string',
                        'index':'not_analyzed'
                    },
                    'event_uid_count':{
                        'type':'long'
                    },
                    'event_trend_delta':{
                        'type':'string',
                        'index':'not_analyzed'
                    },
                    'predict_value':{
                        'type':'long'
                    },
                    'predict_rank':{
                        'type':'double'
                    },
                    'update_time':{
                        'type':'long'
                    }           
                }
            }
        }
    }


    if not es.indices.exists(index=index_macro_feature_result):
        es.indices.create(index=index_macro_feature_result,body=index_info,ignore=400)


if __name__ == "__main__":
    manage_prediction_task()


