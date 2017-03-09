#-*- coding:utf-8 -*-

import os
import time
import json
from flask import Blueprint, url_for, render_template, request, abort, flash, session, redirect

from diffusion_prediction.time_utils import ts2datetime, datetime2ts
from diffusion_prediction.global_utils import es_prediction, es_user_profile
from diffusion_prediction.global_utils import R_SOCIAL_SENSING as r
from diffusion_prediction.global_utils import r_stimulation
from diffusion_prediction.global_config import profile_index_name,profile_index_type,RUN_TYPE, zh_data,name_list

mod = Blueprint('manage', __name__, url_prefix='/manage')

#页面链接
@mod.route('/purview/')
def purview():

    return render_template('manage/purview.html')

@mod.route('/sensitive_words/')
def sensitive_words():

    return render_template('manage/sensitive_words.html')


# user authority

# specified social sensors
@mod.route('/show_social_sensors/')
def ajax_show_social_sensors():
    results = []
    task_detail = es_prediction.get(index="manage_sensing_task", doc_type="task", id="social_sensing_task")["_source"]
    uid_list = json.loads(task_detail["social_sensors"])

    profile_results = es_user_profile.mget(index=profile_index_name, doc_type=profile_index_type, body={"ids":uid_list})["docs"]
    for item in profile_results:
        tmp = []
        if item["found"]:
            tmp.append(item["_source"]["nick_name"])
            tmp.append(item["_source"]["uid"])
            tmp.append(item["_source"]["user_location"])
            tmp.append(item["_source"]["fansnum"])
            tmp.append(item["_source"]["statusnum"])
            tmp.append(item["_source"]["friendsnum"])
        else:
            tmp.append(item["_id"])
            tmp.append(item["_id"])
            tmp.append('')
            tmp.append('')
            tmp.append('')
            tmp.append('')
        results.append(tmp)

    return json.dumps(results)


@mod.route('/add_social_sensors/')
def ajax_add_social_sensor():
    add_user = request.args.get("add_users",'') # &.join
    task_detail = es_prediction.get(index="manage_sensing_task", doc_type="task", id="social_sensing_task")["_source"]
    sensors = json.loads(task_detail["social_sensors"])
    if add_user:
        uid_list = add_user.split("&")
        if uid_list:
            in_set = set(uid_list) & set(sensors)
            out_set = set(uid_list) - set(sensors)
            if out_set:
                new_list = list(set(uid_list) | set(sensors))
                task_detail["social_sensors"] = json.dumps(new_list)
                es_prediction.index(index="manage_sensing_task", doc_type="task", id="social_sensing_task", body=task_detail)["_source"]
    results = [list(in_set), list(out_set)]

    return json.dumps(results)


@mod.route('/delete_social_sensors/')
def ajax_delete_social_sensors():
    delete_user = request.args.get("delete_users",'') # &.join
    task_detail = es_prediction.get(index="manage_sensing_task", doc_type="task", id="social_sensing_task")["_source"]
    sensors = json.loads(task_detail["social_sensors"])
    if delete_user:
        uid_list = delete_user.split("&")
        new_list = set(sensors) - set(uid_list)
        task_detail["social_sensors"] = json.dumps(list(new_list))
        es_prediction.index(index="manage_sensing_task", doc_type="task", id="social_sensing_task", body=task_detail)["_source"]


    return json.dumps(["1"])



# 管理推荐事件顺序
@mod.route('/topic_order/')
def ajax_topic_order():
    topic_value_dict = json.loads(r.get("topic_value_dict"))
    mapping_dict = dict()
    for i in range(len(zh_data)):
        mapping_dict[name_list[i]] = zh_data[i]

    new_dict = dict()
    for key in topic_value_dict:
        new_dict[mapping_dict[key]] = topic_value_dict[key]

    return json.dumps(new_dict)

@mod.route('/revise_order/')
def ajax_revise_order():
    key = request.args.get("topic","")
    value = request.args.get("value","")
    topic_value_dict = json.loads(r.get("topic_value_dict"))
    mapping_dict = dict()
    for i in range(len(zh_data)):
        mapping_dict[zh_data[i]] = name_list[i]

    if key and value:
        topic_value_dict[mapping_dict[key]] = value
        r.set("topic_value_dict", json.dumps(topic_value_dict))

    return json.dumps([])


# 修改仿真参数
@mod.route('/revise_interfer_parameter/')
def ajax_revise_parameter():
    key = request.args.get("parameter_name", "")
    value = request.args.get("parameter_value", "")
    if key and value:
        r_stimulation.set(key, value)

    return json.dumps(["1"])

# 获取仿真参数
@mod.route('/get_interfer_parameter/')
def ajax_get_parameter():
    extend_retweet_threshold = float(r_stimulation.get("extend_retweet_threshold"))
    in_user_threshold = float(r_stimulation.get("in_user_threshold"))
    potential_threshold = float(r_stimulation.get("potential_threshold"))

    results = dict()
    # 未来参与用户最近被转发的次数阈值
    results["extend_retweet_threshold"] = extend_retweet_threshold
    # 重要参与用户至少被转发的次数阈值
    results["in_user_threshold"] = in_user_threshold
    # 重要潜在用户参与事件后可能被转发的次数阈值
    results["potential_threshold"] = potential_threshold

    return json.dumps(results)


