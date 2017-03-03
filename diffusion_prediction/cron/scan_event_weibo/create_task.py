# -*-coding:utf-8-*-

# from task es create scan task
# create index with event name

from event_text_mappings import get_mappings
import sys
reload(sys)
sys.path.append('../../')
from global_utils import es_prediction, r_scan_text
from global_config import index_manage_prediction_task, type_manage_prediction_task, task_scan_text,\
        index_event_analysis, type_event_analysis, type_manage_interfere_task, index_manage_interfere_task
from time_utils import ts2datehour, datehour2ts

def create_task():
    ts = time.time()
    current_ts = datehour2ts(ts2datehour(ts))
    task_set = set()

    query_body_event = {
        "query": {
            "term": {"scan_text_finish":"0"}
        },
        "size": 10000
    }

    es_results = es_prediction.search(index=index_event_analysis, doc_type=type_event_analysis, body=query_body_event)["hits"]["hits"]
    for item in es_results:
        task_name = item["_source"]["pinyin_task_name"]
        task_set.add(task_name)
        # task_name, query_body, current_ts, former_ts
        r_scan_text.push(task_scan_text, json.dumps([task_name, item["_source"]["must_keywords"],item["_source"]["should_keywords"], current_ts,item["_source"]["start_time"],"analysis"]))
        es_prediction.update(index=index_event_analysis, doc_type=type_event_analysis, id=task_name, body={"doc":{"scan_text_processing": "1", "scan_text_time": current_ts}})


    query_body = {
        "query": {
            "should":[
                {"term":{"finish":"0"}},
        },
        "size":10000
    }

    results = es_prediction.search(index=index_manage_prediction_task, doc_type=type_manage_prediction_task, body=query_body)["hits"]["hits"]

    for item in results:
        task_name = item["_source"]["pinyin_task_name"]
        # task_name, query_body, current_ts, former_ts
        if task_name in task_set:
            continue
        else:
            task_set.add(task_name)
        r_scan_text.push(task_scan_text, json.dumps([task_name, item["_source"]["must_keywords"],item["_source"]["should_keywords"], current_ts,item["_source"]["scan_text_time"],"prediction"]))
        es_prediction.update(index=index_manage_prediction_task,doc_type=type_manage_prediction_task, id=task_name, body={"doc":{"scan_text_time": current_ts}})



    query_body = {
        "query": {
            "term": {"finish": "0"}
        },
        "size": 10000
    }
    results = es_prediction.search(index=index_manage_interfere_task, doc_type=type_manage_interfere_task, body=query_body)["hits"]["hits"]

    for item in results:
        task_name = item["_source"]["pinyin_task_name"]
        # task_name, query_body, current_ts, former_ts
        if task_name in task_set:
            continue
        else:
            task_set.add(task_name)
        r_scan_text.push(task_scan_text, json.dumps([task_name, item["_source"]["must_keywords"],item["_source"]["should_keywords"], current_ts,item["_source"]["scan_text_time"],"interfere"]))
        es_prediction.update(index=index_manage_interfere_task,doc_type=type_manage_interfere_task, id=task_name, body={"doc":{"scan_text_time": current_ts}})

    print "finish"


if __name__ == "__main__":
    create_task()


