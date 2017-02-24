# -*-coding:utf-8-*-


import json
import redis
from global_config import *
from elasticsearch import Elasticsearch

es_flow_text = Elasticsearch(ES_FLOW_TEXT_PORT, timeout=600)
es_prediction = Elasticsearch(ES_PREDICTION_PORT, timeout=600)
es_retweet = Elasticsearch(ES_BE_RETWEET_PORT, timeout=600)
es_user_profile = Elasticsearch(ES_USER_PROFILE, timeout=600)

r_micro = redis.StrictRedis(host=REDIS_HOST,port=REDIS_PORT, db=0)
r_trendline = redis.StrictRedis(host=REDIS_HOST,port=REDIS_PORT, db=2)

r_scan_text = redis.StrictRedis(host=REDIS_HOST,port=REDIS_PORT, db=1)

R_SOCIAL_SENSING = redis.StrictRedis(host=REDIS_HOST,port=REDIS_PORT, db=3)

r_stimulation = redis.StrictRedis(host=REDIS_HOST,port=REDIS_PORT, db=4)
