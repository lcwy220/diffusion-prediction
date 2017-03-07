# -*-coding:utf-8-*-
import os
from flask import Flask
from elasticsearch import Elasticsearch

RUN_TYPE=0


ES_FLOW_TEXT_PORT = ["219.224.134.216:9201", "219.224.134.217:9201"]
ES_BE_RETWEET_PORT = ["219.224.134.216:9201", "219.224.134.217:9201"]
ES_PREDICTION_PORT = ["219.224.134.216:9202"]
ES_USER_PROFILE = ["219.224.134.216:9201"]

GRAPH_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../graph/')


REDIS_HOST = "219.224.134.213"
REDIS_PORT = "7381"

pre_flow_text = "flow_text_"
type_flow_text = "text"

index_be_retweet = "1225_be_retweet_1"
index_type_be_retweet = "user"

# the minimal prediction time
minimal_time_interval = 3600 

# the minimal prediction size
K = 8

# micro prediction data organization order
data_order = ["total_fans_number", "origin_weibo_number", "retweeted_weibo_number", "comment_weibo_number",\
        "total_count","total_uid_count"]

# prediction task manage index
index_manage_prediction_task = "manage_prediction_task"
type_manage_prediction_task = "prediction_task"


# detail prediction task
index_type_prediction_task = "micro_task"

# task_list scan text
task_scan_text = "task_scan_text"
index_macro_feature_result = "macro_feature_result"
type_macro_feature_result = "feature_result"
task_micro_prediction = "task_micro_prediction"
task_trendline = "task_trendline"
pre_trendline = "trendline_"




# social sensing text clsssifier
TOPIC_ABS_PATH = "/home/ubuntu8/yuankun/diffusion-prediction/diffusion_prediction/cron/model_file/topic"

# social sensing
index_sensing = "manage_sensing_task"
type_sensing = "task"
id_sensing = "social_sensing_task"

topic_value_dict = {"art": 1, "computer":2, "economic":7, "education":7.5, "environment":8.7, "medicine":7.8,"military":7.4, "politics":10, "sports":4, "traffic":6.9, "life":1.8, "anti-corruption":9.5, "employment":6, "fear-of-violence":9.3, "house":6.4, "law":8.6, "peace":5.5, "religion":7.6, "social-security":8.6}
zh_data = ['文体类_娱乐','科技类','经济类','教育类','民生类_环保','民生类_健康',\
        '军事类','政治类_外交','文体类_体育','民生类_交通','其他类',\
        '政治类_反腐','民生类_就业','政治类_暴恐','民生类_住房','民生类_法律',\
        '政治类_地区和平','政治类_宗教','民生类_社会保障']

name_list = ['art','computer','economic','education','environment','medicine',\
        'military','politics','sports','traffic','life',\
        'anti-corruption','employment','fear-of-violence','house',\
        'law','peace','religion','social-security']


profile_index_name = "weibo_user"
profile_index_type = "user"
flow_text_index_name_pre = "flow_text_"
flow_text_index_type = "text"


# interfere and stimulation
type_manage_interfere_task = "interfere_task"
index_manage_interfere_task = "manage_interfere_task"
task_stimulation = "task_stimulation"

#
topic_index_name = 'topics'
topic_index_type ='text'

#network diffusion

task_network_diffusion = 'task_network_diffusion',

index_manage_network_diffusion = 'manage_network_diffusion'
type_manage_network_diffusion = 'network_diffusion'

index_network_diffusion_results = 'network_diffusion_results'
type_network_diffusion_results = 'diffusion_results' 


#event analysis
task_event_analysis = 'task_event_analysis'
index_manage_event_analysis = 'manage_event_analysis_task'
type_manage_event_analysis = 'event_analysis_task'

index_event_analysis_results = 'event_analysis_results'
type_event_analysis_results = 'analysis_results'

#time

index_event_time_count = 'event_time_count'
type_event_time_count = 'time_count'

index_event_time_kcount = 'event_time_kcount'
type_event_time_kcount = 'time_kcount'

index_event_time_weibo = 'event_time_weibo'
type_event_time_weibo = 'time_weibo'


#geo

index_event_geo_city_repost = 'event_geo_city_repost'
type_event_geo_city_repost = 'geo_city_repost'

index_event_geo_province_weibos = 'event_geo_province_weibos'
type_event_geo_province_weibos = 'geo_province_weibos'

index_event_geo_city_topic_count = 'event_geo_city_topic_count'
type_event_geo_city_topic_count = 'geo_city_topic_count'

#network

index_event_network_first_user = 'event_network_first_user'
type_event_network_first_user = 'network_first_user'

index_event_network_topic_identification = 'event_network_topic_identification'
type_event_network_topic_identification = 'network_topic_identification'

index_event_network_trend_maker = 'event_network_trend_maker'
type_event_network_trend_maker = 'network_trend_maker'

index_event_network_trend_pusher = 'event_network_trend_pusher'
type_event_network_trend_pusher = 'network_trend_pusher'

#sentiment

index_event_sentiment_count = 'event_sentiment_count'
type_event_sentiment_count = 'sentiment_count'

index_event_sentiment_weibo = 'event_sentiment_weibo'
type_event_sentiment_weibo = 'sentiment_weibo'

index_event_sentiment_geo = 'event_sentiment_geo'
type_event_sentiment_geo = 'sentiment_geo'


MAX_REPOST_SEARCH_SIZE = '100'

mtype_kv = {'origin':1, 'comment': 2, 'forward':3}
emotions_kv = {'happy': 1, 'angry': 2, 'sad': 3, 'news': 4}
emotions_zh_kv = {'happy': '高兴', 'angry': '愤怒', 'sad': '悲伤', 'news': '新闻'}


SENTIMENT_TYPE_COUNT = 7
SENTIMENT_FIRST = ['0', '1', '7']
SENTIMENT_SECOND = ['2', '3', '4', '5', '6']
MAX_REPOST_SEARCH_SIZE = '100'
MAX_FREQUENT_WORDS = 100


#language
MAX_LANGUAGE_WEIBO = 200
NEWS_LIMIT = 100

#WEIBO_ES_HOST = '219.224.134.216:9204'
WEIBO_ES_HOST = '219.224.134.216:9202'
weibo_es = Elasticsearch(WEIBO_ES_HOST,timeout=1000)
weibo_index_name = 'weibo'
weibo_index_type ='text'
topics_river_index_name='topics_river'
topics_river_index_type='text'
subopinion_index_type='text'
subopinion_index_name='subopinion'

