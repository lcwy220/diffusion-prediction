# -*-coding:utf-8-*-

from mappings_event_analysis_task import mappings_event_analysis_task

import json
import time
import sys
reload(sys)
sys.path.append('../../')
from global_utils import es_prediction as es
from global_utils import r_event_analysis
from global_config import task_event_analysis,index_manage_event_analysis, type_manage_event_analysis

def create_task():
    #ts = time.time()
    #current_ts = datehour2ts(ts2datehour(ts))
    index_name = index_manage_event_analysis
    index_type = type_manage_event_analysis

    query_body = {
        "query": {
            "term":{"event_value_finish":"0"}
        },
        "size":10000
    }

    results = es.search(index=index_name,doc_type=index_type, body=query_body)["hits"]["hits"]

    #item_finish_status = {}


    for item in results:
        topic = item["_source"]["task_name"]
        en_name = item["_source"]["pinyin_task_name"]
        start_ts = item['_source']['start_time']
        end_ts = item['_source']['stop_time']
        
        print "push task_name: ", en_name

        r_event_analysis.lpush(task_event_analysis, json.dumps([topic,en_name, start_ts, end_ts]))

        #修改状态为已进入队列但尚未计算
        #item_finish_status['event_value_finish'] = 1
        
        #es.update(index=index_name,doc_type=index_type,id=en_name,body={'doc':item_finish_status})
    


def task_list():
    create_task()
    while 1:
        task_detail = r_event_analysis.rpop(task_event_analysis)
        if not task_detail:
            break

        task_detail = json.loads(task_detail)
        task_name = task_detail[0]
        start_ts = task_detail[1]
        end_ts = task_detail[2]

        mappings_event_analysis_results(task_name)

        while 1:
            es_result = es_prediction.get(index=index_name, doc_type=index_type, id=task_name)["_source"]
            if int(es_result["scan_text_processing"]) == 0:
                break
            else:
                time.sleep(60)

        #organize_feature(task_name, task_name, start_ts, end_ts)
        #dispose_data(task_name, end_ts)

def test():
    item = {}
    '''
    item['task_name'] = '天津老太摆射击摊被判刑' #'毛泽东诞辰纪念日'
    item['pinyin_task_name'] = 'tian_jin_lao_tai_she_ji_qiang_bei_pan_xing' #"mao_ze_dong_dan_chen_ji_nian_ri"
    item['start_time'] = 1482768502 #1482681600
    item['stop_time'] = 1483455435 #1483113600
    item['submit_user'] = 'admin@qq.com' 
    item['submit_time'] = time.time() 
    item['must_keywords'] = ['射击','判刑']
    item['should_keywords'] = ['天津','老太']
    item['event_value_finish'] = 0
    item['scan_text_finish'] = 0
    '''

    
    item['task_name'] = '毛泽东诞辰纪念日'
    item['pinyin_task_name'] = "mao_ze_dong_dan_chen_ji_nian_ri"
    item['start_time'] = 1482681600
    item['stop_time'] = 1483113600
    item['submit_user'] = 'admin@qq.com' 
    item['submit_time'] = time.time() 
    item['must_keywords'] = ['毛泽东']
    item['should_keywords'] = ['诞辰','纪念日']
    item['event_value_finish'] = 0
    item['scan_text_finish'] = 0
    


    mappings_event_analysis_task()

    es.index(index=index_manage_event_analysis,doc_type=type_manage_event_analysis,id=item['pinyin_task_name'],body=item)

    '''
    while 1:

        if start_ts > end_ts:
            break
        organize_feature(task_name, task_name,start_ts, start_ts+3600)
        dispose_data(task_name, start_ts+3600)
        start_ts += 3600
    '''


if __name__ == "__main__":
    #task_list()
    test()




