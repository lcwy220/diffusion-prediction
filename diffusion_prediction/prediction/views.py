
#-*- coding:utf-8 -*-

import os
import pinyin
import time
import json
from flask import Blueprint, url_for, render_template, request, abort, flash, session, redirect

from diffusion_prediction.time_utils import ts2datetime, datetime2ts
from diffusion_prediction.global_utils import es_prediction, r_trendline
from diffusion_prediction.global_config import index_manage_prediction_task, type_manage_prediction_task
from diffusion_prediction.time_utils import ts2datehour, datehour2ts

from utils import get_predict_count

mod = Blueprint('prediction', __name__, url_prefix='/prediction')


# create task
@mod.route('/create_task/')
def ajax_create_task():
    finish = ["0"]
    task_name = request.args.get('task_name','')
    pinyin_task_name = pinyin.get(task_name.encode('utf-8'), format='strip', delimiter="_")
    submit_user = request.args.get('submit_user', 'admin@qq.com')
    current_ts = int(time.time())
    submit_time = request.args.get('submit_time', current_ts)
    stop_time = request.args.get('stop_time', "")
    remark = request.args.get('remark', '')
    macro_during = request.args.get('macro_during', 3600)
    micro_during = request.args.get("micro_during", 3600)
    must_keywords = request.args.get('must_keywords', '') # &&&
    should_keywords = request.args.get('should_keywords', '')

    task_detail = dict()
    task_detail["task_name"] = task_name
    task_detail['pinyin_task_name'] = pinyin_task_name
    task_detail["submit_user"] = submit_user
    task_detail["stop_time"] = int(stop_time)
    task_detail["remark"] = remark
    task_detail["must_keywords"] = must_keywords
    task_detail["should_keywords"] = should_keywords
    task_detail["submit_time"] = int(submit_time)
    task_detail["macro_during"] = macro_during
    task_detail["micro_during"] = micro_during
    task_detail["finish"] = "0" # micro prediction finish
    task_detail["scan_text_time"] = datehour2ts(ts2datehour(float(submit_time))) # 上一次复制文本的时间
    task_detail["scan_text_processing"] = "0" # 是否正在复制微博文本

    task_detail["macro_value_finish"] = '0'
    task_detail["macro_trendline_finish"] = '0'


    exist_task = es_prediction.exists(index=index_manage_prediction_task, doc_type=type_manage_prediction_task, id=pinyin_task_name)
    if not exist_task:
        es_prediction.index(index=index_manage_prediction_task, doc_type=type_manage_prediction_task, id=pinyin_task_name, body=task_detail)
        finish = ["1"]

    return json.dumps(finish)


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

@mod.route('/delete_task/')
def ajax_delete_task():
    task_name = request.args.get("task_name", "")
    if task_name:
        es_prediction.delete(index=index_manage_prediction_task, doc_type=type_manage_prediction_task,id=task_name)

    return json.dumps(["1"])

# macro trendline prediction
@mod.route('/get_macro_trendline/')
def ajax_get_macro_trendline():
    task_name = request.args.get('task_name','')
    pinyin_task_name = "trendline_"+task_name
    results = r_trendline.get(pinyin_task_name)


    return results



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

# macro value prediction
@mod.route('/get_macro_prediction/')
def ajax_get_macro_prediction():


    return None
