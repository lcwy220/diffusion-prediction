# -*-coding:utf-8-*-

import os
import subprocess
import json
import sys
reload(sys)
sys.path.append('../../../')

from global_utils import es_prediction,es_retweet
from global_config import index_be_retweet, index_type_be_retweet,index_manage_interfere_task, type_manage_interfere_task

from organize_network import organize_network

def extend_network(task_name):

    # mu qian can yu de yonghu shu
    query_uid = {
        "query":{
            "range":{
                "timestamp":{
                    "lt": ts
                }
            }
        },
        "aggs":{
            "uid_count":{"cardinality":{"field": "uid"}}
        }
    }
    uid_count = es.search(index=index_name, doc_type="text", \
            body=query_uid)["aggregations"]["uid_count"]["value"]


    file_name = task_name+".txt"
    f = open(task_name+".txt", "w")
    line = 0
    count = 0 
    user_list = organize_network(task_name)
    important_user_list = list() ####
    important_user_info = []
    list_len = len(user_list)
    len_1000 = list_len/1000
    for i in range(len_1000+1):
        tmp_uid = user_list[i*1000: (i+1)*1000]
        es_results = es_retweet.mget(index=index_be_retweet,doc_type=index_type_be_retweet, body={"ids":tmp_uid})["docs"]
        for item in es_results:
            if item["found"]:
                print count
                uid_be_retweet = json.loads(item["_source"]["uid_be_retweet"])
                retweet_count = len(uid_be_retweet)
                if retweet_count < 100:
                    continue
                important_user_list.append(item["_id"])
                important_user_info.append([retweet_count, uid_count])
            

    print "finish: ", count



if __name__ == "__main__":
    extend_network("mao_ze_dong_dan_chen_ji_nian_ri")
