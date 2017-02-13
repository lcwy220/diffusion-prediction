# -*- coding: utf-8 -*-
import sys
import time
import tempfile
import json
import pyspark
from elasticsearch import Elasticsearch
from elasticsearch.helpers import scan
reload(sys)
sys.path.append('../')

from global_config import retweet_es as es
from global_config import retweet_es_index,retweet_es_type

from global_utils import get_net_dic_pr

from spam.pagerank_for_portrait import pagerank
from pagerank_config import ITER_COUNT,TOP_N # 默认值为1

from pagerank_mappings import pagerank_es_mappings

from utils import save_dg_pr_results, get_es_num,write_tmp_file
from time_utils import ts2date

def get_retweet_dic():
    print 'start get_retweet_dic'
    net_dic_pr = {}
    query_body = {
	'query':{
	    'match_all':{}
	}
    }

    es_results_scan = scan(es,query=query_body,size=3000,index=retweet_es_index,doc_type=retweet_es_type)
    #print 'len(es_results_scan)::::',len(es_results_scan)
    count = 0 
    while 1:
	try:
	    scan_data = es_results_scan.next()
	    #print 'scan_data:::::',scan_data
	    count += 1
	    uid = scan_data['_source']['uid']
	    retweet_uid = json.loads(scan_data['_source']['uid_retweet'])
	    #print 'retweet_uid::::',retweet_uid
            net_dic_pr[uid] = retweet_uid
	except StopIteration:
	    break
    print 'count::::',count
    return net_dic_pr

def pagerank_rank():
    #timestamp = time.time()
    net_dic_pr = get_retweet_dic()
  
    print 'len(net_dic):::',len(net_dic_pr) 
    #es_num = get_es_num(timestamp)
    
    #if es_num == 0:
    
    pagerank_es_mappings()
   
    tmp_file = tempfile.NamedTemporaryFile(delete=False)

    print 'step 1: write', ts2date(time.time())
    for key in net_dic_pr:

        write_tmp_file(tmp_file,key,net_dic_pr[key])

    tmp_file.close()
    if not tmp_file:
        return
    input_tmp_path = tmp_file.name
    print input_tmp_path
    
    print 'step 2: pagerank', ts2date(time.time())
    all_uids_count, dg_sorted_uids, pr_sorted_uids = pagerank(ITER_COUNT, input_tmp_path, TOP_N, 'all')
    #print 'all_uids_count:::',all_uids_count
    #print 'dg_sort_uids::',dg_sorted_uids
    #print 'pr_sorted_uids:',pr_sorted_uids
    print 'step 3: save', ts2date(time.time())
    #save_count_results(all_uids_count, es_num)
    save_dg_pr_results(dg_sorted_uids,'dg')    
    save_dg_pr_results(pr_sorted_uids,'pr')    
    print 'save done', ts2date(time.time())


if __name__ == '__main__':
    ''' 
    try:
        pagerank_rank()
    except Exception,e:
        print e, '&error&', ts2date(time.time())
    '''

    pagerank_rank()    
