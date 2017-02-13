# -*-coding:utf-8-*-

import os 
import json
import time
from collections import Counter
#from elasticsearch import Elasticsearch
#from elasticsearch.helpers import scan 
#from config import es_flow_text,es_retweet,es_event
#import sys
#reload(sys)
#sys.path.append('topic_classify/config.py')

from topic_classify.config import load_scws,cx_dict,single_word_whitelist,black_word,abs_path,re_cut
from topic_classify.text_topic_classify import topic_classify
#from time_utils import ts2hour

#es_text = es_flow_text


def topic_field(es_results):
    
    #领域分类
    sw = load_scws() 
    uid_list = []
    uid_weibo_dic = dict()
    for item in es_results:
	if item['_source']['message_type'] != 1:
	    continue
	else:
	    uid = item['_source']['uid']
	    uid_weibo = item['_source']['text']
	    v = re_cut(uid_weibo)
	    words = sw.participle(v.encode('utf-8'))
            word_list = dict()
	    for word in words:
	        if (word[1] in cx_dict) and 3 < len(word[0]) < 30 and (word[0] not in black_word) and (word[0] not in single_word_whitelist):
		    if word_list.has_key(word[0]):
		        word_list[word[0]] = word_list[word[0]] + 1
		    else:
		        word_list[word[0]] = 1
	    uid_list.append(uid)
	    uid_weibo_dic[uid] = word_list
    
    uid_topic = {}	
    uid_topic = topic_classify(uid_list,uid_weibo_dic)

    #以键值出现频率最高的前2个来代表其所属领域。(键值长度大于一的，分开统计)
    field_list = []
    for key in uid_topic:
	for i in range(len(uid_topic[key])):
       	    field_list.append(uid_topic[key][i])
    c_field = Counter(field_list)
    field_dic = c_field.most_common(2)
    print 'type(field_dic)::',type(field_dic)
    print 'field_dic:::',field_dic 
    if field_dic:
    	if len(field_dic) > 1:
            field_multi = (field_dic[0][0],field_dic[1][0])
        else:
            field_multi = (field_dic[0][0],'null')
    else:
	field_multi = ('null','null')
    print 'field::',field_multi
	
    return field_multi
   

def save_manage_event_task_results(task_name,keywords,query_body,submit_time,\
				predict_time,predict_value,predict_rank,\
                                compute_status,create_by):
    print 'pinyin:',pinyin.get(task_name, format="strip", delimiter="_")
    pinyin_task_name = pinyin.get(task_name, format="strip", delimiter="_")

    mappings_manage_macro_task()

    index_name = 'manage_macro_task'
    id = pinyin_task_name
    index_type = "macro_task"
    item = {}
    #id_time = time.ctime()
    item['task_name'] = str(task_name)
    item['keywords'] = json.dumps(keywords)
    item['query_body'] = str(query_body)
    item['submit_time'] = long(submit_time)
    item['predict_time'] = long(predict_time)
    item['predict_value'] = long(predict_value)
    item['predict_rank'] = double(predict_rank)
    item['submit_time'] = long(submit_time)
    item['create_by'] = str(create_by)

    try:
        item_exist = es_event.get(index=index_name, doc_type=index_type,id=id)['_source']
        es_event.update(index=index_name, doc_type=index_type,id=id,body={'doc':item})
    except Exception, e:
        # raise e
        es_event.index(index=index_name, doc_type=index_type,id=id,body=item)
    print 'save task done!!!!'


def save_event_info_results(event,topic_field,total_num,total_user_fans,\
				total_comment,total_retweet,total_sensitive,\
                                total_sensitive_ratio,total_negtive,total_important_user,\
				total_origin_type,origin_ratio,total_retweet_type,retweet_ratio,\
				total_comment_type,comment_ratio,at_count,event_uid_count,\
				event_trend_delta,predict_value,predict_rank,update_time):
    print 'pinyin:',pinyin.get(event, format="strip", delimiter="_")
    pinyin_event = pinyin.get(event, format="strip", delimiter="_")

    mappings_event_info()

    index_name = 'macro_event_info'
    id = pinyin_event
    index_type = "event_info"
    item = {}
    #id_time = time.ctime()
    item['event'] = str(event)
    item['topic_field'] = str(topic_field)
    item['total_num'] = long(total_num)
    item['total_user_fans'] = long(total_user_fans)
    item['total_comment'] = long(total_comment)
    item['total_retweet'] = long(total_retweet)
    item['total_sensitive'] = long(total_sensitive)
    item['total_sensitive_ratio'] = double(total_sensitive_ratio)
    item['total_negtive'] = str(total_negtive)
    item['total_important_user'] = long(total_important_user)
    item['total_origin_type'] = long(total_origin_type)
    item['origin_ratio'] = double(origin_ratio)
    item['total_retweet_type'] = long(total_retweet_type)
    item['retweet_ratio'] = double(retweet_ratio)
    item['total_comment_type'] = long(total_comment_type)
    item['comment_ratio'] = double(comment_ratio)
    item['at_count'] = str(at_count)
    item['event_uid_count'] = long(event_uid_count)
    item['event_trend_delta'] = str(event_trend_delta)
    item['predict_value'] = long(predict_value)
    item['predict_rank'] = double(predict_rank)
    item['update_time'] = long(updatetime)

    try:
        item_exist = es_event.get(index=index_name, doc_type=index_type,id=id)['_source']
        es_event.update(index=index_name, doc_type=index_type,id=id,body={'doc':item})
    except Exception, e:
        # raise e
        es_event.index(index=index_name, doc_type=index_type,id=id,body=item)
    print 'save event_info done!!!!'
