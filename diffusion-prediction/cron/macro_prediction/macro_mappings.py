# -*-coding:utf-8-*-

import sys
import json
from elasticsearch import Elasticsearch
from elasticsearch.helpers import scan
reload(sys)
sys.path.append("../../")
from global_utils import es_prediction as es

def mappings_manage_macro_task():

	index_info = {
	    'mappings':{
		'macro_task':{
		    'properties':{
			'task_name':{
			    'type':'string',
			    'index':'not_analyzed'
			},
			'keywords':{
			    'type':'string',
			    'index':'analyzed'
			},
			'query_body':{
			    'type':'string',
			    'index':'not_analyzed'
			}
			'submit_time':{
			    'type':'long'
			},
			'predict_time':{
			    'type':'long'
			},
			'predict_value':{
			    'type':'long'
			},
			'predict_rank':{
			    'type':'double'
			},
			'compute_status':{
			    'type':'string',
			    'index':'not_analyzed'
			}
			'create_by':{
			    'type':'string',
			    'index':'not_analyzed'
			}
	
		    }
		}
    	    }

	}
	
	index_name = 'manage_macro_task'
	exist_indice = es.indices.exists(index=index_name)
	if exist_indice:
	    es.indices.delete(index=index_name)
	es.indices.create(index=index_name,body=index_info,ignore=400)
	
	return 	True

def mappings_event_info()
    
    index_info = {
	'mappings':{
	    'event_info':{
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

    index_name = 'macro_event_info'
    exist_indice = es.indices.exists(index=index_name)

    if exist_indice:
	es.indices.delete(index=index_name)

    es.indices.create(index=index_name,body=index_info,ignore=400)
	
    return True


if __name__ == '__main__':

    mappings_manage_macro_task()
    mappings_event_info()

