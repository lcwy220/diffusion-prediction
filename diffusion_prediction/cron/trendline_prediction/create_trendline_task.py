# -*-coding:utf-8-*-

import time
import json
from dispose_data import dispose_data
from weibo_series_prediction import *

import sys
reload(sys)
sys.path.append('../../')
from global_utils import es_prediction, r_trendline, RUN_TYPE
from global_config import task_trendline,index_manage_prediction_task, type_manage_prediction_task,\
        index_type_prediction_task, pre_trendline
from time_utils import ts2datehour, datehour2ts

def create_task():
    ts = time.time()
    if RUN_TYPE:
        current_ts = datehour2ts(ts2datehour(ts))
    else:
        current_ts = 1482861600
    query_body = {
        "query": {
            "term":{"finish":"0"}
        },
        "size":10000
    }

    results = es_prediction.search(index=index_manage_prediction_task,\
            doc_type=type_manage_prediction_task, body=query_body)["hits"]["hits"]
    for item in results:
        print item
        task_name = item["_source"]["pinyin_task_name"]
        stop_time = item["_source"]["stop_time"]
        print stop_time, current_ts
        if stop_time < current_ts:
            es_prediction.update(index=index_manage_prediction_task,\
                    doc_type=type_manage_prediction_task, id=task_name,  body={"doc":{"macro_trendline_finish":"1", "finish": "1"}})
        else:
            r_trendline.lpush(task_trendline, task_name)


def task_list():
    create_task()
    if RUN_TYPE:
        current_ts = datehour2ts(ts2datehour(time.time()))
    else:
        current_ts = 1482861600
    while 1:
        task_detail = r_trendline.rpop(task_trendline)
        print task_detail
        if not task_detail:
            break

        task_name = task_detail
        while 1:
            micro_index = "micro_prediction_"+task_name
            es_exist = es_prediction.exists(index=micro_index, doc_type="micro_task", id=current_ts)
            if not es_exist:
                time.sleep(60)
            else:
                break

        print task_name
        # obtain time series
        value, total_len, time_list, left_list = dispose_data(task_name, current_ts)
        print value, time_list

        # weibo prediction
        k = 5
        h = 0.5
        peak = spd(value,h,k)
        flag = judge(peak,value)
        if len(flag) == 2:
            print("Two peaks:")
            paras = getTwoBeauties(value,flag[0],flag[1])
            paras[-1] = total_len
            series = bassTwoPeaks(paras)
        else:
            print("Single peak:")
            paras = getSingleBeauty(value)
            paras[-1] = total_len
            series = bassOnePeak(paras)
        climax = series.index(max(series))

        results = {"time_list": time_list, "prediction_value": series}
        # results
        #r_trendline.set("trendline_"+task_name, json.dumps(results))
        print results



if __name__ == "__main__":
    task_list()



