# -*-coding:utf-8-*-

import os
import pinyin
import time
import json
from flask import Blueprint,render_template,request
from diffusion_prediction.time_utils import *
from diffusion_prediction.global_config import index_manage_event_analysis,type_manage_event_analysis
from diffusion_prediction.global_utils import es_prediction

mod = Blueprint('manage_event',__name__,url_prefix='/manage_event')


@mod.route('/create_task/')
def ajax_create_task():
	finish = ['0']
	task_name = request.args.get('task_name','')
	pinyin_task_name = pinyin.get(task_name.encode('utf-8'),format='strip',delimiter='_')
	submit_user = request.args.get('submit_user','admin@qq.com')
	current_ts = int(time.time())
	submit_time = request.args.get('submit_time',current_ts)
	start_ts = request.args.get('start_ts','')
	end_ts = request.args.get('end_ts','')
	must_keywords = request.args.get('must_keywords','')
	should_keywords = request.args.get('should_keywords','')
	