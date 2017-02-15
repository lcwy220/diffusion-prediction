# -*-coding:utf-8-*-

from diffusion_prediction.global_utils import es_prediction
from diffusion_prediction.global_config import minimal_time_interval

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

    results = es_prediction.search(index=task_name, doc_type="micro_task", body=query_body)["hits"]["hits"]
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


