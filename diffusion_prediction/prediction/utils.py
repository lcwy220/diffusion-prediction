# -*-coding:utf-8-*-
import sys
import json
from diffusion_prediction.global_utils import es_prediction
from diffusion_prediction.global_config import minimal_time_interval

reload(sys)
sys.path.append('../')
from diffusion_prediction.global_config import index_macro_feature_result,type_macro_feature_result


def get_predict_count(task_name, start_ts, end_ts):
    query_body = {
        "query":{
            "range":{
                "update_time":{
                    "gte": start_ts,
                    "lte": end_ts
                }
            }
        },
        "sort":{"update_time":{"order":"asc"}},
        "size":100000
    }

    index_name = 'micro_prediction_' + task_name

    results = es_prediction.search(index=index_name, doc_type="micro_task", body=query_body)["hits"]["hits"]
    return_list = []
    truth_value_list = []
    prediction_value_list = []
    ts_list = []
    for item in results:
        truth_value = item["_source"]["total_count"]
        truth_value_list.append(truth_value)
        try:
            prediction_value = item["_source"]["prediction_value"]
            prediction_value_list.append(prediction_value)
        except:
            pass
        ts = item["_source"]["update_time"]
        ts_list.append(ts)
    print len(truth_value_list), len(ts_list), len(prediction_value_list)


    prediction_value_list.insert(0,truth_value_list[0])
    for i in range(len(ts_list)):
        return_list.append([ts_list[i], truth_value_list[i], prediction_value_list[i]])

    # final
    return_list.append([ts_list[-1]+minimal_time_interval, 0, prediction_value_list[-1]])

    return json.dumps(return_list)


def get_macro_prediction_count(task_name):
    query_body = {
        'query':{
            'term':{'event':task_name}
        }
    }
    print 'task_name::::::',task_name
    es_results = es_prediction.search(index=index_macro_feature_result,doc_type=type_macro_feature_result,\
                body=query_body)['hits']['hits']
    weibo_count = 0
    user_count = 0
    rank = 0.0
    print 'es::::::::::::',es_results
    for es_result in es_results:
        weibo_count = es_result['_source']['predict_weibo_value']
        user_count = es_result['_source']['predict_user_value']
        rank = es_result['_source']['predict_rank']

    return weibo_count,user_count,rank


