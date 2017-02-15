# -*-coding:utf-8-*-

from elasticsearch import Elasticsearch
from elasticsearch.helpers import scan

import sys
reload(sys)
sys.path.append("../../")

from global_utils import es_prediction, es_flow_text
from time_utils import ts2datetime, datetime2ts, ts2date

new_es = es_prediction
es = es_flow_text

def search_weibo(task_name):
    query_body = {
        "query": {
            "match_all":{}
        },
        "aggs":{
            "all_events":{
                "terms":{"field":"event", "size":1000}
             }
        }
    }

    value_list = []
    results = new_es.search(index="event-0118", doc_type="text", body=query_body)["aggregations"]["all_events"]["buckets"]
    event_list = []
    for item in results:
        event_list.append(item["key"])


# search weibo from start_ts to end_ts

def scan_weibo(event, start_ts, end_ts):
    mid_list = search_origin_weibo(event)
    index_list = []
    end_date = ts2datetime(end_ts)
    while 1:
        date = ts2datetime(start_ts) 
        iter_index = "flow_text_" + date
        index_list.append(iter_index)
        if date == end_date:
            break
        else:
            start_ts += 3600*24
    print "index_list, ", index_list

    for iter_index in index_list:
        mid_len = len(mid_list)
        print mid_len
        len_1000 = mid_len/1000
        for i in range(len_1000+1):
            print "loop: ", i, len_1000
            tmp_mid_list = mid_list[i*1000: (i+1)*1000]
            query_body = {
                "query":{
                    "bool":{
                        "must":[
                            {"terms":{"root_mid": tmp_mid_list}},
                            {"range":{
                                "timestamp":{
                                    "gte":start_ts,
                                    "lte":end_ts
                                }
                            }}
                        ]
                    }
                }
            }
            es_scan = scan(es, query=query_body, index=iter_index, doc_type="text", size=2000)
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
                        new_es.bulk(bulk_action, index=event, doc_type="text", timeout=600)
                        bulk_action = []
                        print count
                except StopIteration:
                    if bulk_action:
                        new_es.bulk(bulk_action, index=event, doc_type="text", timeout=600)
                    break




def search_origin_weibo(event):
    es_scan = scan(new_es, query={"query":{"bool":{"must":[{"term":{"message_type":"1"}}]}}}, size=3000, index=event, doc_type="text")  

    mid_list = []
    count = 0
    while 1:
        try:
            scan_data = es_scan.next()
            mid_list.append(scan_data["_id"]) 
            count += 1
            if count % 2000 == 0:
                print "origin mid list: ", count
        except StopIteration:
            break

    return mid_list



if __name__ == "__main__":
    search_weibo()

