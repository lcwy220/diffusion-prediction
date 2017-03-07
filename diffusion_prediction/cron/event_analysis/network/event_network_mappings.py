import sys
import json
import pinyin
from elasticsearch import Elasticsearch
from elasticsearch.helpers import scan
from global_utils import es_prediction as es
from global_config import index_event_network_first_user,type_event_network_first_user,\
						index_event_network_topic_identification,type_event_network_topic_identification,\
						index_event_network_trend_maker,type_event_network_trend_maker,\
						index_event_network_trend_pusher,type_event_network_trend_pusher
							

def mappings_event_network_first_user():

	index_info = {
		'settings':{
			'numbers_of_replicas':0,
			'numbers_of_shards':5
		},
		'mappings':{
			type_event_network_first_user:{
				'properties':{
					'en_name':{
						'type':'string',
						'index':'not_analyzed'
					},
					'date':{
						'type':'string',
						'index':'not_analyzed'
					},
					'windowsize':{            
						'type':'long'
					},
					'uid':{
						'type':'string',
						'index':'not_analyzed'
					},
					'timestamp':{
						'type':'long'
					},
					'user_info':{     
						'type':'string',
						'index':'not_analyzed'
					},
					'weibo_info':{      
						'type':'string',
						'index':'not_analyzed'
					},
					'user_domain':{      
						'type':'string',
						'index':'not_analyzed'
					}
				}
			}

		}

	}

	if not es.indices.exists(index=index_event_network_first_user):

        es.indices.create(index=index_event_network_first_user, body=index_info, ignore=400)

#存放源头转发网络pagerank的计算结果

def mappings_event_network_topic_identification():

	index_info = {
		'settings':{
			'numbers_of_replicas':0,
			'numbers_of_shards':5
		},
		'mappings':{
			type_event_network_topic_identification:{
				'properties':{
					'en_name':{
						'type':'string',
						'index':'not_analyzed'
					},
					'rank':{            
						'type':'long'
					},
					'uid':{
						'type':'string',
						'index':'not_analyzed'
					},
					'identifyDate':{
						'type':'string',
						'index':'not_analyzed'
					},
					'identifyWindow':{     
						'type':'long'
					},
					'identifyMethod':{      
						'type':'string',
						'index':'not_analyzed'
					},
					'pr':{      
						'type':'double'
					}
				}
			}

		}

	}

	if not es.indices.exists(index=index_event_network_topic_identification):

        es.indices.create(index=index_event_network_topic_identification, body=index_info, ignore=400)


def mappings_event_network_trend_maker():

	index_info = {
		'settings':{
			'numbers_of_replicas':0,
			'numbers_of_shards':5
		},
		'mappings':{
			type_event_network_trend_maker:{
				'properties':{
					'en_name':{
						'type':'string',
						'index':'not_analyzed'
					},
					'date':{
						'type':'string',
						'index':'not_analyzed'
					},
					'windowsize':{            
						'type':'long'
					},
					'uid':{
						'type':'string',
						'index':'not_analyzed'
					},
					'timestamp':{
						'type':'long'
					},
					'user_info':{     
						'type':'string',
						'index':'not_analyzed'
					},
					'weibo_info':{      
						'type':'string',
						'index':'not_analyzed'
					},
					'user_domain':{      
						'type':'string',
						'index':'not_analyzed'
					},
					'rank':{            
						'type':'long'
					},
					'value':{     
						'type':'long'
					},
					'key_item':{
						'type':'string',
						'index':'not_analyzed'
					}
				}
			}

		}

	}

	if not es.indices.exists(index=index_event_network_trend_maker):

        es.indices.create(index=index_event_network_trend_maker, body=index_info, ignore=400)


def mappings_event_network_trend_pusher():

	index_info = {
		'settings':{
			'numbers_of_replicas':0,
			'numbers_of_shards':5
		},
		'mappings':{
			type_event_network_trend_pusher:{
				'properties':{
					'en_name':{
						'type':'string',
						'index':'not_analyzed'
					},
					'date':{
						'type':'string',
						'index':'not_analyzed'
					},
					'windowsize':{            
						'type':'long'
					},
					'uid':{
						'type':'string',
						'index':'not_analyzed'
					},
					'timestamp':{
						'type':'long'
					},
					'user_info':{     
						'type':'string',
						'index':'not_analyzed'
					},
					'weibo_info':{      
						'type':'string',
						'index':'not_analyzed'
					},
					'user_domain':{      
						'type':'string',
						'index':'not_analyzed'
					},
					'rank':{            
						'type':'long'
					}
				}
			}

		}

	}

	if not es.indices.exists(index=index_event_network_trend_pusher):

        es.indices.create(index=index_event_network_trend_pusher, body=index_info, ignore=400)

