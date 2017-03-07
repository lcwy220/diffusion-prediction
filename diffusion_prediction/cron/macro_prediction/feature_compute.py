# -*-coding:utf-8-*-

import json
import re
import sys
from collections import defaultdict
from elasticsearch import Elasticsearch
from elasticsearch.helpers import scan
from utils import topic_field
reload(sys)
sys.path.append('../../')
from global_utils import es_prediction as es


def feature_compute(task_name,start_ts,end_ts):

    query_body = {
        "query":{
            "bool":{
                "must":[
                    {"range":{
                        "timestamp":{
                            "gte":start_ts,
                            "lt":end_ts
                            }
                        }
                    }
                ]
            }
        },
        "size":99999999,
        "sort":{"user_fansnum":"desc"}
    }


    es_results = es.search(index=task_name,doc_type='text',body=query_body)["hits"]["hits"] 

    #前几小时微博数量趋势统计
    #event_trend[event].append(len(es_results))
     
    #话题领域
    #print 'len(es_re)',len(es_results)
    #field_multi = topic_field(es_results)    

    #参与用户粉丝总数\转发总数\评论总数及平均数统计
    total_user_fans = 0
    average_user_fans = 0
 
    total_comment = 0
    average_comment = 0

    total_retweet = 0
    average_retweet = 0

    #敏感微博数量及比例统计
    total_sensitive = 0
    total_sensitive_ratio = 0
 
    #负向情绪微博数量及比例统计
    total_negtive = 0
    total_negtive_ratio = 0

    #重要用户数量及比例统计（粉丝数>100000）
    total_important_user = 0
    total_important_user_ratio = 0
    
    #微博总数
    total_num = len(es_results)

    #@层级数统计
    #at_count = defaultdict(int)
    at_count = {}
    at_count['at_0'] = 0
    at_count['at_1'] = 0
    at_count['at_2'] = 0
    at_count['at>3'] = 0


    for result in es_results:
        
        total_user_fans += result['_source']['user_fansnum']
        total_comment += result['_source']['comment']
        total_retweet += result['_source']['retweeted']

        if result['_source']['sensitive'] > 0:
            total_sensitive += 1
        if result['_source']['sentiment'] > 1:
            total_negtive += 1
        if result['_source']['user_fansnum'] > 10000:
            total_important_user += 1
        
        text = result['_source']['text']
        at_list = re.findall('//@',text)
        #print 'at_list:::',at_list
        if len(at_list) == 0:
            at_count['at_0'] += 1
        elif len(at_list) == 1:
            at_count['at_1'] += 1
        elif len(at_list) == 2:
            at_count['at_2'] += 1
        else:
            at_count['at>3'] += 1
    
    #print 'at+count::',at_count        
    average_user_fans = float(total_user_fans)/total_num
    average_comment = float(total_comment)/total_num
    average_retweet = float(total_retweet)/total_num
    
    total_sensitive_ratio = float(total_sensitive)/total_num
    total_negtive_ratio = float(total_negtive)/total_num
    total_important_use_ratio = float(total_important_user)/total_num

 
    query_body_type_count = {
        'query':{
            'bool':{
                'must':[
                    {'range':{
                        'timestamp':{
                            'gte':start_ts,
                            'lt':end_ts
                        }
                    }}

                ]
            }
        },

        'size':999999999,
        'aggs':{
            'all_weibo':{
            'terms':{'field':'message_type'}
        }
    }
    }

    #统计各类型微博数量
    
    es_weibo_type_count = es.search(index=task_name,doc_type='text',body=query_body_type_count,request_timeout=999999)['aggregations']['all_weibo']['buckets']

    total_origin_type = 0
    total_retweet_type = 0
    total_comment_type = 0
    total_type = 0
    #print 'es_weibo_type_count:::',es_weibo_type_count
    weibo_type_count = dict()
    for item in es_weibo_type_count:
        if item['key'] == 1:
            total_origin_type = item['doc_count']
        elif item['key'] == 2:
            total_retweet_type = item['doc_count']
        elif item['key'] == 3:
            total_comment_type = item['doc_count']

    total_type = total_origin_type + total_retweet_type + total_comment_type

    origin_ratio = float(total_origin_type)/total_type
    retweet_ratio = float(total_retweet_type)/total_type
    comment_ratio = float(total_comment_type)/total_type
    
    uids_count = get_event_uid_count(task_name,start_ts,end_ts)
    
    event_trend_delta_list = get_event_trend(task_name,start_ts,end_ts)

    feature_list = [uids_count,total_num,total_user_fans,total_comment,total_retweet,\
                    total_sensitive,total_sensitive_ratio,total_negtive,total_important_user,total_origin_type,\
                    origin_ratio,total_retweet_type,retweet_ratio,total_comment_type,comment_ratio,\
                    at_count,event_trend_delta_list]

    return feature_list

    
def get_event_uid_count(task_name,start_ts,end_ts):

    event_uid_set = set()
    query_body = {
        'query':{
            'filtered':{
                'filter':{
                    'range':{
                        'timestamp':{'gte': start_ts, 'lt':end_ts}
                    }
                }
            }
        },
        'size':99999999
    }

    es_results = es.search(index=task_name,doc_type='text',body=query_body)['hits']['hits']
    for result in es_results:
        #print 'result:::',result
        event_uid_set.add(result['_source']['uid'])
        try:
            event_uid_set.add(result['_source']['root_uid'])
        except:
            continue
        try:
            event_uid_set.add(result['_source']['directed_uid'])
        except:
            continue

    uids_count = len(event_uid_set)
    
    return uids_count


def get_event_trend(task_name,start_ts,end_ts):

    #trend_end_ts = end_ts
    '''
    if end_ts - start_ts < 10800:
        if end_ts - start_ts < 7200:
            trend_start_ts = 

    else:
        trend_start_ts = trend_end_ts - 10800
    '''
    '''
    trend_middle_ts = trend_start_ts + 36000


    #事件趋势统计
    #event_trend = defaultdict(list)
    event_trend_delta_list = []
    #trend_input_list = []

    if trend_end_ts != trend_start_ts:

        trend_middle_ts = trend_start_ts + 3600

        query_body = {
            "query":{
                "bool":{
                    "must":[
                        {"range":{
                            "timestamp":{
                                "gte":trend_start_ts,
                                "lt":trend_middle_ts
                                }
                            }
                        }
                    ]
                }
            },
            "size":99999999
        }

        es_result = es.count(index=task_name,doc_type='text',body=query_body)
        weibo_count = es_result['count']

        
    '''

    event_trend = []
    trend_input_list = []
    event_trend_delta = []
    i = 0 
    while i<10: 
        end_ts = start_ts + 2*3600
        trend_input_list.append((task_name,start_ts,end_ts))
        start_ts = end_ts + 1
        i = i + 2
    #print 'input_list::::',input_list
    for item in trend_input_list:
        trend_event = item[0]
        trend_start_ts = item[1]
        trend_end_ts = item[2]
        
        query_body = {
            "query":{
                "bool":{
                "must":[

                    {"range":{
                    "timestamp":{
                        "gte":trend_start_ts,
                        "lt":trend_end_ts
                        }
                    }
                    }
                ]
                }
            },
            "size":99999999,
            "sort":{"user_fansnum":"desc"}
        }
        
        es_results = es.search(index=task_name,doc_type='text',body=query_body)["hits"]["hits"] 

        #前几小时微博数量趋势统计
        event_trend.append(len(es_results))

    for i in range(len(event_trend)-1):
        #print 'event_trend[event][i+1]::',event_trend[event][i+1]
        #print 'event_trend[event][i]::',event_trend[event]
        delta = event_trend[i+1]-event_trend[i]
        print 'delta::::',delta
        event_trend_delta.append(delta)

            #fo_trend.write(str(delta)+'\t')
            #fo_trend.write('\n')   
    print 'event_trend_delta:::',event_trend_delta 
    return event_trend_delta



#def feature_compute(task_name,start_ts,end_ts):
 
    #es_text = es_flow_text
    #index_name = "event-1228"
    #index_name = "event-0103"
    #index_type = "text"

    
    #feature_dic = defaultdict(list)
    #fo_features = open('features.txt','wb')
    #fo_weibos_truth = open('weibos_truth.txt','wb')
    #fo_uids_truth = open('weibos_truth.txt','wb')

    #feature_extract(event,event_count,start_ts,end_ts,event_trend_delta[event],event_uid_count[event])
    #feature_extract(task_name,start_ts,end_ts)
    
    #fo_features.close()
    #fo_weibos_truth.close()
    #fo_uids_truth.close()
    #fo_trend.close()


if __name__ == '__main__':

    feature_compute(task_name,start_ts,end_ts)
