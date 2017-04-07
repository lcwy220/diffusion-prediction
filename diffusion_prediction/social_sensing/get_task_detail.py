# -*- coding:utf-8 -*-

# es 使用 Unicode
import sys
import json
import math
import time
from diffusion_prediction.time_utils import ts2date
from diffusion_prediction.global_utils import es_user_profile as es_profile
from diffusion_prediction.global_utils import es_prediction
from diffusion_prediction.global_utils import es_flow_text as es_text
from diffusion_prediction.global_config import profile_index_name, profile_index_type, \
                         flow_text_index_name_pre, flow_text_index_type
from diffusion_prediction.time_utils import datetime2ts, ts2datetime



# 特别适用于doc_type=2的事件
def get_task_detail_2():
    results = dict()

    time_series = [] # 时间
    origin_weibo_list = [] # 微博列表
    retweeted_weibo_list = []
    all_weibo_list = []

    query_body = {
        "query": {
            "match_all": {}
        },
        "size": 7*24,
        "sort":{"timestamp":{"order":"desc"}}
    }

    flow_detail = es_prediction.search(index="social_sensing_task", doc_type="social_sensing", body=query_body)["hits"]["hits"]
    flow_detail.reverse()

    if flow_detail:
        for item in flow_detail:
            item = item['_source']
            timestamp = item['timestamp']
            time_series.append(timestamp)
            origin_weibo_list.append(item["origin_weibo_number"]) # real
            retweeted_weibo_list.append(item['retweeted_weibo_number']) # real
            all_weibo_list.append(item["origin_weibo_number"]+item['retweeted_weibo_number'])




    results['time_series'] = time_series
    results['all_weibo_list'] = all_weibo_list
    results['origin_weibo_list'] = origin_weibo_list
    results['retweeted_weibo_list'] = retweeted_weibo_list

    return results


if __name__ == "__main__":
    print get_task_detail_2('监督维权律师', "keywords", "1378323000")


