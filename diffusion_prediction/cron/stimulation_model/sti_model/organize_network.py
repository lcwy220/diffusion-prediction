# -*-coding:utf-8-*-

import json
import sys
import pinyin
from elasticsearch.helpers import scan

reload(sys)
sys.path.append("../../../")
from global_utils import es_prediction
from global_config import RUN_TYPE, index_manage_interfere_task,type_manage_interfere_task

def organize_network(task_name, ts):
    count = 0
    es_results = es_prediction.get(index=index_manage_interfere_task, \
            doc_type=type_manage_interfere_task, id=task_name)["_source"]
    start_time = es_results["start_time"]
    stop_time = es_results["stop_time"]
    user_set = set()
    query_body = {
        "query":{
            "range":{
                "timestamp":{
                    "gte": start_time,
                    "lt": ts
                }
            }
        }
    }


    es_scan = scan(es_prediction, query=query_body, index=task_name, doc_type="text", size=3000)
    while 1:
        try:
            re_es = es_scan.next()
            count += 1
            if count % 3000 == 0:
                print "search participators: ", count
            detail = re_es["_source"]
            if int(detail["message_type"]) != 2:
                user_set.add(detail["uid"])
            if int(detail["message_type"]) == 3 or int(detail["message_type"]) == 2:
                if detail["directed_uid"]:
                    user_set.add(str(detail["directed_uid"]))
                user_set.add(detail["root_uid"])
        except StopIteration:
            print "finish"
            break

    print len(user_set)
    return list(user_set)


if __name__ == "__main__":
    organize_network("zui_gao_fa_di_zhi_yan_se_ge_ming")
