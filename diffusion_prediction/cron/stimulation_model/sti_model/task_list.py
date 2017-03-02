# -*-coding:utf-8-*-

import json

import sys
reload(sys)
sys.path.append('../../../')
from global_utils import es_prediction, r_stimulation, RUN_TYPE
from global_config import type_manage_interfere_task, index_manage_interfere_task, \
                            task_stimulation
from time_utils import ts2datehour, datehour2ts

# stimulation_finish 代表是不是第一次仿真（第一次需要生成两个网络，\
#        一个基本网络，一个抽样网络）

def create_task():
    query_body = {
        "query": {
            "bool":{
                "must":[
                    {"term": {"finish": "0"}}
                ]
            }
        },
        "size": 10000
    }

    es_results = es_prediction.search(index=index_manage_interfere_task, doc_type=type_manage_interfere_task,\
            body=query_body)["hits"]["hits"]

    task_list = []
    if int(RUN_TYPE) == 1:
        current_ts = datehour2ts(ts2datehour(time.time()))
    else:
        current_ts = 1482681600 + 16*3600
    for item in es_results:
        tmp = []
        task_detail = item["_source"]
        task_name = task_detail['pinyin_task_name']
        update_time = task_detail["update_time"]
        sti_during = task_detail["stimulation_during"]
        stop_time =  task_detail["stop_time"]
        if RUN_TYPE == 1:
            if stop_time > current_ts:
                es.update(index=index_manage_interfere_task, doc_type=type_manage_interfere_task,\
                    id=task_name, body={"doc":{"finish": "1"}})
        tmp.append(task_name)
        tmp.append(task_detail["stop_time"])
        tmp.append(task_detail["scan_text_finish"])
        tmp.append(current_ts)
        if current_ts - update_time >= sti_during:
            r_stimulation.lpush(task_stimulation, json.dumps(tmp))

        # update: processing status
            es_prediction.update(index=index_manage_interfere_task,doc_type=type_manage_interfere_task,\
                id=task_name, body={"doc":{"stimulation_processing_status":"1"}})


    return True



if __name__ == "__main__":
    create_task()


