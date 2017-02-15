#-*- coding:utf-8 -*-

import os
import time
import json
from flask import Blueprint, url_for, render_template, request, abort, flash, session, redirect

from diffusion-prediction.time_utils import ts2datetime, datetime2ts
from diffusion-prediction.global_utils import es_prediction
from diffusion-prediction.global_config import index_manage_prediction_task, type_manage_prediction_task

from utils import get_predict_count

mod = Blueprint('prediction', __name__, url_prefix='/prediction')


# create task
@mod.route('/create_task/')
def ajax_create_task():
    finish = 0
    task_name = request.args.get('task_name','')
    submit_user = request.args.get('submit_user', 'admin@qq.com')
    stop_time = request.args.get('stop_time', "")
    remark = request.args.get('remark', '')
    submit_time = time.time()
    macro_during = request.args.get('macro_during', 3600)
    micro_during = reuqest.args.get("micro_during", 3600)
    query_body = reuqest.args.get('query_body', '') # revise

    task_detail = dict()
    task_detail["task_name"] = task_name
    task_detail["submit_user"] = submit_user
    task_detail["stop_time"] = stop_time
    task_detail["remark"] = remark
    task_detail["submit_time"] = submit_time
    task_detail["macro_during"] = macro_during
    task_detail["micro_during"] = micro_during
    task_detail["query_body"] = query_body
    task_detail["finish"] = '0'
    task_detail["macro_value_finish"] = '0'
    task_detail["macro_trendline_finish"] = '0'
    

    exist_task = es_prediction.exists(index=index_manage_prediction_task, doc_type=type_manage_prediction_task, id=task_name)
    if not exist_task:
        es_prediction.index(index=index_manage_prediction_task, doc_type=type_manage_prediction_task, id=task_name, body=task_detail)

    return finish


# show task
@mod.route('/show_task/')
def ajax_show_task():
    query_body = {
        "query":{
            "match_all": {}
        },
        "size": 10000,
        "sort":{"submit_time":{"order":"desc"}}
    }

    results = es_prediction.search(index=index_manage_prediction_task, doc_type=type_manage_prediction_task, body=query_body)["hits"]["hits"]

    task_list = []
    for item in results:
        task_list.append(item["_source"])

    return json.dumps(task_list)



# macro prediction
@mod.route('/get_macro_prediction/')
def ajax_get_macro_prediction():
    results = []

    return json.dumps(results)



# micro prediction
@mod.route('/get_micro_prediction/')
def ajax_get_micro_prediction():
    task_name = request.args.get('task_name','')
    end_ts = request.args.get('end_ts', '')
    start_ts = request.args.get('start_ts', '')
    end_ts = long(end_ts)
    start_ts = long(start_ts)
    results = []
    results = get_predict_count(task_name, start_ts, end_ts)

    return results

