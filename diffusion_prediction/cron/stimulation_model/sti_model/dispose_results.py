# -*-coding:utf-8-*-

import json

import sys
reload(sys)
sys.path.append('../../../')
from global_utils import es_prediction as es
from global_utils import es_user_profile
from global_config import index_manage_interfere_task,type_manage_interfere_task,profile_index_name,profile_index_type
from time_utils import ts2datehour, datehour2ts

def dispose_results(task_name, ts):
    index_name = "stimulation_"+task_name
    index_type = "stimulation_results"
    results = es.get(index=index_name, doc_type=index_type, id=ts)["_source"]
    future_results = json.loads(results["future_results"])

    future_list = []
    # 未来传播路径
    diffusion_path = dict()
    # 未来传播数值
    diffusion_value = dict()
    for start_uid, end_dict in future_results.iteritems():
        diffusion_path[start_uid] = end_dict.keys()
        future_list.extend(end_dict.keys())
        diffusion_value.update(end_dict)

    # 未来传播者信息
    future_list = list(set(future_list))
    future_user_info = get_future_user(future_list)
    #print future_user_info
    for i in range(len(future_list)):
        uid = future_user_info[i][0]
        future_user_info[i].append(int(diffusion_value[uid]))


    # 当前热门微博、用户信息
    current_hot_mid = search_hot_mid(task_name, ts)

    # 当前潜在热门微博
    potential_mid = potential_user(task_name, ts)

    update_dict = dict()
    update_dict["diffusion_path"] = json.dumps(diffusion_path)
    update_dict["future_user_info"] = json.dumps(future_user_info)
    update_dict["current_hot_weibo"] = json.dumps(current_hot_mid)
    update_dict["potential_hot_weibo"] = json.dumps(potential_mid)

    es.update(index=index_name, doc_type=index_type, id=ts, body={"doc":update_dict})

    return True


# 获取未来用户信息
def get_future_user(uid_list):
    return_list = []
    if uid_list:
        profile_results = es_user_profile.mget(index=profile_index_name, doc_type=profile_index_type, body={"ids":uid_list})["docs"]
        for item in profile_results:
            tmp = []
            tmp.append(item["_id"])
            if item["found"]:
                tmp.append(item["_source"]["nick_name"])
                tmp.append(item["_source"]["photo_url"])
                tmp.append(item["_source"]["fansnum"])
                tmp.append(item["_source"]["statusnum"])
            else:
                tmp.append(item["_id"])
                tmp.extend(["","",""])
            return_list.append(tmp)

    return return_list





# 获取当前热门的微博（hot hot hot!!!）
def search_hot_mid(task_name, ts):
    query_body = {
        "query": {
            "range":{
                "timestamp":{
                    "lt": ts
                }
            }
        },
        "aggs":{
            "hot_mid":{
                "terms":{"field": "root_mid", "size": 100}
            }
        }
    }

    mid_list = []
    return_list = [] # return hot mid
    uid_list = []
    es_results = es.search(index=task_name, doc_type="text", body=query_body)["aggregations"]["hot_mid"]["buckets"]
    for item in es_results:
        mid_list.append(item["key"])

    if mid_list:
        weibo_results = es.mget(index=task_name, doc_type="text", body={"ids":mid_list})["docs"]
        for item in weibo_results:
            if item["found"]:
                mid = item["_id"]
                retweet, comment = search_retweet_comment(task_name, mid)
                detail = item["_source"]
                detail["retweet"] = retweet
                detail["comment"] = comment
                uid_list.append(detail["uid"])
                return_list.append(detail)
        if uid_list:
            profile_results = es_user_profile.mget(index=profile_index_name, doc_type=profile_index_type, body={"ids":uid_list})["docs"]
            for i in range(len(uid_list)):
                detail = profile_results[i]
                if detail["found"]:
                    return_list[i]["uname"] = detail["_source"]["nick_name"]
                    return_list[i]["photo_url"] = detail["_source"]["photo_url"]
                    return_list[i]["fansnum"] = detail["_source"]["fansnum"]
                    return_list[i]["statusnum"] = detail["_source"]["statusnum"]
                else:
                    return_list[i]["uname"] = detail["_id"]
                    return_list[i]["photo_url"] = ""
                    return_list[i]["fansnum"] = ""
                    return_list[i]["statusnum"] = ""
    return return_list[:10]


def search_retweet_comment(task_name, mid):
    query_tweet = {
        "query": {
            "bool":{
                "must":[
                    {"term":{"root_mid": mid}},
                    {"term":{"message_type": 3}}
                ]
            }
        }
    }

    tweet_count = es.count(index=task_name, doc_type="text",body=query_tweet)["count"]

    query_comment = {
        "query":{
            "bool":{
                "must":[
                    {"term":{"root_mid": mid}},
                    {"term":{"message_type": 2}}
                ]
            }
        }
    }

    comment_count = es.count(index=task_name, doc_type="text",body=query_comment)["count"]

    return tweet_count, comment_count



# 当前参与的用户微博尚未爆发

def potential_user(task_name, ts):
    index_name = "stimulation_"+task_name
    index_type = "stimulation_results"
    es_results = es.get(index=index_name, doc_type=index_type, id=ts)["_source"]
    in_results = json.loads(es_results["in_results"])

    in_potential_list = []
    tmp_in_list = []
    for uid, value in in_results.iteritems():
        uid_count = search_times(task_name, uid, ts)
        if value - uid_count >= 500:
            tmp = []
            tmp.append(uid)
            tmp.append(uid_count)
            tmp.append(int(value))
            in_potential_list.append(tmp)
            tmp_in_list.append(uid)

    # query this mids
    query_body = {
        "query":{
            "terms":{"uid": tmp_in_list}
        },
        "size": 10000
    }

    # weibo content
    mid_results = es.search(index=task_name, doc_type="text", body=query_body)["hits"]["hits"]
    mid_dict = dict()
    for item in mid_results:
        uid = item["_source"]["uid"]
        mid = item["_source"]["mid"]
        retweet, comment = search_retweet_comment(task_name, mid)
        item["_source"]["retweet"] = retweet
        item["_source"]["comment"] = comment
        try:
            mid_dict[uid].append(item["_source"])
        except:
            mid_dict[uid] = item["_source"]

    # user profile
    if tmp_in_list:
        profile_results = es_user_profile.mget(index=profile_index_name, doc_type=profile_index_type, body={"ids":tmp_in_list})["docs"]
        for i in range(len(tmp_in_list)):
            detail = profile_results[i]
            if detail["found"]:
                in_potential_list[i].append(detail["_source"]["nick_name"])
                in_potential_list[i].append(detail["_source"]["photo_url"])
                in_potential_list[i].append(detail["_source"]["fansnum"])
                in_potential_list[i].append(detail["_source"]["statusnum"])
            else:
                in_potential_list[i].append(detail["_id"])
                in_potential_list[i].extend(["","",""])

    return_list = []
    for item in in_potential_list:
        uid = item[0]
        if mid_dict.has_key(uid):
            item.append(mid_dict[uid])
        return_list.append(item)

    return return_list






# 查询用户被转发多少次
def search_times(task_name, uid, ts):
    query_body = {
        "query":{
            "filtered":{
                "filter":{
            "bool": {
                "must":[
                    {"range":{
                        "timestamp":{
                            "lt": ts
                            }
                        }
                    }
                ],
                "should":[
                    {"term":{"directed_uid": int(uid)}},
                    {"term": {"root_uid": str(uid)}}
                ]
            }
        }}},
        "aggs":{
            "uid_count":{
                "cardinality":{"field": "uid"}
            }
        }
    }

    count = es.search(index=task_name, doc_type="text", body=query_body)["aggregations"]["uid_count"]["value"]

    return count


if __name__ == "__main__":
    dispose_results("mao_ze_dong_dan_chen_ji_nian_ri", 1482732000)
