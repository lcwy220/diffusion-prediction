# -*- coding:utf-8 -*-

import sys
import time
import json

reload(sys)
sys.path.append('../')
#from parameter import DAY, HOUR, RUN_TYPE
from global_config import R_BEGIN_TIME
from global_utils import key_es
#from time_utils import ts2datetime, datetime2ts
import pinyin
from key_mappings import key_nodes_es_mappings,key_mblogs_es_mappings,\
                         key_edges_es_mappings,info_max_es_mappings


#begin_ts = datetime2ts(R_BEGIN_TIME)

def get_es_num(timestamp):
    date = ts2datetime(timestamp)
    date_ts = datetime2ts(date)
    num = int((timestamp - date_ts) / (3 * HOUR))
    return num

def save_key_nodes_results(hash_tag,fans_rank,negtive_rank,pagerank_rank,sensitive_rank):
    print 'pinyin'
    print 'pinyin:',pinyin.get(hash_tag, format="strip", delimiter="_")    
    pinyin_hash_tag = pinyin.get(hash_tag, format="strip", delimiter="_")
    
    key_nodes_es_mappings()

    index_name = 'key_nodes_results'
    id = pinyin_hash_tag
    index_type = "node"
    item = {}
    #id_time = time.ctime()
    item['hash_tag'] = hash_tag
    item['fans_rank'] = json.dumps(fans_rank)
    item['negtive_rank'] = str(negtive_rank)
    item['pagerank_rank'] = json.dumps(pagerank_rank)
    item['sensitive_rank'] = json.dumps(sensitive_rank)
    try:
        item_exist = key_es.get(index=index_name, doc_type=index_type,id=id)['_source']
        key_es.update(index=index_name, doc_type=index_type,id=id,body={'doc':item})
    except Exception, e:
        # raise e
        key_es.index(index=index_name, doc_type=index_type,id=id,body=item)
    print 'save nodes done!!!!'

def save_key_mblogs_results(hash_tag,retweet_rank,negtive_rank):
    
    pinyin_hash_tag = pinyin.get(hash_tag, format="strip", delimiter="_")
    
    key_mblogs_es_mappings()

    index_name = 'key_mblogs_' + pinyin_hash_tag
    index_type = "mblog"

    item = {}

    item['hash_tag'] = hash_tag
    item['retweet_rank'] = retweet_rank
    item['negtive_rank'] = negtive_rank
   
    try:
        item_exist = key_es.get(index=index_name, doc_type=index_type)
        key_es.update(index=index_name, doc_type=index_type,body={'doc':item})
    except Exception, e:
        # raise e
        key_es.index(index=index_name, doc_type=index_type,body=item)


def save_key_edges_results(hash_tag,retweet_rank,negtive_rank):
    
    pinyin_hash_tag = pinyin.get(hash_tag, format="strip", delimiter="_")
    
    key_edges_es_mappings()

    index_name = 'key_edges_results' 
    id = pinyin_hash_tag
    index_type = "edge"

    item = {}

    item['hash_tag'] = hash_tag
    item['retweet_rank'] = retweet_rank
    item['negtive_rank'] = negtive_rank
   
    try:
        item_exist = key_es.get(index=index_name, doc_type=index_type)
        key_es.update(index=index_name, doc_type=index_type,body={'doc':item})
    except Exception, e:
        # raise e
        key_es.index(index=index_name, doc_type=index_type,id=id,body=item)


def save_info_max_results(hash_tag,info_max):
    
    pinyin_hash_tag = pinyin.get(hash_tag, format="strip", delimiter="_")
    
    info_max_es_mappings()

    index_name = 'info_max_' + pinyin
    index_type = "info_max"

    item = {}

    item['hash_tag'] = hash_tag
    item['info_max'] = info_max
   
    try:
        item_exist = key_es.get(index=index_name, doc_type=index_type)
        key_es.update(index=index_name, doc_type=index_type,body={'doc':item})
    except Exception, e:
        # raise e
        key_es.index(index=index_name, doc_type=index_type,body=item)


def save_dg_pr_results(sorted_uids, es_num, flag):
    index_name = "user_portrait_network"
    index_type = "network"
    bulk_action = []
    count = 0
    for uid, rank in sorted_uids:
        if (uid == 'global'):
            continue
        count += 1
        user_results = {}
        user_results['uid'] = uid
        user_results[flag+'_'+str(es_num)] = rank
        user_results['rank_'+flag+'_'+str(es_num)] = count #rank
        if es_num == 0:
            action = {'index':{'_id':uid}}
            bulk_action.extend([action,user_results])
        else:
            try:
                item_exist = key_es.get(index=index_name, doc_type=index_type, id=uid)['_source']
                action = {'update':{'_id':uid}}
                try:
                    pr_last = item_exist[flag+'_'+str(es_num-1)]
                    rank_last = item_exist['rank_'+flag+'_'+str(es_num-1)]
                except:
                    pr_last = 0
                    rank_last = 101
                user_results[flag+'_diff_'+str(es_num)] = rank - pr_last
                user_results['rank_'+flag+'_diff_'+str(es_num)] = abs(count - rank_last)
                bulk_action.extend([action,{'doc':user_results}])
            except:
                action = {'index':{'_id':uid}}
                pr_last = 0
                rank_last = 101
                user_results[flag+'_diff_'+str(es_num)] = rank - pr_last
                user_results['rank_'+flag+'_diff_'+str(es_num)] = abs(count - rank_last)
                bulk_action.extend([action,user_results])

    #print bulk_action
    key_es.bulk(bulk_action, index=index_name, doc_type=index_type)

def write_tmp_file(tmp_file, uid, item_result):
    count = 0
    for key in item_result:
        if (key != 'None') and (key != uid):
            count += 1
            tmp_file.write('%s\t%s\t%s\n' % (uid, key, item_result[key]))

    tmp_file.flush()
    # print 'write tmp line count:', count

'''
def scan_retweet(tmp_file):
    count = 0
    ret_count = 0
    scan_cursor = 0
    now_ts = time.time()
    now_date_ts = datetime2ts(ts2datetime(now_ts))
    retweet_redis = daily_retweet_redis
    start_ts = time.time()
    while True:
        re_scan = retweet_redis.scan(scan_cursor, count=100)
        re_scan_cursor = re_scan[0]
        for item in re_scan[1]:
            count += 1
            item_list = item.split('_')
            if len(item_list)==2:
                ret_count += 1
                uid = item_list[1]
                item_result = retweet_redis.hgetall(item)
                write_tmp_file(tmp_file, uid, item_result)
        end_ts = time.time()
        #run_type
        # if RUN_TYPE == 0:
            #print '%s sec scan %s count user:' %(end_ts - start_ts, count)
        start_ts = end_ts
        scan_cursor = re_scan[0]
        if scan_cursor==0:
            break
    print 'total %s sec scan %s count user and %s retweet count' %(end_ts - now_ts, count, ret_count)
'''
