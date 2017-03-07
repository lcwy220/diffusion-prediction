# -*-coding:utf-8*-

import time
import json
import pickle
import pinyin
import sys
reload(sys)
sys.path.append("../../")

from global_utils import es_flow_text,es_prediction,r_micro
from global_config import index_manage_prediction_task, type_manage_prediction_task,\
                            index_macro_feature_result,type_macro_feature_result
from utils import save_event_info_results
from feature_compute import feature_compute

def rank_predict(event,start_ts,end_ts):

    feature_list = feature_compute(event,start_ts,end_ts)
    print 'feature_list:::::',feature_list
    feature_list_gbdt = []
    for i in range(len(feature_list)):
        #把多个分开（extend
        
        if i == 15:
            feature_list[i] = json.loads(json.dumps(feature_list[i]))
            print 'type::',type(feature_list[i])
            print 'feature_list[i][at_0]::',feature_list[i]['at_0']

            feature_list_gbdt.append(feature_list[i]['at_0'])
            feature_list_gbdt.append(feature_list[i]['at_1'])
            feature_list_gbdt.append(feature_list[i]['at_2'])
            feature_list_gbdt.append(feature_list[i]['at>3'])
        elif i == 16:
            feature_list[i] = json.loads(json.dumps(feature_list[i]))
            
            print 'feature_list[i]:::',feature_list[i]
            feature_list_gbdt.append(feature_list[i][0])
            feature_list_gbdt.append(feature_list[i][1])
            feature_list_gbdt.append(feature_list[i][2])
            feature_list_gbdt.append(feature_list[i][3])
        else:
            feature_list_gbdt.append(feature_list[i])

    print 'feature_list_gbdt:::::',feature_list_gbdt

    #加载微博模型
    with open("0305_macro-prediction-weibos-value.pkl" ,"rb") as f:
        gbdt = pickle.load(f)
    
    pred = gbdt.predict(feature_list_gbdt)
    
    for item in pred:
        predict_weibo_value = item
    
    #加载用户模型
    with open("0305_macro-prediction-uids-value.pkl" ,"rb") as f:
        gbdt = pickle.load(f)
    
    pred = gbdt.predict(feature_list_gbdt)
    
    for item in pred:
        predict_user_value = item

    predict_rank = get_rank(predict_user_value)
    
    ## 存入事件信息表
    #for i in range(len(feature_list)):
    feature_results = {}
    feature_results['event'] = event
    '''
    feature_results['topic_field'] = feature_list[0]
    feature_results['total_num'] = feature_list[1]
    feature_results['total_user_fans'] = feature_list[2]
    feature_results['total_comment'] = feature_list[3]
    feature_results['total_retweet'] = feature_list[4]
    feature_results['total_sensitive'] = feature_list[5]
    feature_results['total_sensitive_ratio'] = feature_list[6]
    feature_results['total_negtive'] = feature_list[7]
    feature_results['total_important_user'] = feature_list[8]   
    feature_results['total_origin_type'] = feature_list[9]
    feature_results['origin_ratio'] = feature_list[10]
    feature_results['total_retweet_type'] = feature_list[11]
    feature_results['retweet_ratio'] = feature_list[12]
    feature_results['total_comment_type'] = feature_list[13]
    feature_results['comment_ratio'] = feature_list[14]
    feature_results['at_count'] = feature_list[15]
    feature_results['event_uid_count'] = feature_list[16]
    feature_results['event_trend_delta'] = feature_list[17]
    feature_results['predict_weibo_value'] = predict_weibo_value
    feature_results['predict_user_value'] = predict_user_value
    feature_results['predict_rank'] = predict_rank
    feature_results['update_time'] = time.time()
    '''
    #feature_results['topic_field'] = feature_list[0]
    feature_results['uid_count'] = feature_list[0]
    feature_results['total_num'] = feature_list[1]
    feature_results['total_user_fans'] = feature_list[2]
    feature_results['total_comment'] = feature_list[3]
    feature_results['total_retweet'] = feature_list[4]
    feature_results['total_sensitive'] = feature_list[5]
    feature_results['total_sensitive_ratio'] = feature_list[6]
    feature_results['total_negtive'] = feature_list[7]
    feature_results['total_important_user'] = feature_list[8]   
    feature_results['total_origin_type'] = feature_list[9]
    feature_results['origin_ratio'] = feature_list[10]
    feature_results['total_retweet_type'] = feature_list[11]
    feature_results['retweet_ratio'] = feature_list[12]
    feature_results['total_comment_type'] = feature_list[13]
    feature_results['comment_ratio'] = feature_list[14]
    feature_results['at_count'] = json.dumps(feature_list[15])
    
    feature_results['event_trend_delta'] = json.dumps(feature_list[16])
    feature_results['predict_weibo_value'] = predict_weibo_value
    feature_results['predict_user_value'] = predict_user_value
    feature_results['predict_rank'] = predict_rank
    feature_results['update_time'] = time.time()


    '''
    save_event_info_results(event,topic_field,total_num,total_user_fans,\
                                total_comment,total_retweet,total_sensitive,\
                                total_sensitive_ratio,total_negtive,total_important_user,\
                                total_origin_type,origin_ratio,total_retweet_type,retweet_ratio,\
                                total_comment_type,comment_ratio,at_count,event_uid_count,\
                                event_trend_delta,predict_value,predict_rank,update_time)
    '''
    #update macro features & results

    feature_results = json.dumps(feature_results)
    try:
        item_exists = es_prediction.get(index=index_macro_feature_result,doc_type= type_macro_feature_result,\
                                        id=event)['_source']
        es_prediction.update(index=index_macro_feature_result,doc_type=type_macro_feature_result,\
                            id=event,body={'doc':feature_results})
    except:
        es_prediction.index(index=index_macro_feature_result,doc_type=type_macro_feature_result,\
                                id=event,body=feature_results)

    # update task info —— "macro_value_finish"
    task_detail = es_prediction.get(index=index_manage_prediction_task, \
            doc_type=type_manage_prediction_task, id=event)["_source"]
    task_detail["macro_value_finish"] = '1'
    es_prediction.index(index=index_manage_prediction_task, \
            doc_type=type_manage_prediction_task, id=event, body=task_detail)
    print 'feature_results::::',feature_results


def get_rank(predict_user_value):
    predict_user_value = int(predict_user_value)

    if predict_user_value < 5000:
        rank = 5.0
    elif predict_user_value >=5000 and predict_user_value < 10000:
        rank = 5.5
    elif predict_user_value >=10000 and predict_user_value < 20000:
        rank = 6.0
    elif predict_user_value >=20000 and predict_user_value < 50000:
        rank = 6.5
    elif predict_user_value >=50000 and predict_user_value < 100000:
        rank = 7.0
    elif predict_user_value >=100000 and predict_user_value < 200000:
        rank = 7.5
    elif predict_user_value >=200000 and predict_user_value < 500000:
        rank = 8.0
    elif predict_user_value >= 500000 and predict_user_value < 1000000:
        rank = 8.5 
    elif predict_user_value >=1000000 and predict_user_value < 2000000:
        rank = 9.0
    elif predict_user_value >=2000000 and predict_user_value < 4000000:
        rank = 9.5
    elif predict_user_value >=4000000:
        rank = 10.0

    return rank
    
     
if __name__ == '__main__':

    event = 'mao_ze_dong_dan_chen_ji_nian_ri'
    start_ts = 1482681600
    end_ts = 1482717610
    print 'start!'
    t1 = time.time()
    rank_predict(event,start_ts,end_ts)
    print time.time()-t1
    print 'done!!'