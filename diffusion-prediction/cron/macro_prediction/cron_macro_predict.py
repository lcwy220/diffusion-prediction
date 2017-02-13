# -*-coding:utf-8*-

import time
import json
import pickle
import sys
reload(sys)
sys.path.append("../../")

from global_utils import es_flow_text,es_prediction,r_micro
from utils import save_manage_event_task_results,save_event_info_results

def rate_predict(event):

    feature_list = feature_compute(event)
    feature_list_gbdt = []
    for feature in feature_list:
            #把多个分开（extend）

    #加载模型
    with open("all_gbdt_10_1000_4.pkl" ,"rb") as f:
        gbdt = pickle.loads(f)
    
    pred = gbdt.predict(feature_list_gbdt)
    
    for item in pred:
	prediction_value = item

    task_detail = es_prediction.get(index=)

    
    #保存入表
    ## 存入任务表
    task_name = 
    keywords = 
    query_body = 
    submit_time = 
    predict_time = time.time()
    predict_value = 
    predict_rank = 
    compute_status = 
    create_by =     

    save_manage_event_task_results(task_name,keywords,query_body,submit_time,\
                                predict_time,predict_value,predict_rank,\
                                compute_status,create_by)
    
    ## 存入事件信息表
    #for i in range(len(feature_list)):
    event = event
    topic_field = feature_list[0]
    total_num = feature_list[1]
    total_user_fans = feature_list[2]
    total_comment = feature_list[3]
    total_retweet = feature_list[4]
    total_sensitive = feature_list[5]
    total_sensitive_ratio = feature_list[6]
    total_negtive = feature_list[7]
    total_important_user = feature_list[8]   
    total_origin_type = feature_list[9]
    origin_ratio = feature_list[10]
    total_retweet_type = feature_list[11]
    retweet_ratio = feature_list[12]
    total_comment_type = feature_list[13]
    comment_ratio = feature_list[14]
    at_count = feature_list[15]
    event_uid_count = feature_list[16]
    event_trend_delta = feature_list[17]
    predict_value = predict_value
    predict_rank = predict_rank
    update_time = time.time()
     
	
    save_event_info_results(event,topic_field,total_num,total_user_fans,\
                                total_comment,total_retweet,total_sensitive,\
                                total_sensitive_ratio,total_negtive,total_important_user,\
                                total_origin_type,origin_ratio,total_retweet_type,retweet_ratio,\
                                total_comment_type,comment_ratio,at_count,event_uid_count,\
                                event_trend_delta,predict_value,predict_rank,update_time)

    
     
