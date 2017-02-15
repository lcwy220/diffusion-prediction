# -*-coding:utf-8-*-

import time
from elasticsearch import Elasticsearch
from elasticsearch.helpers import scan
from event_text_mappings import get_mappings

import sys
reload(sys)
sys.path.append("../../")
from global_utils import es_flow_text as es
from global_utils import es_prediction as new_es


def ts2datetime(ts):
    return time.strftime('%Y-%m-%d', time.localtime(ts))

def datetime2ts(date):
    return int(time.mktime(time.strptime(date, '%Y-%m-%d')))

def ts2date(ts):
    return time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(ts))


# 事件关键词列表，起始时间(2016-12-08)，终止时间(2016-12-10)，搜索类型
def scan_event_text(task_name, must_keywords, should_keywords,end_ts, start_ts):
    index_name = task_name
    get_mappings(task_name)
    must_words = must_keywords.split("&")
    should_words = should_keywords.split("&")
    must_list = []
    should_list = []
    if must_words:
        for item in must_words:
            must_list.append({"wildcard":{"text":"*"+item+"*"}})
    must_list.append({"range":{"timestamp":{"gte": start_ts, "lte": end_ts}}})

    if should_words:
        for item in should_words:
            should_list.append({"wildcard":{"text":"*"+item+"*"}})

    index_list = []
    end_time = ts2datetime(end_ts)
    while 1:
        start_date = ts2datetime(start_ts)
        index_list.append("flow_text_"+start_date)
        if start_date == end_time:
            break
        else:
            start_ts += 3600*24
    print index_list


    query_body = {
        "query":{
            "bool":{
                "must": must_list,
                "should": should_list
            }
        },
        "size":2000
    }

    for iter_index in index_list:
        print "begin index: ", iter_index
        es_scan = scan(es, query=query_body, index=iter_index, doc_type="text")
        bulk_action = []
        count = 0
        while 1:
            try:
                re_es = es_scan.next()
                detail = re_es["_source"]
                _id = detail["mid"]
                action = {'index': {"_id": _id}}
                bulk_action.extend([action, detail])
                count += 1
                if count % 1000 == 0:
                    new_es.bulk(bulk_action, index=index_name, doc_type="text", timeout=600)
                    bulk_action = []
            except StopIteration: 
                if bulk_action:
                    new_es.bulk(bulk_action, index=index_name, doc_type="text", timeout=600)
                print "finish index: ", iter_index, count
                break

    print "all done"


if __name__ == "__main__":
    scan_event_text(event_name, event_list, "2017-01-04","2017-01-10")
