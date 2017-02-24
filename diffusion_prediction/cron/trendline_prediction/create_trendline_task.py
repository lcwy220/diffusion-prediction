# -*-coding:utf-8-*-

import time
import json
from dispose_data import dispose_data
from weibo_series_prediction import *

import sys
reload(sys)
sys.path.append('../../')
from global_utils import es_prediction, r_trendline
from global_config import task_trendline,index_manage_prediction_task, type_manage_prediction_task,\
        index_type_prediction_task, pre_trendline
from time_utils import ts2datehour, datehour2ts

def create_task():
    ts = time.time()
    current_ts = datehour2ts(ts2datehour(ts))
    query_body = {
        "query": {
            "term":{"macro_trendline_finish":"0"}
        },
        "size":10000
    }

    results = es_prediction.search(index=index_manage_prediction_task,\
            doc_type=type_manage_prediction_task, body=query_body)["hits"]["hits"]
    for item in results:
        task_name = item["_source"]["pinyin_task_name"]
        stop_time = item["_source"]["stop_time"]
        if stop_time < ts:
            es_prediction.update(index=index_manage_prediction_task,\
                    doc_type=type_manage_prediction_task, id=task_name,  body={"doc":{"macro_trendline_finish":"1"}})
        else:
            r_trendline.lpush(task_trendline, task_name)


def task_list():
    create_task()
    while 1:
        task_detail = r_trendline.rpop(task_trendline)
        if not task_detail:
            break

        task_name = task_detail
        while 1:
            es_results = es_prediction.get(index=index_manage_prediction_task,\
                doc_type=type_manage_prediction_task, id=task_name)["source"]
            if int(es_results["scan_text_processing"]) == 1:
                time.sleep(60)
            else:
                break


        # obtain time series
        value, total_len, time_list = dispose_data(task_name)
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

        results = {"time_list": time_list, "prediction_value": series}
        # results
        r_trendline.set("trendline_"+task_name, json.dumps(results))



if __name__ == "__main__":
    create_task()
    task_list()



