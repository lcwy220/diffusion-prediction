#-*- coding:utf-8 -*-

import os
import time
import math
import json
from flask import Blueprint, url_for, render_template, request, abort, flash, session, redirect
from diffusion_prediction.time_utils import datetime2ts, ts2datetime
from diffusion_prediction.global_utils import R_SOCIAL_SENSING as r
from diffusion_prediction.global_utils import es_prediction as es
from utils import get_text_detail
#from delete_es import delete_es
#from addtional import get_sensor_detail, get_more_out, get_more_portrait
from get_task_detail import get_task_detail_2

mod = Blueprint('social_sensing', __name__, url_prefix='/social_sensing')

#页面链接
@mod.route('/hot_event/')
def hot_event():

    return render_template('social_sensing/hot_event.html')

@mod.route('/event_perception/')
def event_perception():

    return render_template('social_sensing/event_perception.html')

@mod.route('/perceived_results/')
def perceived_results():

        return render_template('social_sensing/perceived_results.html')

@mod.route('/create_task/')
def ajax_create_task():


    return json.dumps(["1"])


"""
@mod.route('/delete_task/')
def ajax_delete_task():
    # delete task based on task_name
    task_name = request.args.get('task_name','') # must
    user = request.args.get('user', '')
    print task_name, user
    if task_name and user:
        _id = user + "-" + task_name
        es.delete(index=index_manage_sensing_task, doc_type=task_doc_type, id=_id)

    return json.dumps([])



@mod.route('/show_task/')
def ajax_show_task():
    # show all working task
    # "0": unfinish working task
    # "1": finish working task
    #user = request.args.get('user', '')
    #length = len(status)

    query_body = {
        "query":{
            "filtered":{
                "filter":{
                    "bool":{
                        "must":[
                            {"term":{"submit_user": user}}
                        ]
                    }
                }
            }
        },
        "sort": {"create_at": {"order": "desc"}},
        "size": 10000
    }

    try:
        search_results = es.search(index=index_manage_sensing_task, doc_type=task_doc_type, body=query_body)['hits']['hits']
    except:
        search_results = []
    results = []




    return json.dumps(results)
"""



# 返回详细信息，包括微博量、情感和参与的人
@mod.route('/get_warning_detail/')
def ajax_get_warning_detail():

    results = get_task_detail_2()

    return json.dumps(results)



# 返回某个时间段特定的文本，按照热度排序
@mod.route('/get_text_detail/')
def ajax_get_text_detail():
    print "texttttttttttttttttttttt"
    order = request.args.get('order', 'total') # total, retweeted, comment
    ts = int(request.args.get('ts', '')) # timestamp: 123456789
    text_type = request.args.get('text_type', 0) # 0: origin, 1:retweet

    results = get_text_detail(ts, text_type, order)

    return json.dumps(results)




#似乎不用
# 返回敏感微博
@mod.route('/get_sensitive_text_detail/')
def ajax_get_sensitive_text_detail():
    task_name = request.args.get('task_name','') # task_name
    user = request.args.get('user', '')
    order = request.args.get('order', 'sensitive') # total, retweeted, comment
    ts = int(request.args.get('ts', '')) # timestamp: 123456789

    results = get_sensitive_text_detail(task_name, ts, user, order)

    return json.dumps(results)
