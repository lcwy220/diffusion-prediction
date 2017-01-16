# -*-coding:utf-8-*-

import json
from elasticsearch import Elasticsearch

es = Elasticsearch("10.128.55.69:9200", timeout=600)

result = es.get(index="manage_sensing_task", doc_type="task", id="admin@qq.com-热门事件")['_source']

social_sensors = json.loads(result["social_sensors"])


task_name = "knowledge_mapping"
user = "admin@qq.com"

task_detail = dict()
task_detail["task_name"] = task_name
task_detail["create_by"] = user
task_detail["stop_time"] = 1483113600
task_detail["remark"] = "感知热门事件"
task_detail["social_sensors"] = json.dumps(list(social_sensors))
task_detail["create_at"] = 1479883206
task_detail["finish"] = "0"
task_detail["warning_status"] = "0"
task_detail["history_status"] = json.dumps([])
task_detail['processing_status'] = "1"
task_detail['burst_reason'] = ''
"""
#print task_detail
result = es.get(index="manage_sensing_task", doc_type="task",id="admin@qq.com-layer")["_source"]
#result["finish"] = "0"
result['processing_status'] = "0"
#result["stop_time"] = 1473782400
#print result["history_status"]
"""
print es.index(index="manage_sensing_task", doc_type="task",id="admin@qq.com-knowledge_mapping", body=task_detail)





