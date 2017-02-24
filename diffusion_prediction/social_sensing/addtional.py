# -*-coding:utf-8-*-

import sys
import json
import math
import time
from full_text_serach import count_hot_uid, query_hot_mid
from user_portrait.time_utils import ts2date
from user_portrait.global_utils import es_user_profile as es_profile
from user_portrait.global_utils import es_user_portrait as es
from user_portrait.global_utils import es_flow_text as es_text
from user_portrait.global_utils import profile_index_name, profile_index_type, portrait_index_name, portrait_index_type, \
                         flow_text_index_name_pre, flow_text_index_type
from user_portrait.parameter import INDEX_MANAGE_SOCIAL_SENSING as index_manage_sensing_task
from user_portrait.parameter import DOC_TYPE_MANAGE_SOCIAL_SENSING as task_doc_type
from user_portrait.parameter import DETAIL_SOCIAL_SENSING as index_sensing_task
from user_portrait.parameter import SOCIAL_SENSOR_INFO, signal_count_varition, signal_sentiment_varition, CURRENT_WARNING_DICT, IMPORTANT_USER_THRESHOULD, signal_sensitive_variation, DAY
from user_portrait.time_utils import ts2date_min, datetime2ts, ts2datetime
from get_task_detail import get_top_influence,get_top_all_influence


def get_sensor_detail(task_name, ts, user):
    index_name = task_name
    _id = user + "-" + task_name
    task_detail = es.get(index=index_manage_sensing_task, doc_type=task_doc_type, id=_id)["_source"]
    social_sensors = json.loads(task_detail['social_sensors'])
    portrait_detail = []

    top_importance = get_top_influence("importance")
    top_influence = get_top_influence("influence")
    top_activeness = get_top_influence("activeness")

    if social_sensors:
        search_results = es.mget(index=portrait_index_name, doc_type=portrait_index_type, body={"ids":social_sensors}, fields=SOCIAL_SENSOR_INFO)['docs']
        for item in search_results:
            temp = []
            if item['found']:
                for iter_item in SOCIAL_SENSOR_INFO:
                    if iter_item == "topic_string":
                        temp.append(item["fields"][iter_item][0].split('&'))
                    elif iter_item == "activeness": 
                        temp.append(math.log(item['fields']['activeness'][0]/float(top_activeness)*9+1, 10)*100)
                    elif iter_item == "importance":
                        temp.append(math.log(item['fields']['importance'][0]/float(top_importance)*9+1, 10)*100)
                    elif iter_item == "influence":
                        temp.append(math.log(item['fields']['influence'][0]/float(top_influence)*9+1, 10)*100)
                    else:
                        temp.append(item["fields"][iter_item][0])
                portrait_detail.append(temp)

        portrait_detail = sorted(portrait_detail, key=lambda x:x[5], reverse=True)
    else:
        portrait_detail = []

    return portrait_detail


def get_more_portrait(task_name, ts, user):
    results = dict()
    index_name = task_name
    _id = user + "-" + task_name
    task_detail = es.get(index=index_manage_sensing_task, doc_type=task_doc_type, id=_id)["_source"]
    task_name = task_detail['task_name']
    social_sensors = json.loads(task_detail['social_sensors'])
    history_status = json.loads(task_detail['history_status'])

    important_user_set = set() # 重要人物列表
    out_portrait_users = set() # 未入库

    top_importance = get_top_influence("importance")
    top_influence = get_top_influence("influence")
    top_activeness = get_top_influence("activeness")

    ts = int(ts)
    time_series = history_status

    if time_series:
        flow_detail = es.mget(index=index_sensing_task, doc_type=_id, body={"ids": time_series})['docs']
    else:
        flow_detail = {}

    if flow_detail:
        for item in flow_detail:
            item = item['_source']
            timestamp = item['timestamp']

            temp_important_user_list = json.loads(item['important_users'])
            unfiltered_users = json.loads(item['unfilter_users'])
            temp_out_portrait_users = set(unfiltered_users) - set(temp_important_user_list)
            important_user_set = important_user_set | set(temp_important_user_list)


    important_uid_list = list(important_user_set)
    social_sensor_set = set(social_sensors)
    user_detail_info = [] #
    if important_uid_list:
        important_uid_list = important_uid_list[:1000]
        user_results = es.mget(index=portrait_index_name, doc_type=portrait_index_type, body={"ids":important_uid_list}, fields=['uid', 'uname', 'domain', 'topic_string', "photo_url", 'importance', 'influence', 'activeness'])['docs']
        for item in user_results:
            if item['found']:
                temp = []
                temp.append(item['fields']['uid'][0])
                uname = item['fields']['uname'][0]
                if not uname or uname == "未知":
                    uname = item['fields']['uid'][0]
                temp.append(uname)
                temp.append(item['fields']['photo_url'][0])
                temp.append(item['fields']['domain'][0])
                temp.append(item['fields']['topic_string'][0].split('&'))
                temp.append(math.log(item['fields']['importance'][0]/float(top_importance)*9+1, 10)*100)
                temp.append(math.log(item['fields']['influence'][0]/float(top_influence)*9+1, 10)*100)
                temp.append(math.log(item['fields']['activeness'][0]/float(top_activeness)*9+1, 10)*100)
                if item['fields']['uid'][0] in social_sensor_set:
                    temp.append(1)
                else:
                    temp.append(0)
                user_detail_info.append(temp)

    if user_detail_info:
        user_detail_info = sorted(user_detail_info, key=lambda x:x[6], reverse=True)
    else:
        user_detail_info = []

    return user_detail_info



def get_more_out(task_name, ts, user):
    results = dict()
    index_name = task_name
    _id = user + "-" + task_name
    task_detail = es.get(index=index_manage_sensing_task, doc_type=task_doc_type, id=_id)["_source"]
    task_name = task_detail['task_name']
    social_sensors = json.loads(task_detail['social_sensors'])
    history_status = json.loads(task_detail['history_status'])

    important_user_set = set() # 重要人物列表
    out_portrait_users = set() # 未入库

    top_importance = get_top_influence("importance")
    top_influence = get_top_influence("influence")
    top_activeness = get_top_influence("activeness")

    ts = int(ts)
    time_series = history_status

    if time_series:
        flow_detail = es.mget(index=index_sensing_task, doc_type=_id, body={"ids": time_series})['docs']
    else:
        flow_detail = {}

    if flow_detail:
        for item in flow_detail:
            item = item['_source']
            timestamp = item['timestamp']

            temp_important_user_list = json.loads(item['important_users'])
            unfiltered_users = json.loads(item['unfilter_users'])
            temp_out_portrait_users = set(unfiltered_users) - set(temp_important_user_list)
            important_user_set = important_user_set | set(temp_important_user_list)
            out_portrait_users = out_portrait_users | set(temp_out_portrait_users)

    out_portrait_users_list = list(out_portrait_users)
    social_sensor_set = set(social_sensors)
    out_user_detail_info = []
    if out_portrait_users_list:
        out_portrait_users_list = out_portrait_users_list[:1000]
        profile_results = es_profile.mget(index=profile_index_name, doc_type=profile_index_type, body={"ids":out_portrait_users_list})["docs"]
        bci_index = "bci_" + ts2datetime(ts-DAY).replace('-','')
        influence_results = es.mget(index=bci_index, doc_type="bci", body={"ids":out_portrait_users_list}, fields=["user_index"])['docs']
        bci_results = es_profile.mget(index="bci_history", doc_type="bci", body={"ids":out_portrait_users_list}, fields=['user_fansnum'])['docs']
        top_influence = get_top_all_influence("user_index", ts)
        count = 0
        if profile_results:
            for item in profile_results:
                temp = []
                if item['found']:
                    temp.append(item['_source']['uid'])
                    if item['_source']['nick_name']:
                        temp.append(item['_source']['nick_name'])
                    else:
                        temp.append(item['_source']['uid'])
                    temp.append(item['_source']['user_location'])
                else:
                    temp.append(item['_id'])
                    temp.append(item['_id'])
                    temp.extend([''])
                try:
                    user_fansnum = bci_results[count]["fields"]["user_fansnum"][0]
                except:
                    user_fansnum - 0
                temp.append(user_fansnum)
                temp_influ = influence_results[count]
                if temp_influ.get('found', 0):
                    user_index = temp_influ['fields']['user_index'][0]
                    temp.append(math.log(user_index/float(top_influence)*9+1, 10)*100)
                else:
                    temp.append(0)
                count += 1
                out_user_detail_info.append(temp)

    if len(out_user_detail_info):
        out_user_detail_info = sorted(out_user_detail_info, key=lambda x:x[4], reverse=True)

    return out_user_detail_info




