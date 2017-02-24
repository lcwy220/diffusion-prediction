# -*-coding:utf-8-*-

import json

import sys
reload(sys)
sys.path.append('../../../')
from global_utils import es_prediction, r_stimulation
from global_config import type_manage_interfere_task, index_manage_interfere_task, \
                            task_stimulation

# stimulation_finish 代表是不是第一次仿真（第一次需要生成两个网络，\
#        一个基本网络，一个抽样网络）

def create_task():
    query_body = {
        "query": {
            "bool":{
                "must":[
                    {"term": {"finish": "0"}},
                    {"term": {"interfere_processing_status": "0"}},
                    {"term": {"stimulation_processing_status": "0"}}
        },
        "size": 10000
    }

    es_results = es_prediction.search(index=index_manage_interfere_task, doc_type=type_manage_interfere_task,\
            body=query_body)["hits"]["hits"]

    task_list = []
    for item in es_results:
        tmp = []
        task_detail = item["_source"]
        task_name = task_detail['pinyin_task_name']
        tmp.append(task_name)
        tmp.append(task_detail["network_exist"])
        tmp.append(task_detail["stop_threshold"])
        r_stimulation.lpush(task_stimulation, json.dumps(tmp))

        # update: processing status
        es_prediction.update(index=index_manage_interfere_task,doc_type=type_manage_interfere_task,\
                id=task_name, body={"doc":{"stimulation_processing_status":"1"})


    return True



if __name__ == "__main__":
    create_task()


