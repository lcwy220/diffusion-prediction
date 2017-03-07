# -*-coding:utf-8-*-

import sys
import json
from elasticsearch import Elasticsearch
from elasticsearch.helpers import scan
reload(sys)
sys.path.append("../../")
from global_utils import es_prediction as es

def mappings_macro_task(task_name)
    
    index_info = {
	'mappings':{
	    'macro_task':{
		'properties':{
		    'event':{
			'type':'string',
			'index':'not_analyzed'
		    },
		    'topic_field':{
			'type':'string',
			'index':'not_analyzed'
		    },
		    'total_num':{
			'type':'long'
		    },
		    'total_user_fans':{
		        'type':'long'
    		    },
		    'total_comment':{
			'type':'long'
		    },
		    'total_retweet':{
			'type':'long'
		    },
		    'total_sensitive':{
			'type':'long'
		    },
		    'total_sensitive_ratio':{
			'type':'double'
		    },
		    'total_negtive':{
			'type':'long'
		    },
		    'total_important_user':{
			'type':'long'
		    },
		    'total_origin_type':{
			'type':'long'
		    },
		    'origin_ratio':{
			'type':'double'
		    },
		    'total_retweet_type':{
			'type':'long'
		    },
		    'retweet_ratio':{
			'type':'double'
		    },
		    'total_comment_type':{
			'type':'long'
		    },
		    'comment_ratio':{
			'type':'double'
		    },
		    'at_count':{
			'type':'string',
			'index':'not_analyzed'
		    },
		    'event_uid_count':{
			'type':'long'
		    },
		    'event_trend_delta':{
			'type':'string',
			'index':'not_analyzed'
		    },
		    'predict_value':{
			'type':'long'
		    },
		    'predict_rank':{
			'type':'double'
		    },
		    'update_time':{
			'type':'long'
		    }		    
		}
	    }
	}

    }

    index_name = 'macro_prediction_' + task_name

    if not es.indices.exists(index=index_name):

        es.indices.create(index=index_name, body=index_info, ignore=400)

    return "1"


if __name__ == '__main__':

	task_name = 'macro_prediction_'+'mao'
	mappings_macro_prediction(task_name)
    