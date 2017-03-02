# -*-coding:utf-8-*-

import math
import json
import sys
reload(sys)
sys.path.append('../../../')

from global_utils import es_prediction as es


def mappings_stimulation(task_name):
    index_info = {
        "settings":{
            "number_of_replicas":0
        },
        "mappings":{
            "stimulation_results":{
                "properties":{
                    "update_time":{
                        "type": "long"
                    },
                    "in_results":{
                        "type": "string",
                        "index": "no"
                    },
                    "future_results":{
                        "type": "string",
                        "index": "no"
                    },
                    "diffusion_path":{
                        "type": "string",
                        "index": "no"
                    },
                    "future_user_info":{
                        "type": "string",
                        "index": "no"
                    },
                    "current_hot_weibo":{
                        "type": "string",
                        "index": "no"
                    },
                    "potential_hot_weibo":{
                        "type": "string",
                        "index": "no"
                    }
                }
            }
        }
    }

    index_name = "stimulation_"+task_name

    exist_bool = es.indices.exists(index=index_name)
    if not exist_bool:
        es.indices.create(index=index_name, body=index_info, ignore=400)

    return "1"



if __name__ == "__main__":
    es.update(index="manage_interfere_task", doc_type="interfere_task", id=\
            "mao_ze_dong_dan_chen_ji_nian_ri", body={"doc":{"scan_text_finish":"1"}})

