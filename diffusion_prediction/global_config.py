# -*-coding:utf-8-*-

RUN_TYPE=0


ES_FLOW_TEXT_PORT = ["219.224.134.216:9201", "219.224.134.217:9201"]
ES_BE_RETWEET_PORT = ["219.224.134.216:9201", "219.224.134.217:9201"]
ES_PREDICTION_PORT = ["219.224.134.216:9202"]
ES_USER_PROFILE = ["219.224.134.216:9201"]

REDIS_HOST = "219.224.134.213"
REDIS_PORT = "7381"

pre_flow_text = "flow_text_"
type_flow_text = "text"

index_be_retweet = "1225_be_retweet_1"
index_type_be_retweet = "user"

# the minimal prediction time
minimal_time_interval = 3600 

# the minimal prediction size
K = 12

# micro prediction data organization order
data_order = ["total_fans_number", "origin_weibo_number", "retweeted_weibo_number", "comment_weibo_number",\
        "positive_weibo_number", "neutral_weibo_number", "negetive_weibo_number", "origin_important_user_number", \
        "origin_important_user_retweet", "retweet_important_user_count", "retweet_important_user_retweet", \
        "total_count", "average_origin_imp_hour", "average_retweet_imp_hour"]

# prediction task manage index
index_manage_prediction_task = "manage_prediction_task"
type_manage_prediction_task = "prediction_task"


# detail prediction task
index_type_prediction_task = "micro_task"

# task_list scan text
task_scan_text = "task_scan_text"
type_macro_feature_result = "macro_feature_result"
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


# event analysis
index_event_analysis = "manage_event_analysis"
type_event_analysis = "event_analysis"
