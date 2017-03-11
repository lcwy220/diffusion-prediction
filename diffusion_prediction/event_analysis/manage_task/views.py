# -*-coding:utf-8-*-

import os
import pinyin
import time
import json
from flask import Blueprint,render_template,request
from diffusion_prediction.time_utils import *
from diffusion_prediction.global_config import index_manage_event_analysis,type_manage_event_analysis
from diffusion_prediction.global_utils import es_prediction as es

mod = Blueprint('manage_event',__name__,url_prefix='/manage_event')


@mod.route('/submit_event_task/')
def ajax_submit_event_task():

    task_name = request.args.get('task_name','')
    pinyin_task_name = pinyin.get(task_name.encode('utf-8'),format='strip',delimiter='_')
    submit_user = request.args.get('submit_user','admin@qq.com')
    current_ts = int(time.time())
    submit_time = request.args.get('submit_time',current_ts)
    start_ts = request.args.get('start_ts','')
    end_ts = request.args.get('end_ts','')
    must_keywords = request.args.get('must_keywords','')
    should_keywords = request.args.get('should_keywords','')

    task_detail = dict()
    task_detail["task_name"] = task_name
    task_detail['pinyin_task_name'] = pinyin_task_name
    task_detail["submit_user"] = submit_user
    task_detail["start_ts"] = long(start_ts)
    print '36::::',task_detail["start_ts"]
    print '36::::',type(task_detail["start_ts"])
    task_detail["end_ts"] = long(end_ts)
    task_detail["submit_time"] = int(submit_time)
    task_detail["must_keywords"] = must_keywords
    task_detail["should_keywords"] = should_keywords
    task_detail["finish"] = "0"
    task_detail["scan_text_finish"] = "0" # 是否正在复制微博文本
    task_detail["event_value_finish"] = "0" # 事件分析状态
#event_value_finish
#事件是否计算完 0 未计算且未提交队列  1 已提交队列尚未计算  2 开始计算  3 计算完成
# finish: -1 weibo_counts\uid_counts -2 time -3 geo -4 network -5 sentiment 
    #index_name = "event_analysis_task_"+task_name
    '''
    exist_task = es.exists(index=index_manage_event_analysis, doc_type=type_manage_event_analysis, id=pinyin_task_name)
    if not exist_task:
        es.index(index=index_manage_event_analysis,doc_type=type_manage_event_analysis,id=pinyin_task_name, body=task_detail)
        finish = ['submit_success']
    else:
    	finish = ['already_exists']
	
    return json.dumps(finish)
    '''

    try:
    	es.index(index=index_manage_event_analysis,doc_type=type_manage_event_analysis,id=pinyin_task_name, \
    		body=task_detail)
    	result = ["1"]  #提交成功
    except:
    	result = ["0"]  #提交失败

    return json.dumps(result)

    		

@mod.route('/delete_event_task/')
def ajax_delete_event_task():

	task_name = request.args.get('task_name','')
	pinyin_task_name = pinyin.get(task_name.encode('utf-8'),format='strip',delimiter='_')

	try:
		result = es.delete(index=index_manage_event_analysis,doc_type=type_manage_event_analysis,\
			id=pinyin_task_name)['found']
		return result  #True

	except:
		return 'False'


@mod.route('/show_event_task/')
def ajax_show_all_task():
    query_body = {
        "query": {
            "match_all":{}
        },
        "sort":{"submit_time":{"order":"desc"}},
        "size": 1000
    }

    es_results = es.search(index=index_manage_event_analysis, doc_type=type_manage_event_analysis, \
            body=query_body)["hits"]["hits"]
    #print '84::::::::',es_results
    task_list = []
    for item in es_results:
        #print '96::::::::',item
        tmp = []
        item_detail = item["_source"]
        tmp.append(item_detail["task_name"])
        tmp.append(item_detail["submit_user"])
        tmp.append(item_detail["submit_time"])
        tmp.append(item_detail["start_ts"])
        tmp.append(item_detail["end_ts"])
        tmp.append(item_detail["event_value_finish"])
        
        task_list.append(tmp)

    return json.dumps(task_list)
