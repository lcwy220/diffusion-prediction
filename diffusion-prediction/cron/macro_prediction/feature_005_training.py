# -*-coding:utf-8-*-

import json
import re
from collections import defaultdict
from elasticsearch import Elasticsearch
from elasticsearch.helpers import scan
from config import es_flow_text,es_retweet,es_event
from utils import topic_field


def feature_extract(event,event_count,start_ts,end_ts,event_trend_delta_list,event_uid_count_event):

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
                    },

                    {"term":{"event":event}}
                ]
            }
        },
        "size":99999999,
        "sort":{"user_fansnum":"desc"}
    }


    es_results = es_event.search(index=index_name,doc_type=index_type,body=query_body)["hits"]["hits"] 

    #前几小时微博数量趋势统计
    #event_trend[event].append(len(es_results))
     
    #话题领域
    print 'len(es_re)',len(es_results)
    field_multi = topic_field(es_results)    
    print 'field_multi done!!!'
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
    at_count = defaultdict(int)

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
                    {'term':{'event':event}},
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
    
    es_weibo_type_count = es_event.search(index=index_name,doc_type=index_type,body=query_body_type_count,request_timeout=999999)['aggregations']['all_weibo']['buckets']

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
    
    print 'start write!'
    fo_feature.write(field_multi[0]+'\t'+str(total_num)+'\t'+str(total_user_fans)+'\t'+str(total_comment)+'\t'+str(total_retweet)+'\t'+str(total_sensitive)+'\t'+str(total_sensitive_ratio)+'\t'+str(total_negtive)+'\t'+str(total_important_user)+'\t'+str(total_origin_type)+'\t'+str(origin_ratio)+'\t'+str(total_retweet_type)+'\t'+str(retweet_ratio)+'\t'+str(total_comment_type)+'\t'+str(comment_ratio)+'\t'+str(at_count['at_0'])+'\t'+str(at_count['at_1'])+'\t'+str(at_count['at_2'])+'\t'+str(at_count['at>3'])+'\t'+str(event_uid_count_event)+'\t'+str(event_trend_delta_list[0])+'\t'+str(event_trend_delta_list[1])+'\t'+str(event_trend_delta_list[2])+'\t'+str(event_trend_delta_list[3])+'\n')

    fo_truth.write(str(event_count)+'\n')

    

    feature_dic[event].append((field_multi[0],total_num,total_user_fans,total_comment,total_retweet,total_sensitive,total_sensitive_ratio,total_negtive,total_important_user,total_origin_type,origin_ratio,total_retweet_type,retweet_ratio,total_comment_type,comment_ratio,at_count['at_0'],at_count['at_1'],at_count['at_2'],at_count['at_3'],event_uid_count_event,event_trend_delta_list))

    return feature_dic

    
def get_event_uid_count(event_list):

    event_uid_count={}

    for event in event_list:
	event_uid_set = set()
        query_body = {
	    'query':{
		'bool':{

		    'must':[
			{'term':{'event':event}}
		    ]
		}
	    }	
        }

	#es_results = es_event.search(index=index_name,doc_type=index_type,body=query_body)['hits']['hits']
	es_results_scan = scan(es_event,query=query_body,size=30,index=index_name,doc_type=index_type)
	#print 'scan::::::',
 	while 1:
	    try:
	        scan_data = es_results_scan.next()
	        event_uid_set.add(scan_data['_source']['uid'])
	        try:
     	            event_uid_set.add(scan_data['_source']['root_uid'])
	        except:
		    continue
	        try:
	            event_uid_set.add(scan_data['_source']['directed_uid'])
	        except:
		    continue
		#print 'scan_data::::::',scan_data
	    except StopIteration:
		event_uid_count[event] = len(event_uid_set)
		break
	'''
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
	event_uid_count[event] = len(event_uid_set)
        '''
    #print 'event_uid_count:::',event_uid_count
    return event_uid_count


def get_event_trend(input_list):
    
    #事件趋势统计
    event_trend = defaultdict(list)
    event_trend_delta = defaultdict(list)
    trend_input_list = []

    for item in input_list:
        event = item[0]
	start_ts = item[1]
        i = 0 
        while i<10: 
	    end_ts = start_ts + 2*3600
	    trend_input_list.append((event,start_ts,end_ts))
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
			    },

			    {"term":{"event":trend_event}}
			]
		    }
		},
		"size":99999999,
		"sort":{"user_fansnum":"desc"}
	}


	es_results = es_event.search(index=index_name,doc_type=index_type,body=query_body)["hits"]["hits"] 

	#前几小时微博数量趋势统计
	event_trend[trend_event].append(len(es_results))

    for key in event_trend:
	for i in range(len(event_trend[key])-1):
	    #print 'event_trend[event][i+1]::',event_trend[event][i+1]
            #print 'event_trend[event][i]::',event_trend[event]
            delta = event_trend[key][i+1]-event_trend[key][i]
	    #print 'delta::::',delta
	    event_trend_delta[key].append(delta)

	    #fo_trend.write(str(delta)+'\t')
        #fo_trend.write('\n')   
    #print 'event_trend_delta:::',event_trend_delta 
    return event_trend_delta


def get_event_list():
    
    query_body = {
	'query':{
	    'match_all':{}
	},
	'aggs':{
	    'all_events':{
		'terms':{'field':'event', "size":1000}
	    }
	}

    }
    
    es_event_results = es_event.search(index=index_name,doc_type=index_type,body=query_body,request_timeout=99999999)['aggregations']['all_events']['buckets']
    event_list = []
    event_count = {}
    for event_item in es_event_results:
	event_list.append(event_item['key'])
	event_count[event_item['key']] = event_item['doc_count']
   
    '''
    for k,v in event_count.iteritems():
	print k.encode('utf-8')+'\t'+str(v)
    '''
    
    input_list=[]
    for event in event_list:

        query_body_start_ts = {
       	    'query':{
	        'bool':{
		    'must':[
			{'term':{'event':event}}
		    ]
		}
	    },
	    'sort':{'timestamp':'asc'},
	    'size':10
        } 
        
        es_start_ts_results = es_event.search(index=index_name,doc_type=index_type,body=query_body_start_ts)['hits']['hits']

	#获得主函数输入 input_list （event,start_ts,end_ts）
	start_ts =  es_start_ts_results[0]['_source']['timestamp']
        end_ts = start_ts + 36000
                
	input_list.append((event,start_ts,end_ts,event_count[event]))
    print 'input_list done!'
    return input_list,event_list



#def feature_compute():
 
if __name__ == '__main__':
    #es_text = es_flow_text
    #index_name = "event-1228"
    index_name = "event-0116"
    #index_name = "event-0103"
    index_type = "text"
    
    #event = '南京大屠杀'
    #start_ts = 1481472017
    #end_ts = 1481472017+3600
    print 'start!'    
    feature_dic = defaultdict(list)
    fo_feature = open('0119_005_feature_delete2_0116.txt','wb')
    fo_truth = open('0119_005_truth_delete2_0116.txt','wb')
    #fo_trend = open('005_trend_0103.txt','wb')
    
    input_list,event_list = get_event_list()
    event_trend_delta = get_event_trend(input_list)
    event_uid_count = get_event_uid_count(event_list)

           
    for item in input_list:

        event = item[0]
	start_ts = item[1]
	end_ts = item[2]
	event_count = item[3]

        feature_extract(event,event_count,start_ts,end_ts,event_trend_delta[event],event_uid_count[event])
    
   
    fo_feature.close()
    fo_truth.close()
    #fo_trend.close()

'''
if __name__ == '__main__':

    feature_compute()
'''

