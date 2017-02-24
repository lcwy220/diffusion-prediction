# -*-coding:utf-8-*-

import os
import subprocess
import json
import sys
reload(sys)
sys.path.append('../../../')

from global_utils import es_prediction,es_retweet
from global_config import index_be_retweet, index_type_be_retweet,index_manage_interfere_task, type_manage_interfere_task

from organize_network import organize_network

def extend_network(task_name):
    file_name = task_name+".txt"
    f = open(task_name+".txt", "w")
    line = 0
    user2number_dict = dict() # mapping: number-uid
    number2user_dict = dict()
    count = 0 
    user_list = organize_network(task_name)
    list_len = len(user_list)
    len_1000 = list_len/1000
    for i in range(len_1000+1):
        tmp_uid = user_list[i*1000: (i+1)*1000]
        es_results = es_retweet.mget(index=index_be_retweet,doc_type=index_type_be_retweet, body={"ids":tmp_uid})["docs"]
        for item in es_results:
            if item["found"]:
                print count
                uid_be_retweet = json.loads(item["_source"]["uid_be_retweet"])
                be_retweet_list = uid_be_retweet.keys()
                uid = item["_id"]
                if user2number_dict.has_key(uid):
                    uid_count = user2number_dict[uid]
                else:
                    count += 1
                    uid_count = count
                    user2number_dict[uid] = count
                    number2user_dict[count] = uid
                for each in be_retweet_list:
                    if user2number_dict.has_key(each):
                        each_number = user2number_dict[each]
                    else:
                        count += 1
                        user2number_dict[each] = count
                        number2user_dict[count] = uid
                        each_number = count
                    if each_number != uid_count:
                        f.write(str(uid_count) + " " + str(each_number)+"\n")
                        line += 1


    f.close()
    cmd = 'sed -i "" -e "1i %s %s" %s' %(count, line, file_name)
    p = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE)

    es_prediction.update(index=index_manage_interfere_task, doc_type=type_manage_interfere_task,\
            id=task_name, body={"doc":{"network_exist": "1"}})
    print "finish: ", count


    file_user = open("user_"+task_name+".txt", "w")
    for uid in user2number_dict.keys():
        file_user.write(str(uid)+'\n')

if __name__ == "__main__":
    extend_network("mao_ze_dong_dan_chen_ji_nian_ri")
