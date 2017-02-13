# -*-coding:utf-8-*-

import redis
from elasticsearch import Elasticsearch

K = 3

es_user_portrait = Elasticsearch("10.128.55.70:9200", timeout=600)
es_flow_text = Elasticsearch("10.128.55.75:9200", timeout=600)

r = redis.StrictRedis(host="10.128.131.138", port="6379", db=0)
es_retweet = Elasticsearch("10.128.131.138:9200", timeout=600)
es_event = Elasticsearch("10.128.131.138:9200", timeout=600)

pre_flow_text = "flow_text_"
