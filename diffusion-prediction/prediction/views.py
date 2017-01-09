#-*- coding:utf-8 -*-

import os
import time
import json
from flask import Blueprint, url_for, render_template, request, abort, flash, session, redirect

from diffusion-prediction.time_utils import ts2datetime, datetime2ts


mod = Blueprint('prediction', __name__, url_prefix='/prediction')


# create task
@mod.route('/create_task/')
def ajax_create_task():
    finish = 0

    return finish


# show task
@mod.route('/show_task/')
def ajax_show_task():
    results = []

    return json.dumps(results)



# macro prediction
@mod.route('/get_macro_prediction/')
def ajax_get_macro_prediction():
    results = []

    return json.dumps(results)



# micro prediction
@mod.route('/get_micro_prediction/')
def ajax_get_micro_prediction():
    results = []

    return json.dumps(results)

