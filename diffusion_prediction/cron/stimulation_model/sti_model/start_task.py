# -*-coding:utf-8-*-

from find_extend_user import predict_user_influence

import sys
import time
import json
reload(sys)
sys.path.append('../../../')
from global_utils import es_prediction, r_stimulation, RUN_TYPE
from global_config import type_manage_interfere_task, index_manage_interfere_task, \
                            task_stimulation


def start_task():
    while 1:
        detail = r_stimulation.rpop(task_stimulation)
        print "detail: ", detail
        if not detail:
            break

        task_detail = json.loads(detail)

        task_name = task_detail[0]
        stop_time = task_detail[1]
        scan_text_finish = task_detail[2]
        ts = task_detail[3]

        if RUN_TYPE == 1:
            while 1:
                if float(scan_text_finish) != float(1):
                    time.sleep(60)
                    scan_text_finish = es_prediction.get(index=index_manage_interfere_task,doc_type=\
                        type_manage_interfere_task,id=task_name)["_source"]["scan_text_finish"]
                else:
                    print "begin work"
                    break

        predict_user_influence(task_name, stop_time, ts)



if __name__ == "__main__":
    start_task()

