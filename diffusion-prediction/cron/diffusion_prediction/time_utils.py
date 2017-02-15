# -*- coding: utf-8 -*-

import time

def ts2date(ts):     
	return time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(ts))

def ts2datetime(ts):
    return time.strftime('%Y-%m-%d', time.localtime(ts))

def datetime2ts(date):
    return int(time.mktime(time.strptime(date, '%Y-%m-%d')))
