# -*- coding: utf-8 -*-
#from user_portrait.global_config import db,es_user_profile,profile_index_name,profile_index_type
#from user_portrait.info_consume.model import PropagateCount, PropagateWeibos,PropagateTimeWeibos
'''
import re
import math
import json
import datetime
from sqlalchemy import func
import sys
from user_portrait.info_consume.model import TrendMaker, TrendPusher,TopicIdentification
from user_portrait.global_config import db, es_user_profile
'''
import re
import sys
import json
import math
from bulk_insert import read_long_gexf
reload(sys)
sys.path.append('../../')
from diffusion_prediction.global_config import index_event_analysis_results,type_event_analysis_results
from diffusion_prediction.global_utils import es_prediction as es
from diffusion_prediction.global_utils import es_user_portrait,profile_index_name,profile_index_type

#sys.path.append('../cron/event_analysis/network/')
#print 'bulk_insert::::',sys.path



Minute = 60
Fifteenminutes = 15 * Minute
Hour = 3600
SixHour = Hour * 6
Day = Hour * 24
MinInterval = Fifteenminutes

def gexf_process(data):
	results = {}
	#print type(data)
	data = json.loads(data)

	comp = re.compile('<node id=\\\"(\d*)\\\"')
	id_list = comp.findall(data)
	comp = re.compile('<attvalue for=\\\"name\\\" value=\\\"(.*)\\\"/>')
	name_list = comp.findall(data)
	comp = re.compile('<viz:size value=\\\"(\d*)\\\"/>\\n')
	size = comp.findall(data)
	comp = re.compile('label=\\\"(\d*)\\\">')
	uid = comp.findall(data)
	comp = re.compile('source=\\\"(\d*)\\\"')
	source = comp.findall(data)
	comp = re.compile('target=\\\"(\d*)\\\"/>\\n')
	target = comp.findall(data)


	nodes_dict = {}
	nodes = []
	for i in range(len(id_list)):
		iter_item = {}
		iter_item['label'] = name_list[i]

		iter_item_node = {}
		iter_item_node['name'] = id_list[i]
		iter_item_node['symbolSize'] = size[i]
		iter_item_node['label'] = name_list[i]
		iter_item_node['uid'] = uid[i]

		nodes.append(iter_item_node)
		nodes_dict[id_list[i]]=iter_item

	links = []
	
	for i in range(len(source)):
		iter_item = {}

		iter_item['source'] = nodes_dict[source[i]]['label']
		iter_item['target'] = nodes_dict[target[i]]['label']

		links.append(iter_item)
	results = {}
	results['nodes'] = nodes
	results['links'] = links
	return results

def get_gexf_es(topic, identifyDate, identifyWindow):
	#key = _utf8_unicode(topic) +'_' + str(identifyDate) + '_' + str(identifyWindow) + '_' + 'source_graph'
	#key = str(key)
   
    #gexf2es(key, value)
    print 'topic:::',topic
    query_body = {
    	'query':{
    		'term':{'en_name':topic}
    	}
    }

    network_results = es.search(index=index_event_analysis_results,doc_type=type_event_analysis_results,body=query_body)['hits']['hits']

    for network_result in network_results:

    	network_result = network_result['_source']['network_results']

    	network_result = json.loads(network_result)

    	gexf_results = network_result['long_gexf']
    
    for key,value in gexf_results.iteritems():
    	#print value.keys()
    	#print value['date']
    	#print value['window']
    	#print type(value)
    	#print key
    	result = value['gexf']
    	print type(result)

    #result = read_long_gexf(topic, identifyDate, identifyWindow)
	#result = gexf_process(result)
	#print result
    return result

'''
def get_gexf(topic, identifyDate, identifyWindow):
	#key = _utf8_unicode(topic) +'_' + str(identifyDate) + '_' + str(identifyWindow) + '_' + 'source_graph'
	#key = str(key)
   
    #gexf2es(key, value)
	result = read_long_gexf(topic, identifyDate, identifyWindow)
	
	return result
'''

def get_trend_pusher_es(topic, identifyDate, identifyWindow):

    query_body = {
    	'query':{
    		'term':{'en_name':topic}
    	}
    }

    network_results = es.search(index=index_event_analysis_results,doc_type=type_event_analysis_results,body=query_body)['hits']['hits']

    for network_result in network_results:

    	network_result = network_result['_source']['network_results']
    	network_result = json.loads(network_result)
    	pusher_results = network_result['pusher_results']
    	# print '147:::::::::::::',pusher_results
    	for uid, info_dict in pusher_results.iteritems():
    		user_info = info_dict['user_info']
    		user_info = json.loads(user_info)
    		pusher_results[uid]['user_info'] = user_info

   
    return pusher_results

'''
def get_trend_pusher(topic, identifyDate, identifyWindow):
	items = db.session.query(TrendPusher).filter(TrendPusher.topic==topic ,\
														TrendPusher.date==identifyDate ,\
													TrendPusher.windowsize==identifyWindow).all()
	#for item in items:
		#print dir(item)
	#return items
	
	results = []
	for item in items:
		result = {}
		user_info = json.loads(item.user_info)
		weibo_info = json.loads(item.weibo_info)
		result['timestamp'] = item.timestamp
		result['name'] = user_info['name']
		result['photo'] = user_info['profile_image_url']
		result['fans'] = user_info['followers_count']
		result['uid'] = item.uid
		result['mid'] = weibo_info[0]['_id']
		results.append(result)
	return results
'''

def get_trend_maker_es(topic, identifyDate, identifyWindow):

    query_body = {
    	'query':{
    		'term':{'en_name':topic}
    	}
    }

    network_results = es.search(index=index_event_analysis_results,doc_type=type_event_analysis_results,body=query_body)['hits']['hits']

    for network_result in network_results:

    	network_result = network_result['_source']['network_results']
    	network_result = json.loads(network_result)
    	maker_results = network_result['maker_results']
    	for uid, info_dict in maker_results.iteritems():
    		user_info = info_dict['user_info']
    		user_info = json.loads(user_info)
    		maker_results[uid]['user_info'] = user_info



    return maker_results
    

'''
def get_trend_maker(topic, identifyDate, identifyWindow):

	items = db.session.query(TrendMaker).filter(TrendMaker.topic==topic ,\
														TrendMaker.date==identifyDate ,\
														TrendMaker.windowsize==identifyWindow).all()
	
	results = []
	for item in items:
		result = {}
		#print item.uid
		user_info = json.loads(item.user_info)
		weibo_info = json.loads(item.weibo_info)
		result['timestamp'] = item.timestamp
		result['name'] = user_info['name']
		result['photo'] = user_info['profile_image_url']
		result['fans'] = user_info['followers_count']
		result['uid'] = item.uid
		result['mid'] = weibo_info[0]['_id']
		results.append(result)
	return results
'''    

def get_pusher_weibos_sort_es(topic, identifyDate, identifyWindow,sort_item):
    query_body = {
    	'query':{
    		'term':{'en_name':topic}
    	}
    }

    network_results = es.search(index=index_event_analysis_results,doc_type=type_event_analysis_results,body=query_body)['hits']['hits']
    weibos = []
    for network_result in network_results:

    	network_result = network_result['_source']['network_results']
    	network_result = json.loads(network_result)
    	pusher_results = network_result['pusher_results']
    	print '234 pusher_results:::::::::::::',pusher_results
    	for uid,pusher_info in pusher_results.iteritems():
    		user_info = pusher_info['user_info']
    		user_info = json.loads(user_info)
    		weibos_info = pusher_info['weibo_info']
    		weibos_info = json.loads(weibos_info)

    		for weibo_info in weibos_info:
    			weibo_info['_source']['uname'] = user_info['name']
    			weibo_info['_source']['photo_url'] = user_info['profile_image_url']
    			if weibo_info in weibos:
    				continue
    			else:
    				weibos.append(weibo_info)
    
    sorted_weibos = sorted(weibos,key=lambda x:x['_source'][sort_item],reverse=True)
    #print 'sorted_weibos::::::::::::::',sorted_weibos
    return sorted_weibos


def get_maker_weibos_sort_es(topic, identifyDate, identifyWindow,sort_item):
    query_body = {
    	'query':{
    		'term':{'en_name':topic}
    	}
    }

    network_results = es.search(index=index_event_analysis_results,doc_type=type_event_analysis_results,body=query_body)['hits']['hits']
    weibos = []
    for network_result in network_results:

    	network_result = network_result['_source']['network_results']
    	network_result = json.loads(network_result)
    	maker_results = network_result['maker_results']

    	for uid,maker_info in maker_results.iteritems():
    		user_info = maker_info['user_info']
    		user_info = json.loads(user_info)
    		weibos_info = maker_info['weibo_info']
    		weibos_info = json.loads(weibos_info)

    		for weibo_info in weibos_info:
    			weibo_info['_source']['uname'] = user_info['name']
    			weibo_info['_source']['photo_url'] = user_info['profile_image_url']
    			if weibo_info in weibos:
    				continue
    			else:
    				weibos.append(weibo_info)
    
    sorted_weibos = sorted(weibos,key=lambda x:x['_source'][sort_item],reverse=True)
    #print 'sorted_weibos::::::::::::::',sorted_weibos
    return sorted_weibos


'''
def get_pusher_weibos_byts(topic, identifyDate, identifyWindow):
	items = db.session.query(TrendPusher).filter(TrendPusher.topic==topic ,\
														TrendPusher.date==identifyDate ,\
													TrendPusher.windowsize==identifyWindow).all()
	weibos = []
	for item in items:
		#print len(json.loads(item.weibo_info))
		user_info = json.loads(item.user_info)
		#print user_info
		weibos_info = json.loads(item.weibo_info)[:]
		for weibo_info in weibos_info:
			weibo_info['_source']['uname'] = user_info['name']
			weibo_info['_source']['photo_url'] = user_info['profile_image_url']
			#print weibo_info
			if weibo_info in weibos:
				continue
			else:
				weibos.append(weibo_info)
	sorted_weibos = sorted(weibos, key = lambda x:x['_source']['timestamp'])
	#for weibo in sorted_weibos:
		#print weibo['_source']['timestamp']
	return sorted_weibos
'''
'''
def get_pusher_weibos_byhot(topic, identifyDate, identifyWindow):
	items = db.session.query(TrendPusher).filter(TrendPusher.topic==topic ,\
														TrendPusher.date==identifyDate ,\
													TrendPusher.windowsize==identifyWindow).all()
	weibos = []
	for item in items:
		#print len(json.loads(item.weibo_info))
		user_info = json.loads(item.user_info)
		#print user_info
		weibos_info = json.loads(item.weibo_info)[:]
		for weibo_info in weibos_info:
			weibo_info['_source']['uname'] = user_info['name']
			weibo_info['_source']['photo_url'] = user_info['profile_image_url']
			#print weibo_info
			if weibo_info in weibos:
				continue
			else:
				weibos.append(weibo_info)
	sorted_weibos = sorted(weibos, key = lambda x:x['_source']['retweeted'], reverse=True)
	#for weibo in sorted_weibos:
		#print weibo['_source']['retweeted']
	return sorted_weibos
'''
'''
def get_maker_weibos_byts_es(topic, identifyDate, identifyWindow):

    query_body = {
    	'query':{
    		'term':{'en_name':topic}
    	}
    }

    network_results = es.search(index=index_event_analysis_results,doc_type=type_event_analysis_results,body=query_body)['hits']['hits']

    for network_result in network_results:

    	network_result = network_result['_source']['network_results']
    	network_result = json.loads(network_result)
    	maker_results = network_result['maker_results']
    	print maker_results.keys()
	weibos = []
	for item in items:
		#print len(json.loads(item.weibo_info))
		user_info = json.loads(item.user_info)
		#print user_info
		weibos_info = json.loads(item.weibo_info)[:]
		for weibo_info in weibos_info:
			weibo_info['_source']['uname'] = user_info['name']
			weibo_info['_source']['photo_url'] = user_info['profile_image_url']
			#print weibo_info
			if weibo_info in weibos:
				continue
			else:
				weibos.append(weibo_info)
	sorted_weibos = sorted(weibos, key = lambda x:x['_source']['timestamp'])
	#for weibo in sorted_weibos:
		#print weibo['_source']['timestamp']
	return sorted_weibos
'''
'''
def get_maker_weibos_byts(topic, identifyDate, identifyWindow):
	items = db.session.query(TrendMaker).filter(TrendMaker.topic==topic ,\
														TrendMaker.date==identifyDate ,\
														TrendMaker.windowsize==identifyWindow).all()

	weibos = []
	for item in items:
		#print len(json.loads(item.weibo_info))
		user_info = json.loads(item.user_info)
		#print user_info
		weibos_info = json.loads(item.weibo_info)[:]
		for weibo_info in weibos_info:
			weibo_info['_source']['uname'] = user_info['name']
			weibo_info['_source']['photo_url'] = user_info['profile_image_url']
			#print weibo_info
			if weibo_info in weibos:
				continue
			else:
				weibos.append(weibo_info)
	sorted_weibos = sorted(weibos, key = lambda x:x['_source']['timestamp'])
	#for weibo in sorted_weibos:
		#print weibo['_source']['timestamp']
	return sorted_weibos
'''
'''
def get_maker_weibos_byhot(topic, identifyDate, identifyWindow):
	items = db.session.query(TrendMaker).filter(TrendMaker.topic==topic ,\
														TrendMaker.date==identifyDate ,\
														TrendMaker.windowsize==identifyWindow).all()
	weibos = []
	for item in items:
		#print len(json.loads(item.weibo_info))
		user_info = json.loads(item.user_info)
		#print user_info
		weibos_info = json.loads(item.weibo_info)[:]
		for weibo_info in weibos_info:
			weibo_info['_source']['uname'] = user_info['name']
			weibo_info['_source']['photo_url'] = user_info['profile_image_url']
			#print weibo_info
			if weibo_info in weibos:
				continue
			else:
				weibos.append(weibo_info)
	sorted_weibos = sorted(weibos, key = lambda x:x['_source']['retweeted'], reverse=True)
	#for weibo in sorted_weibos:
		#print weibo['_source']['retweeted']
	return sorted_weibos
'''

def get_top_pagerank(topic, identifyDate, identifyWindow):
	items = db.session.query(TopicIdentification).filter(TopicIdentification.topic==topic ,\
														TopicIdentification.identifyDate==identifyDate ,\
														TopicIdentification.identifyWindow==identifyWindow).limit(50)
	uid_list = [(item.userId,item.pr) for item in items]
	

	return uid_list

if __name__ == '__main__':
	#get_gexf('aoyunhui', "2016-08-11", 37 )
	#get_gexf_es('mao_ze_dong_dan_chen_ji_nian_ri', "2016-12-29", 37 )
	#get_trend_maker('aoyunhui', "2016-08-11", 37 )
	#get_trend_maker('mao_ze_dong_dan_chen_ji_nian_ri', "2016-12-29", 37 )
	#get_trend_pusher('aoyunhui', "2016-08-11", 37 )
	#get_pusher_weibos_byts('aoyunhui', "2016-08-11", 37 )
	#get_maker_weibos_byts('aoyunhui', "2016-08-11", 37 )
	#get_maker_weibos_byts_es('mao_ze_dong_dan_chen_ji_nian_ri', "2016-12-29", 37)
	get_pusher_weibos_sort_es('mao_ze_dong_dan_chen_ji_nian_ri', "2016-12-29", 37,'retweeted')
	#get_pusher_weibos_byhot('aoyunhui', "2016-08-11", 37 )
	#get_maker_weibos_byhot('aoyunhui', "2016-08-11", 37 )