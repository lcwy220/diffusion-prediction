#-*- coding:utf-8 -*-

import os
import time
import json
import pinyin
from flask import Blueprint, url_for, render_template, request, abort, flash, session, redirect
from diffusion_prediction.global_utils import es_prediction
from diffusion_prediction.global_config import index_manage_interfere_task, type_manage_interfere_task,\
        index_manage_event_analysis,type_manage_event_analysis,index_manage_prediction_task,type_manage_prediction_task
from diffusion_prediction.time_utils import ts2datetime, datetime2ts,datehour2ts,ts2datehour

es = es_prediction

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
    # 创建成功返回["1"]
    # 创建失败返回["0"]:提示有重复任务存在

    finish = ["0"]
    task_name = request.args.get('task_name','')#
    pinyin_task_name = pinyin.get(task_name.encode('utf-8'), format='strip', delimiter="_")
    submit_user = request.args.get('submit_user', 'admin@qq.com')
    current_ts = int(time.time())
    submit_time = request.args.get('submit_time', current_ts)#
    start_time = request.args.get('start_time', "")#
    stop_time = request.args.get('stop_time', "")#
    remark = request.args.get('remark', '')
    must_keywords = request.args.get('must_keywords', '') # &&&
    should_keywords = request.args.get('should_keywords', '') #
    sti_during = request.args.get("interfer_during", 3600)

    task_detail = dict()
    task_detail["stimulation_during"] = sti_during
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

    #print '62:::::::::'
    exist_task = es_prediction.exists(index=index_manage_interfere_task, doc_type=type_manage_interfere_task, id=pinyin_task_name)
    #print '64:::::',exist_task
    if not exist_task:
        es_prediction.index(index=index_manage_interfere_task,doc_type=type_manage_interfere_task,id=pinyin_task_name, body=task_detail)
        finish = ["1"]
    # finish  0 已经存在  1  提交成功

    return json.dumps(finish)


@mod.route('/delete_task/')
def ajax_delete_task():
    task_name = request.args.get("task_name","")
    pinyin_task_name = pinyin.get(task_name.encode('utf-8'),format='strip',delimiter='_')

    try:
        result = es.delete(index=index_manage_interfere_task,doc_type=type_manage_interfere_task,\
            id=pinyin_task_name)['found']
        return json.dumps(["1"])  #True

    except:
        return json.dumps(["0"])


# show all task
@mod.route('/show_all_task/')
# 展示内容：任务名 提交人 起始时间 终止时间 进度 上一次更新时间 备注
def ajax_show_all_task():
    query_body = {
        "query": {
            "match_all":{}
        },
        "sort":{"submit_time":{"order":"desc"}},
        "size": 1000
    }

    es_results = es_prediction.search(index=index_manage_interfere_task, doc_type=type_manage_interfere_task, \
            body=query_body)["hits"]["hits"]
    #print '84::::::::',es_results
    '''
    task_list = []
    for item in es_results:
        tmp = []
        item_detail = item["_source"]
        tmp.append(item_detail["task_name"])
        tmp.append(item_detail["submit_user"]) # 可忽略
        tmp.append(item_detail["submit_time"])
        tmp.append(item_detail["stop_time"])
        tmp.append(item_detail["update_time"])
        tmp.append(item_detail["remark"])
        task_list.append(tmp)
    '''
    task_list = []
    for item in es_results:
        task_list.append(item["_source"])
        
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
    #print 'keys::::::::',es_results.keys()
    #results = es_results["diffusion"]
    results = es_results["diffusion_path"]

    return results


# 展示先前的事件分析和态势预测任务
# 展示字段顺序: task_name, submit_user, submit_time, end_ts, remark, 来源
# 点击查看详情: 展示任务的细节信息

@mod.route('/show_former_task/')
def ajax_show_analysis_task():
    query_body = {
        "query":{
            "range":{
                "submit_time":{
                    "gte": time.time()-20*24*3600
                }
            }
        },
        "size": 1000,
        "sort":{"submit_time":{"order":"desc"}}
    }

    task_set = set()
    es_results = es_prediction.search(index=index_manage_event_analysis,doc_type=\
            type_manage_event_analysis, body=query_body)["hits"]["hits"]

    analysis_results = []
    for item in es_results:
        task_set.add(item["_source"]["pinyin_task_name"])
        analysis_results.append(item["_source"])


    prediction_results = []
    es_results = es_prediction.search(index=index_manage_prediction_task, doc_type=\
            type_manage_prediction_task,body=query_body)["hits"]["hits"]

    for item in es_results:
        task_name = item["_source"]["pinyin_task_name"]
        if task_name not in task_set:
            prediction_results.append(item["_source"])
            task_set.add(task_name)

    return_dict = dict()
    return_dict["event_analysis_task"] = analysis_results
    return_dict["event_prediction_task"] = prediction_results

    return json.dumps(return_dict)



