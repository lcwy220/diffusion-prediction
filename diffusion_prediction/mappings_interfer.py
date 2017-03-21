# -*- coding:utf-8 -*-

import sys
import json
import pinyin
from elasticsearch import Elasticsearch
from elasticsearch.helpers import scan
from global_utils import es_prediction as es
from global_config import type_manage_interfere_task, index_manage_interfere_task


def manage_interfere_task():
    index_info = {
        'settings':{
            'number_of_replicas': 0,
            'number_of_shards': 5
        },
        "mappings":{
            type_manage_interfere_task:{
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
                    "network_exist":{
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "submit_user":{
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "interfere_processing_status":{
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "stimulation_processing_status":{
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "stop_time":{ # task end time
                        "type": "long"
                    },
                    "start_time":{ # task start time
                        "type": "long"
                    },
                    "submit_time":{
                        "type": "long"
                    },
                    "update_time":{
                        "type": "long"
                    },
                    "interfere_results":{
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "stimulation_results":{
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "remark":{
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "scan_text_time":{
                        "type": "long",
                    },
                    "scan_text_processing":{
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "scan_text_finish":{
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "finish":{ # whole task finish
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "interfere_finish":{ # interfere and stimulation 
                        "type":"string",
                        "index":"not_analyzed"
                    },
                    "stimulation_finish":{
                        "type":"string",
                        "index":"not_analyzed"
                    },
                    "stimulation_during":{
                        "type":"long"
                    }
                }
            }
        }
    }

    if not es.indices.exists(index=index_manage_interfere_task):

        es.indices.create(index=index_manage_interfere_task, body=index_info, ignore=400)




if __name__ == "__main__":
    #manage_interfere_task()

    es.indices.put_mapping(index=index_manage_interfere_task,doc_type=type_manage_interfere_task, body={"properties":{"update_time":{"type":"long"}}})
    es.update(index=index_manage_interfere_task,doc_type=type_manage_interfere_task,id="mao_ze_dong_dan_chen_ji_nian_ri",body={"doc":{"update_time":1482724800}})


