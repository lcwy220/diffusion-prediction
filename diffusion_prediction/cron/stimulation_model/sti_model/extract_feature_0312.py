# -*-coding:utf-8-*-

import time
import math
import sys

reload(sys)
sys.path.append("../../../")
import json
from time_utils import ts2datetime, datetime2ts, ts2datehour, datehour2ts

from elasticsearch import Elasticsearch
from global_utils import es_prediction as es
from global_utils import RUN_TYPE


topic_field_dict = {'art':1,'computer':2,'economic':3, 'education':4,'environment':5, 'medicine':6,\
                    'military':7,'politics':8,'sports':9,'traffic':10,'life':11,'anti-corruption':12,\
                     'employment':13,'fear-of-violence':14, 'house':15,'law':16,'peace':17,\
                     'religion':18,'social-security':19,'null':20}



def organize_feature(task_name, mid, ts):

    result = dict()
    try:
        result = es.get(index=task_name, doc_type="text", id=mid)["_source"]
    except:
        pass
    if not result:
        return [0, 0, 0, 0, 0, 0,0]

    ts = result["timestamp"]

    query_body = {
        "query":{
            "term":{"root_mid":mid}
        }
    }
    #total_weibo
    #count = es.count(index=index_list, doc_type="text", body=query_body)["count"]

    query_body_uid = {
        "query":{
            "term":{"root_mid":mid}
        },
        "aggs":{
            "uid_count":{
                "cardinality":{"field": "uid"}
            }
        }
    }
    # total_uid
    #total_uid_count = es.search(index=index_list, doc_type="text", body=query_body_uid)['aggregations']["uid_count"]["value"]



    feature_list = []
    feature_list.append(math.log(result["user_fansnum"]+1))
    query_body_ts = {
        "query":{
            "bool":{
                "must":[
                    {"term":{"root_mid":mid}},
                    {"range":{
                        "timestamp":{
                            "lt": ts + 3600*10
                        }
                    }}
                ]
            }
        },
        "aggs":{
            "weibo_type":{
                "terms":{"field": "message_type"}
            }
        }
    }
    comment = 0
    retweet = 0
    tmp_count = es.search(index=task_name, doc_type="text", body=query_body_ts)['aggregations']["weibo_type"]["buckets"]
    if tmp_count:
        for item in tmp_count:
            if int(item["key"]) == 2:
                comment = item["doc_count"]
            elif int(item["key"]) == 3:
                retweet = item["doc_count"]
    feature_list.append(comment+retweet)
    feature_list.append(retweet)
    feature_list.append(comment)
    feature_list.append(retweet/float(comment+retweet+1))
    feature_list.append(comment/float(comment+retweet+1))
    query_body_uid = {
        "query":{
            "bool":{
                "must":[
                    {"term":{"root_mid":mid}},
                    {"range":{
                        "timestamp":{
                            "lt": ts + 3600*10
                        }
                    }}
                ]
            }
        },
        "aggs":{
            "uid_count":{
                "cardinality":{"field": "uid"}
            }
        }
    }
    uid_count = es.search(index=task_name, doc_type="text", body=query_body_uid)['aggregations']["uid_count"]["value"]
    feature_list.append(uid_count)
    #feature_list.append(topic_field_dict[topic])


    return feature_list



if __name__ == "__main__":
    pass


