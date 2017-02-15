# -*- coding:utf-8 -*-

import sys
import json
from elasticsearch import Elasticsearch
from elasticsearch.helpers import scan
reload(sys)
sys.path.append("../../")
from global_utils import es_prediction as es

def mappings_micro_task(task_name):
    index_info = {
        "mappings":{
            "micro_task":{
                "properties":{
                    "origin_weibo_number":{
                        "type": "long"
                    },
                    "retweeted_weibo_number":{
                        "type": "long"
                    },
                    "comment_weibo_number":{
                        "type": "long"
                    },
                    "total_count":{
                        "type": "long"
                    },
                    "total_fans_number":{
                        "type": "long"
                    },
                    "positive_weibo_number":{
                        "type": "long"
                    },
                    "neutral_weibo_number":{
                        "type": "long"
                    },
                    "negetive_weibo_number":{
                        "type": "long"
                    },
                    "origin_important_user_number":{
                        "type": "long"
                    },
                    "origin_important_user_retweet":{
                        "type": "long"
                    },
                    "retweet_important_user_count":{
                        "type": "long"
                    },
                    "retweet_important_user_retweet":{
                        "type": "long"
                    },
                    "average_origin_imp_hour":{
                        "type": "long"
                    },
                    "average_retweet_imp_hour":{
                        "type": "long"
                    },
                    "origin_important_users":{
                        "type": "string",
                        "index": "no"
                    },
                    "retweet_important_users":{
                        "type": "string",
                        "index": "no"
                    },
                    "timestamp":{
                        "type": "long",
                    },
                    # data update time
                    "update_time":{
                        "type": "long"
                    },
                    "create_by":{
                        "type": "string",
                        "index": "not_analyzed"
                    }
                }
            }
        }
    }

    if not es.indices.exists(index=task_name):

        es.indices.create(index=index_name, body=index_info, ignore=400)

    return "1"

def manage_prediction_task():
    index_info = {
        "mappings":{
            "prediction_task":{
                "properties":{
                    "task_name":{
                        "type": "string",
                        "index": "not_analyzed"
                    },
                    "keywords":{
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
                    "start_time":{ # task start time
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
                    "create_at":{
                        "type": "long"
                    },
                    "finish":{
                        "type": "string",
                        "index": "not_analyzed"
                    }
                }
            }
        }
    }

    if not es.indices.exists(index="manage_micro_prediction_task"):

        es.indices.create(index="manage_micro_prediction_task", body=index_info, ignore=400)

if __name__ == "__main__":
    manage_micro_prediction_task()
    es.indices.create(index="micro_prediction_task", ignore=400)


