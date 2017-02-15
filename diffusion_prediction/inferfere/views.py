#-*- coding:utf-8 -*-

import os
import time
import json
from flask import Blueprint, url_for, render_template, request, abort, flash, session, redirect

from diffusion-prediction.time_utils import ts2datetime, datetime2ts


mod = Blueprint('interfere', __name__, url_prefix='/interfere')


# create task
@mod.route('/create_interfere_task/')
def ajax_create_interfere_task():
    finish = 0

    return finish


# show all task
@mod.route('/show_all_task/')
def ajax_show_all_task():
    results = []

    return json.dumps(results)



# return inferfere results
@mod.route('/get_inferfere_results/')
def ajax_get_inferfere_results():
    results = []

    return json.dumps(results)
