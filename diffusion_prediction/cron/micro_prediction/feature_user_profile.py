# -*-coding:utf-8-*-

import sys
import json
import time
from elasticsearch import Elasticsearch
from elasticsearch.helpers import scan

reload(sys)
sys.path.append("../../")
from global_config import pre_flow_text, type_flow_text,index_type_be_retweet, index_be_retweet
from global_utils import es_flow_text, es_retweet, es_prediction
from time_utils import ts2hour,ts2datetime, datetime2ts
es_text = es_flow_text
es = es_prediction

def user_fansnum(event, start_ts, end_ts):
    query_body = {
        "query":{
            "range":{
                "timestamp":{
                    "gte": start_ts,
                    "lt": end_ts
                }
            }
        }
    }

    st = start_ts
    et = end_ts
    index_list = pre_flow_text+ts2datetime(st)

    uid_set = set()
    count = 0
    total_count = 0
    total_fans = 0 #参与者用户粉丝数
    total_origin = 0 #原创微博数
    total_origin_ts = 0
    total_retweet = 0 #转发微博数
    total_retweet_ts = 0
    total_comment = 0

    origin_important_hour = [] # 重要微博发布时间
    origin_important_user = [] # 重要的参与者，会引发新的传播
    #origin_important_user_10000 = []
    origin_important_user_count = 0
    origin_important_user_retweet = 0 # 重要用户最近被转发量
    #important_user_retweet_10000 = 0

    retweet_important_hour = []
    retweet_important_user = []
    retweet_important_user_count = 0
    retweet_important_user_retweet = 0

    positive_count = 0
    neutral_count = 0
    negetive_count = 0


    es_scan = scan(es, query=query_body, index=event, doc_type="text", size=2000)
    while 1:
        try:
            es_re = es_scan.next()
            item = es_re
            """
            if item["_source"]["user_fansnum"] >= 100000: # 重要参与者
                if int(item["_source"]["message_type"]) == 1:
                    origin_important_user.append(item["_source"]["uid"])
                    tmp_ts = item["_source"]["timestamp"]
                    origin_important_hour.append(ts2hour(tmp_ts))
                elif int(item["_source"]["message_type"]) == 3:
                    retweet_important_user.append(item["_source"]["uid"])
                    tmp_ts = item["_source"]["timestamp"]
                    retweet_important_hour.append(ts2hour(tmp_ts))
            """


            if int(item["_source"]["message_type"]) == 1:
                total_origin += 1 # origin ratio
                total_fans += item["_source"]["user_fansnum"] #
            elif int(item["_source"]["message_type"]) == 3:
                total_retweet += 1 # retweet ratio
                total_fans += item["_source"]["user_fansnum"] #
            else:
                total_comment += 1

            """
            # 情绪统计
            if int(item["_source"]["sentiment"]) == 1:
                positive_count += 1
            elif int(item["_source"]["sentiment"]) == 2:
                neutral_count += 1
            else:
                negetive_count += 1
            """

        except StopIteration:
            break

    """
    try:
        average_origin_imp_hour = sum(origin_important_hour)/float(len(origin_important_hour))
    except:
        average_origin_imp_hour = 0
    try:
        average_retweet_imp_hour = sum(retweet_important_hour)/float(len(retweet_important_hour))
    except:
        average_retweet_imp_hour = 0

    # 重要参与用户的最近一周的转发量
    if origin_important_user:
        results = es_retweet.mget(index=index_be_retweet, doc_type=index_type_be_retweet, body={"ids":list(origin_important_user)})["docs"]
        for item in results:
            if item["found"]:
                tmp = json.loads(item["_source"]["uid_be_retweet"]).values()
                tmp_result = 0
                for i in tmp:
                    tmp_result += int(i)
                origin_important_user_retweet += tmp_result   
    origin_important_user_count = len(origin_important_user)

    if retweet_important_user:
        results = es_retweet.mget(index=index_be_retweet, doc_type=index_type_be_retweet, body={"ids":list(retweet_important_user)})["docs"]
        for item in results:
            if item["found"]:
                tmp = json.loads(item["_source"]["uid_be_retweet"]).values()
                tmp_result = 0
                for i in tmp:
                    tmp_result += int(i)
                retweet_important_user_retweet += tmp_result   
    retweet_important_user_count = len(retweet_important_user)
    """

    total_count = total_origin+total_retweet+total_comment

    query_uid = {
        "query":{
            "filtered":{
                "filter":{
                    "bool":{
                        "must":[
                            {"range":{
                                "timestamp":{
                                    "gte": start_ts,
                                    "lt":end_ts
                                }
                            }}
                        ]
                    }
                }
            }
        },
        "aggs":{
            "uid_count":{
                "cardinality":{"field": "uid"}
            }
        }
    }

    total_uid_count = es.search(index=event, doc_type="text", body=query_uid)["aggregations"]["uid_count"]["value"]


    return [total_fans,total_origin,total_retweet,total_comment,total_count,total_uid_count]


if __name__ == "__main__":
    print user_fansnum(["维稳维权"], 1479164400, 1479164400+3600)

