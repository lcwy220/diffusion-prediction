#-*- coding:utf-8 -*-

import os
import time
import json
from flask import Blueprint, url_for, render_template, request, abort, flash, session, redirect

from diffusion_prediction.time_utils import ts2datetime, datetime2ts


mod = Blueprint('social_sensing', __name__, url_prefix='/social_sensing')

#页面链接
@mod.route('/hot_event/')
def hot_event():

    return render_template('social_sensing/hot_event.html')

@mod.route('/event_perception/')
def event_perception():

    return render_template('social_sensing/event_perception.html')

@mod.route('/perceived_results/')
def perceived_results():

        return render_template('social_sensing/perceived_results.html')


# show current hot event
@mod.route('/show_brusty_event/')
def ajax_show_bursty_event():
    results = []

    return json.dumps(results)


# create social sensing task
@mod.route('/create_analysis_task/')
def ajax_create_analysis_task():
    finish = 0

    return finish


# show all analyzed task
@mod.route('/show_all_task/')
def ajax_show_all_task():
    results = []

    return json.dumps(results)


# show analysis results
@mod.route('/show_analysis_results/')
def ajax_show_analysis_results():
    results = []

    return json.dumps(results)
