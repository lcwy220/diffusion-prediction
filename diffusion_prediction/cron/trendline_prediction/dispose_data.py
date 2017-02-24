# -*-coding:utf-8-*-

import sys
import json
import redis

reload(sys)
sys.path.append('../../')
from global_utils import es_prediction
from global_config import index_manage_prediction_task, type_manage_prediction_task
from time_utils import ts2datehour, datehour2ts


def dispose_data(task_name):
    es_result = es_prediction.get(index=index_manage_prediction_task, doc_type=type_manage_prediction_task, id=task_name)["_source"]
    macro_during = es_result['macro_during']
    start_ts = datehour2ts(ts2datehour(es_result["submit_time"]))
    end_ts = datehour2ts(ts2datehour(es_result["stop_time"]))

    index_micro = "micro_prediction_" + task_name
    query_body = {
        "query": {
            "match_all":{}
        },
        "size": 10000,
        "sort":{"update_time":{"order":"asc"}}
    }
    micro_results = es_prediction.search(index=index_micro, doc_type="micro_task", body=query_body)["hits"]["hits"]
    total_list = []

    for item in micro_results:
        total_list.append(item["_source"]["total_count"])

    total_len = (end_ts-start_ts)/macro_during+1
    times = int(macro_during)/3600
    lenth = len(total_list)/times
    adjust_list = []
    time_list = []
    count = 0
    i = 0
    for item in total_list:
        count += item
        i += 1
        start_ts += 3600
        if i % times == 0:
            adjust_list.append(count)
            count = 0
            time_list.append(start_ts)

    return adjust_list, total_len, time_list


