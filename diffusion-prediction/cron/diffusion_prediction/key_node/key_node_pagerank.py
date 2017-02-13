# -*- coding: utf-8 -*-
import sys
import time
import tempfile
reload(sys)
sys.path.append('../../')

from global_utils import get_net_dic_pr

from spam.pagerank_for_portrait import pagerank
from pagerank_config import ITER_COUNT,TOP_N # 默认值为1

#from cron_user_portrait_network_mappings import network_es_mappings, network_count_es_mappings

from utils import save_dg_pr_results, get_es_num, save_count_results,write_tmp_file
from time_utils import ts2date


def pagerank_rank():
    timestamp = time.time()
    net_dic_pr = get_net_dic_pr()
    
    '''
    es_num = get_es_num(timestamp)
    
    if es_num == 0:
        network_es_mappings()
        network_count_es_mappings()
    '''
    tmp_file = tempfile.NamedTemporaryFile(delete=False)

    print 'step 1: write', ts2date(timestamp)
    for key in net_dic_pr:

        write_tmp_file(tmp_file,key,net_dic_pr[key])

    tmp_file.close()
    if not tmp_file:
        return
    input_tmp_path = tmp_file.name
    print input_tmp_path
    
    print 'step 2: pagerank', ts2date(time.time())
    all_uids_count, dg_sorted_uids, pr_sorted_uids = pagerank(ITER_COUNT, input_tmp_path, TOP_N, 'all')
    print 'pr_sorted_uids:',pr_sorted_uids
    print 'step 3: save', ts2date(time.time())
    save_count_results(all_uids_count, es_num)
    save_dg_pr_results(dg_sorted_uids, es_num, 'dg')    
    save_dg_pr_results(pr_sorted_uids, es_num, 'pr')    
    print 'save done', ts2date(time.time())


if __name__ == '__main__':
    try:
        pagerank_rank()
    except Exception,e:
        print e, '&error&', ts2date(time.time())
        