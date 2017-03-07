# -*-coding:utf-8-*-

import sys
import json
import pinyin
from elasticsearch import Elasticsearch
from elasticsearch.helpers import scan
reload(sys)
sys.path.append('../../')
from global_utils import es_prediction as es
from global_config import index_event_analysis_results,type_event_analysis_results

def mappings_event_analysis_results():

	index_info = {
		'settings':{
			'number_of_replicas':0,
			'number_of_shards':5
		},
		'mappings':{
			type_event_analysis_results:{
				'properties':{
					"time_results":{
						"index": "no",
						"type": "string"
					},
					"geo_results":{
						"index": "no",
						"type": "string"
					},
					"sentiment_results":{
						"index": "no",
						"type": "string"
					},
					"network_results":{
						"index": "no",
						"type": "string"
					},
					"language_results":{
						"index": "no",
						"type": "string"
					},
					"weibo_counts": {
						"type": "long"
					},
					"en_name": {
						"index": "not_analyzed",
						"type": "string"
					},
					"topic": {
						"index": "no",
						"type": "string"
					},
					"start_ts": {
						"type": "long"
					},
					"uid_counts": {
						"type": "long"
					},
					"end_ts": {
						"type": "long"
					}
				}
			}

		}

	}


	if not es.indices.exists(index=index_event_analysis_results):

		es.indices.create(index=index_event_analysis_results,body=index_info,ignore=400)

	return '1'


if __name__ == "__main__":

	mappings_event_analysis_results()

