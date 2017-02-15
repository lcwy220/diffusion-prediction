# -*-coding:utf-8-*-


import redis
from global_config import *
from elasticsearch import Elasticsearch

es_flow_text = Elasticsearch(ES_FLOW_TEXT_PORT)
es_prediction = Elasticsearch(ES_PREDICTION_PORT)
es_be_retweet = Elasticsearch(ES_BE_RETWEET_PORT)

r_micro = redis.StrictRedis(host=REDIS_HOST,port=REDIS_PORT, db=0)

r_scan_text = redis.StrictRedis(host=REDIS_HOST,port=REDIS_PORT, db=1)
