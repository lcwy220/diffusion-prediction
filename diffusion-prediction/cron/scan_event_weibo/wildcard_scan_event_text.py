# -*-coding:utf-8-*-

import time
from elasticsearch import Elasticsearch
from elasticsearch.helpers import scan

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
def scan_event_text(event, query_body, start_ts, end_ts):
    index_name = event
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
                query_body
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
                detail["event"] = event
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
    event_list = [["中国"],["地球仪"]]
    aa = []
    for each in event_list:
        for iter in each:
            aa.append(iter.decode("utf-8"))
    event_name = "&".join(aa)
    print event_name.encode("utf-8")
    scan_event_text(event_name, event_list, "2017-01-04","2017-01-10")
