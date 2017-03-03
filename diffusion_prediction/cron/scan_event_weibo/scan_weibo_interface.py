# -*-coding:utf-8-*-

import sys
reload(sys)
sys.path.append('../../')
from global_utils import es_prediction, r_scan_text
from global_config import task_scan_text, type_manage_interfere_task,index_manage_interfere_task, \
        index_event_analysis, type_event_analysis, index_manage_prediction_task,type_manage_prediction_task

from create_task import create_task
from wildcard_scan_event_text import scan_event_text
from scan_weibo_based_on_mid import scan_weibo


def scan_flow_text():
    while 1:
        task_detail = r_scan_text.rpop(task_scan_text)
        if not task_detail:
            break

        task_detail = json.loads(task_detail)
        task_name = task_detail[0]
        must_keys = task_detail[1]
        should_keys = task_detail[2]
        end_ts = task_detail[3]
        start_ts = task_detail[4]
        source = task_detail[5]

        scan_event_text(task_name, must_keys, should_keys, end_ts, start_ts)
        scan_weibo(task_name, start_ts, end_ts)

        if source == "prediction":
            es_prediction.update(index=index_manage_prediction_task,doc_type=type_manage_prediction_task, \
                id=task_name, body={"doc":{"scan_text_processing":"2"}})
        elif source == "analysis":
            es_prediction.update(index=index_event_analysis ,doc_type=type_event_analysis, \
                id=task_name, body={"doc":{"scan_text_processing":"0"}})
        elif source == "interfere":
            es_prediction.update(index=index_manage_interfere_task ,doc_type=type_manage_interfere_task, \
                id=task_name, body={"doc":{"scan_text_processing":"1"}})





if __name__ == "__main__":
    create_task()
    scan_flow_text()

