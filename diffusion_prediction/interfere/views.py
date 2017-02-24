#-*- coding:utf-8 -*-

import os
import time
import json
from flask import Blueprint, url_for, render_template, request, abort, flash, session, redirect
from diffusion_prediction.global_config import type_manage_interfere_task, index_manage_interfere_task
from diffusion_prediction.global_utils import es_prediction
from diffusion_prediction.time_utils import ts2datetime, datetime2ts, datehour2ts, ts2datehour
import pinyin

mod = Blueprint('interfere', __name__, url_prefix='/interfere')


# create task
@mod.route('/create_interfere_task/')
def ajax_create_interfere_task():
    finish = ["0"]
    task_name = request.args.get('task_name','')
    pinyin_task_name = pinyin.get(task_name.encode('utf-8'), format='strip', delimiter="_")
    submit_user = request.args.get('submit_user', 'admin@qq.com')
    current_ts = int(time.time())
    submit_time = request.args.get('submit_time', current_ts)
    start_time = request.args.get('start_time', "")
    stop_time = request.args.get('stop_time', "")
    threshold = float(request.args.get('threshold', ""))
    remark = request.args.get('remark', '')
    must_keywords = request.args.get('must_keywords', '') # &&&
    should_keywords = request.args.get('should_keywords', '')

    task_detail = dict()
    task_detail["task_name"] = task_name
    task_detail['pinyin_task_name'] = pinyin_task_name
    task_detail["submit_user"] = submit_user
    task_detail["stop_time"] = int(stop_time)
    task_detail["start_time"] = int(start_time)
    task_detail["remark"] = remark
    task_detail["must_keywords"] = must_keywords
    task_detail["should_keywords"] = should_keywords
    task_detail["submit_time"] = int(submit_time)
    task_detail["network_exist"] = "0"
    task_detail["finish"] = "0"
    task_detail["stop_threshold"] = threshold
    task_detail["scan_text_time"] = datehour2ts(ts2datehour(float(submit_time)))
    task_detail["scan_text_processing"] = "0" # 是否正在复制微博文本
    task_detail["interfere_processing_status"] = "0"
    task_detail["stimulation_processing_status"] = "0"
    task_detail["interfere_finish"] = "0"
    task_detail["stimulation_finish"] = "0"
    task_detail["scan_text_finish"] = "0"


    exist_task = es_prediction.exists(index=index_manage_interfere_task, doc_type=type_manage_interfere_task, id=pinyin_task_name)
    if not exist_task:
        es_prediction.index(index=index_manage_interfere_task,doc_type=type_manage_interfere_task,id=pinyin_task_name, body=task_detail)
        finish = ["1"]

    return json.dumps(finish)


# show all task
@mod.route('/show_all_task/')
def ajax_show_all_task():
    results = []

    return json.dumps(results)



# return inferfere results
@mod.route('/get_inferfere_results/')
def ajax_get_inferfere_results():
    results = []

    return json.dumps(results)
