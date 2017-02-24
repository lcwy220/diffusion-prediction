#-*- coding:utf-8 -*-

import os
import time
import json
from flask import Blueprint, url_for, render_template, request, abort, flash, session, redirect

from diffusion_prediction.time_utils import ts2datetime, datetime2ts


mod = Blueprint('manage', __name__, url_prefix='/manage')

#页面链接
@mod.route('/purview/')
def purview():

    return render_template('manage/purview.html')

@mod.route('/sensitive_words/')
def sensitive_words():

    return render_template('manage/sensitive_words.html')


# user authority

# specified social sensors
@mod.route('/show_social_sensors/')
def ajax_show_social_sensors():
    results = []

    return json.dumps(results)


@mod.route('/add_social_sensor/')
def ajax_add_social_sensor():
    finish = 0

    return finish

@mod.route('/revise_social_sensor/')
def ajax_revise_social_sensor():
    finish  = 0

    return finish

@mod.route('/delete_social_sensors/')
def ajax_delete_social_sensors():
    finish = 0

    return finish



