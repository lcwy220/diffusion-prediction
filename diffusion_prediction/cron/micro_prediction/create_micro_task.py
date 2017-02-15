# -*-coding:utf-8-*-

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
        r_micro.lpush(task_micro_prediction, json.dumps(task_name, item["_source"]["scan_text_time"], current_ts))
