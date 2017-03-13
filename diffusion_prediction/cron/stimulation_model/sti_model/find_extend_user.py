# -*-coding:utf-8-*-

import time
import math
import os
import pickle
import subprocess
import json
import sys
reload(sys)
sys.path.append('../../../')

from global_utils import es_prediction,es_retweet, r_stimulation
from global_config import index_be_retweet, index_type_be_retweet,index_manage_interfere_task, type_manage_interfere_task
from time_utils import ts2datehour, datehour2ts

from organize_network import organize_network
from mappings_stimulation import mappings_stimulation
from dispose_results import dispose_results

def extend_network(task_name, ts):

    index_name = task_name
    # mu qian can yu de yonghu shu
    query_uid = {
        "query":{
            "filtered":{
                "filter":{
                    "range":{
                        "timestamp":{
                            "lt": ts
                        }
                    }
                }
            }
        },
        "aggs":{
            "uid_count":{"cardinality":{"field": "uid"}}
        }
    }
    uid_count = es_prediction.search(index=index_name, doc_type="text", \
            body=query_uid)["aggregations"]["uid_count"]["value"]

    try:
        extend_retweet_threshold = float(r_stimulation.get("extend_retweet_threshold"))
    except:
        r_stimulation.set("extend_retweet_threshold", 10000)
        extend_retweet_threshold = 10000

    user_list = organize_network(task_name, ts)
    exist_user_set = set(user_list)
    in_user_list = list() ####已存在的用户列表
    in_user_info = []
    count = 0
    all_user_dict = dict() ## participate user >>> extended list
    list_len = len(user_list)
    len_1000 = list_len/1000
    for i in range(len_1000+1):
        tmp_uid = user_list[i*1000: (i+1)*1000]
        es_results = es_retweet.mget(index=index_be_retweet,doc_type=index_type_be_retweet, body={"ids":tmp_uid})["docs"]
        for item in es_results:
            if item["found"]:
                count +=1
                if count % 1000 == 0:
                    print "extend network: ", count
                uid_be_retweet = json.loads(item["_source"]["uid_be_retweet"])
                retweet_count = len(uid_be_retweet)
                if retweet_count < extend_retweet_threshold: # 对外扩展的阈值
                    continue
                uid_retweet_list = uid_be_retweet.keys()
                uid_retweet_list = list(set(uid_retweet_list)-exist_user_set)
                all_user_dict[item["_id"]] = uid_retweet_list # 扩展的用户
                retweet_count = len(uid_be_retweet)
                in_user_list.append(item["_id"])
                in_user_info.append([math.log(retweet_count+1), math.log(uid_count+1)])

    return uid_count,in_user_list, in_user_info, all_user_dict



def predict_user_influence(task_name, stop_time, ts):
    uid_count, in_user_list, in_user_info, all_user_dict = extend_network(task_name, ts)

    with open("gbdt.pkl", "r") as f:
        gbdt = pickle.load(f)

    # 已出现的重要用户阈值
    try:
        in_user_threshold = float(r_stimulation.get("in_user_threshold"))
    except:
        r_stimulation.set("in_user_threshold", 1000)
        in_user_threshold = 1000


    in_results = gbdt.predict(in_user_info)
    print "len(in_user_list): ", len(in_user_list)
    prediction_in = dict()
    for i in range(len(in_user_list)):
        if math.exp(in_results[i]) > in_user_threshold: # 1000
            prediction_in[in_user_list[i]] = math.exp(in_results[i])


    future_dict = dict()
    count = 0
    for k,v in all_user_dict.iteritems():
        uid = k
        print "k: ", k
        print "v: ", len(v)
        tmp_prediction_list = [] # tmp storage
        tmp_uid_list = []
        if 1:
            user_list = v
            list_len = len(user_list)
            len_1000 = list_len/1000
            for i in range(len_1000+1):
                tmp_uid = user_list[i*1000: (i+1)*1000]
                if not tmp_uid:
                    continue
                es_results = es_retweet.mget(index=index_be_retweet,doc_type=index_type_be_retweet, body={"ids":tmp_uid})["docs"]
                for item in es_results:
                    if item["found"]:
                        count += 1
                        uid_be_retweet = json.loads(item["_source"]["uid_be_retweet"])
                        retweet_count = len(uid_be_retweet)
                        if retweet_count < 1000:
                            continue
                        tmp = []
                        tmp.append(math.log(retweet_count+1))
                        tmp.append(math.log(uid_count+1))
                        tmp_prediction_list.append(tmp)
                        tmp_uid_list.append(item["_id"])
                        if count % 1000 == 0:
                            iter_prediction_list = prediction_model(uid,gbdt, tmp_prediction_list, tmp_uid_list, future_dict)
                            future_dict = iter_prediction_list
                            tmp_prediction_list = []
                            tmp_uid_list = []
                            print "iter prediction: ", count

        if tmp_prediction_list:
            iter_prediction_list = prediction_model(uid,gbdt, tmp_prediction_list, tmp_uid_list, future_dict)
            future_dict = iter_prediction_list
            print "future_dict: ", future_dict

    # storage
    save_results(task_name, ts, prediction_in, future_dict)

    # do left things
    dispose_results(task_name, ts)


    # update processing state
    es_prediction.update(index=index_manage_interfere_task,doc_type=type_manage_interfere_task,\
            id=task_name, body={"doc":{"stimulation_processing_status":"0", "update_time": ts, "scan_text_finish":"0"}})

    # stop task
    if ts >= stop_time:
        es_prediction.update(index=index_manage_interfere_task,doc_type=\
                type_manage_interfere_task,id=task_name,body={"doc":{"finish":"1"}})


def save_results(task_name, ts, prediction_in, future_dict):
    mappings_stimulation(task_name)

    work_index = "stimulation_"+task_name
    work_type = "stimulation_results"

    update_body = {"update_time": ts, "in_results":json.dumps(prediction_in), "future_results": json.dumps(future_dict)}

    es_prediction.index(index=work_index, doc_type=work_type, id=ts, body=update_body)
    return True

def prediction_model(uid, gbdt, tmp_prediction_list, tmp_uid_list, future_dict):
    # 潜在用户阈值
    try:
        potential_threshold = float(r_stimulation.get("potential_threshold"))
    except:
        r_stimulation.set("potential_threshold", 1000)
        potential_threshold = 1000

    tmp_value_list = list(gbdt.predict(tmp_prediction_list))
    for tmp_each in tmp_value_list:
        index = tmp_value_list.index(tmp_each)
        tmp_prediction = math.exp(tmp_each)
        if tmp_prediction >= potential_threshold:
            try:
                future_dict[uid][tmp_uid_list[index]] = tmp_prediction
            except:
                future_dict[uid] = dict()
                future_dict[uid][tmp_uid_list[index]] = tmp_prediction

    return future_dict



if __name__ == "__main__":
    print predict_user_influence("mao_ze_dong_dan_chen_ji_nian_ri")
