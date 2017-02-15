# -*- coding:utf-8 -*-

import sys
import json
from elasticsearch import Elasticsearch
from elasticsearch.helpers import scan
from global_utils import es_prediction as es
from global_config import type_manage_prediction_task, index_manage_prediction_task


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
                    }
                }
            }
        }
    }

    if not es.indices.exists(index=index_manage_prediction_task):

        es.indices.create(index=index_manage_prediction_task, body=index_info, ignore=400)

if __name__ == "__main__":
    manage_prediction_task()


