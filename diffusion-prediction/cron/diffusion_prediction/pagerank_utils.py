# -*- coding:utf-8 -*-

import sys
import time
import json

reload(sys)
sys.path.append('../')
#from parameter import DAY, HOUR, RUN_TYPE
from global_config import R_BEGIN_TIME
from global_utils import key_es as es
#from time_utils import ts2datetime, datetime2ts
import pinyin
from pagerank_mappings import pagerank_es_mappings


def get_es_num(timestamp):
    date = ts2datetime(timestamp)
    date_ts = datetime2ts(date)
    num = int((timestamp - date_ts) / (3 * HOUR))
    return num
'''
def save_count_results(all_uids_count, es_num):
    index_name = "pagerank_results_count"
    index_type = "network"
    item = {}
    date = ts2datetime(time.time())
    item['period_'+str(es_num)] = all_uids_count
    try:
        item_exist = es_user_portrait.get(index=index_name, doc_type=index_type, id=date)
        es_user_portrait.update(index=index_name, doc_type=index_type,id=date,body={'doc':item})
    except Exception, e:
        # raise e
        item['start_ts'] = date
        es_user_portrait.index(index=index_name, doc_type=index_type,id=date,body=item)
'''

def save_dg_pr_results(sorted_uids, flag):
    index_name = "pagerank_results"
    index_type = "pagerank"
    bulk_action = []
    count = 0
    for uid, rank in sorted_uids:
        if (uid == 'global'):
            continue
        count += 1
        user_results = {}
        user_results['uid'] = uid
        user_results['value_'+flag] = rank #value
        user_results['rank_'+flag] = count #rank
        #if es_num == 0:
        action = {'index':{'_id':uid}}
        bulk_action.extend([action,user_results])
        '''
	else:
            try:
                item_exist = es.get(index=index_name, doc_type=index_type, id=uid)['_source']
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
	'''
    #print bulk_action
    es.bulk(bulk_action, index=index_name, doc_type=index_type)

