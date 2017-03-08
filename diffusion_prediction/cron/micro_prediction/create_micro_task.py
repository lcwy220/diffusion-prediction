# -*-coding:utf-8-*-

from mappings_micro_prediction import mappings_micro_task
from time_series_data import *

import sys
reload(sys)
sys.path.append('../../')
from global_utils import es_prediction, r_micro
from global_config import task_micro_prediction,index_manage_prediction_task, type_manage_prediction_task

def create_task():
    ts = time.time()
    current_ts = datehour2ts(ts2datehour(ts))
    query_body = {
        "query": {
            "term":{"finish":"0"}
        },
        "size":10000
    }

    results = es_prediction.search(index=index_manage_prediction_task,\
            doc_type=type_manage_prediction_task, body=query_body)["hits"]["hits"]
    for item in results:
        task_name = item["_source"]["pinyin_task_name"]
        print "push task_name: ", task_name
        update_time = item["_source"]["scan_text_time"]
        stop_time = item["_source"]["stop_time"]
        if current_ts > stop_time:
            es_prediction.update(index=index_manage_prediction_task,doc_type=type_manage_prediction_task,\
                    id=task_name, body={"doc":{"finish":"1"}})
        during = item["_source"]["micro_during"]
        if current_ts - update_time>= during:
            r_micro.lpush(task_micro_prediction, json.dumps([task_name, item["_source"]["scan_text_time"], current_ts, during])


def task_list():
    create_task()
    while 1:
        task_detail = r_micro.rpop(task_micro_prediction)
        if not task_detail:
            break

        task_detail = json.loads(task_detail)
        task_name = task_detail[0]
        start_ts = task_detail[1]
        end_ts = task_detail[2]
        during = task_detail[3]

        mappings_micro_task("micro_prediction_"+task_name)

        while 1:
            es_result = es_prediction.get(index=index_manage_prediction_task, doc_type=type_manage_prediction_task, id=task_name)["_source"]
            if int(es_result["scan_text_processing"]) == 2:
                break
            else:
                time.sleep(60)

        organize_feature(task_name, task_name, start_ts, end_ts)
        dispose_data(task_name, end_ts)

def test():
    task_name = "mao_ze_dong_dan_chen_ji_nian_ri"
    start_ts = 1482681600
    end_ts = 1483113600
    mappings_micro_task("micro_prediction_"+task_name)

    while 1:

        if start_ts > end_ts:
            break
        organize_feature(task_name, task_name,start_ts, start_ts+3600)
        dispose_data(task_name, start_ts+3600)
        start_ts += 3600



if __name__ == "__main__":
    #task_list()
    test()




