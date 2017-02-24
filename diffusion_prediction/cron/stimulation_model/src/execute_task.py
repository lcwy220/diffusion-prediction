# -*-coding:utf-8-*-

import subprocess
import json
from extend_network import extend_network

import sys
reload(sys)
sys.path.append("../../../")

from global_utils import es_prediction, r_stimulation
from global_config import task_stimulation, index_manage_interfere_task, type_manage_interfere_task

def work():
    task_work = r_stimulation.rpop(task_stimulation)
    if task_work:
        task_detail = json.loads(task_work)
    else:
        return None

    task_name = task_detail[0]
    network_exist = task_detail[1]
    threshold = float(task_detail[2])
    if int(network_exist) == 1:
        print " already exists network"
    else:
        # extend network: the first time
        extend_network(task_name)
        es_results = es_prediction.get(index=index_manage_interfere_task, doc_type=type_manage_interfere_task,\
            id=task_name)["_source"]
        count = int(es_results["stimulation_finish"])+1
        es_prediction.update(index=index_manage_interfere_task, doc_type=type_manage_interfere_task,\
            id=task_name, body={"doc":{"stimulation_finish":str(count)}})


    file_graph = task_name+".txt"
    file_user = "user_"+task_name+".txt"
    file_stimulation = "stimulation_"+task_name+".txt"

    cmd_compile = "javac AgentModel.java"
    #cmd_execute = "java AgentModel.java %s %s %s" %(file_graph, file_user, file_stimulation)
    cmd_execute = "java AgentModel.java %s %s" %(file_graph, file_stimulation)

    c1 = subprocess.Popen(cmd_compile, shell=True, stdout=subprocess.PIPE)
    c2 = subprocess.Popen(cmd_execute, shell=True, stdout=subprocess.PIPE)

    # evalute 
    origin, stimulation = evalute(task_name)
    finish = "0"
    if origin:
        shrink_percentage = (origin-stimulation)/float(origin)
        if shrink_percentage >= threshold:
            finish = "1"
    es_prediction.update(index=index_manage_interfere_task, doc_type=type_manage_interfere_task,\
            id=task_name, body={"doc":{"stimulation_results": json.dumps([origin, stimulation,shrink_percentage]),\
            "finish": finish,"stimulation_processing_status":"0" }}


    print "finish"


def evalute(task_name):
    file_user = "user_"+task_name+".txt"
    file_stimulation = "stimulation_"+task_name+".txt"

    origin_set = set()
    stimulation_set = set()

    with open(file_user, "r") as f:
        for line in f:
            user = line.strip()
            if user:
                origin_set.add(user)

    with open(file_stimulation, "r") as f:
        for line in f:
            user = line.strip()
            if user:
                stimulation_set.add(user)

    return len(origin_set), len(stimulation_set)

