#-*- coding:utf-8 -*-

import os
import time
import json
from flask import Blueprint, url_for, render_template, request, abort, flash, session, redirect

#from diffusion-prediction.time_utils import ts2datetime, datetime2ts


mod = Blueprint('interfere', __name__, url_prefix='/interfere')

#页面链接
@mod.route('/intervention_decision/')
def intervention_decision():

    return render_template('interfere/un_decision.html')

@mod.route('/strategy_results/')
def strategy_results():

    return render_template('interfere/strategy_results.html')

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
    remark = request.args.get('remark', '')
    must_keywords = request.args.get('must_keywords', '') # &&&
    should_keywords = request.args.get('should_keywords', '')
    sti_during = request.args.get("interfer_during", 3600)

    task_detail = dict()
    task_detail["task_name"] = task_name
    task_detail['pinyin_task_name'] = pinyin_task_name
    task_detail["submit_user"] = submit_user
    task_detail["stop_time"] = int(stop_time)
    task_detail["start_time"] = int(start_time)
    task_detail["update_time"] = int(submit_time)
    task_detail["remark"] = remark
    task_detail["must_keywords"] = must_keywords
    task_detail["should_keywords"] = should_keywords
    task_detail["submit_time"] = int(submit_time)
    task_detail["finish"] = "0"
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
    query_body = {
        "query": {
            "match_all":{}
        },
        "sort":{"submit_time":{"order":"desc"}},
        "size": 1000
    }

    es_results = es.search(index=index_manage_interfere_task, doc_type=type_manage_interfere_task, \
            body=query_body)["hits"]["hits"]
    task_list = []
    for item in es_results:
        tmp = []
        item_detail = item["_source"]
        tmp.append(item_detail["task_name"])
        tmp.append(item_detail["submit_user"])
        tmp.append(item_detail["submit_time"])
        tmp.append(item_detail["stop_time"])
        tmp.append(item_detail["update_time"])
        task_list.append(tmp)

    return json.dumps(task_list)


# return task detail
@mod.route('/get_task_detail/')
def get_task_detail():
    task_name = request.args.get('task_name','')
    pinyin_task_name = pinyin.get(task_name.encode('utf-8'), format='strip', delimiter="_")
    task_detail = es_prediction.get(index=index_manage_interfere_task, doc_type=type_manage_interfere_task,id=pinyin_task_name)["_source"]
    task_dict = dict()
    attribute_list = ["task_name", "remark", "submit_user","submit_time","start_time", "stop_time","update_time","finish","should_keywords","must_keywords"]
    for item in attribute_list:
        task_dict[item] = task_detail[item]

    return json.dumps(task_dict)


# return inferfere results
@mod.route('/get_current_hot_weibo/')
def ajax_get_current_hot_weibo():
    task_name = request.args.get('task_name','')
    ts = request.args.get("ts","")
    pinyin_task_name = pinyin.get(task_name.encode('utf-8'), format='strip', delimiter="_")
    index_name = "stimulation_"+pinyin_task_name
    index_type = "stimulation_results"
    es_results = es_prediction.get(index=index_name, doc_type=index_type, id=ts)["_source"]
    results = json.loads(es_results["current_hot_weibo"])

    attribute_list = ["comment", "uid", "text", "uname", "fansnum", "retweet", "mid", "geo", "photo_url", "statusnum", "timestamp"]
    return_list = []
    for each in results:
        new_dict = dict()
        for item in attribute_list:
            new_dict[item] =each[item]
        return_list.append(new_dict)

    return json.dumps(return_list)


@mod.route('/get_potential_hot_weibo/')
def ajax_get_potential_hot_weibo():
    task_name = request.args.get('task_name','')
    ts = request.args.get("ts","")
    pinyin_task_name = pinyin.get(task_name.encode('utf-8'), format='strip', delimiter="_")
    index_name = "stimulation_"+pinyin_task_name
    index_type = "stimulation_results"
    es_results = es_prediction.get(index=index_name, doc_type=index_type, id=ts)["_source"]
    results = es_results["potential_hot_weibo"]

    return results



@mod.route('/get_future_user_info/')
def ajax_get_future_user_info():
    task_name = request.args.get('task_name','')
    ts = request.args.get("ts","")
    pinyin_task_name = pinyin.get(task_name.encode('utf-8'), format='strip', delimiter="_")
    index_name = "stimulation_"+pinyin_task_name
    index_type = "stimulation_results"
    es_results = es_prediction.get(index=index_name, doc_type=index_type, id=ts)["_source"]
    results = es_results["future_user_info"]

    return results


@mod.route('/get_diffusion_path/')
def ajax_get_diffusion_path():
    task_name = request.args.get('task_name','')
    ts = request.args.get("ts","")
    pinyin_task_name = pinyin.get(task_name.encode('utf-8'), format='strip', delimiter="_")
    index_name = "stimulation_"+pinyin_task_name
    index_type = "stimulation_results"
    es_results = es_prediction.get(index=index_name, doc_type=index_type, id=ts)["_source"]
    results = es_results["diffusion"]

    return results







