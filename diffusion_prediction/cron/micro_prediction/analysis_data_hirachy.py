# -*-coding:utf-8-*-
# 100-prediction and value is the final result

import math
import json

thre = 10

with open("100-predicton-up-100-12.txt",'r') as f:
    for line in f:
        prediction = json.loads(line)

with open("100-value-up-100-12.txt","r") as f:
    for line in f:
        test = json.loads(line)

filter_test = []
filter_pre = []
other_test = []
other_pre = []

count = 0
count_100 = 0
count_50 = 0
count_0 = 0
count_abs = 0
count_500 = 0
rel_500 = 0
log_500 = 0
rel_1000, log_1000, count_1000, warning_1000,spe_1000 = 0,0,0,0,0
rel_500, log_500, count_500, warning_500, spe_500 = 0,0,0,0,0
rel_200, log_200, count_200, warning_200, spe_200 = 0,0,0,0,0
rel_100, log_100, count_100, warning_100, spe_100 = 0,0,0,0,0
rel_0, log_0, count_0, warning_0, spe_0 = 0,0,0,0,0
spe_count = 0

for i in range(len(test)):
    tmp_prediction = math.exp(prediction[i])
    tmp_test = math.exp(test[i]) -1

    if tmp_test >= 1000:
        rel_1000 += 1
        if prediction[i]- test[i]>=-0.5 and prediction[i] - test[i] <=0.5:
            log_1000 += 1
        if  tmp_prediction >= tmp_test* 0.8 and tmp_prediction <= tmp_test*1.2:
            count_1000 += 1
        if tmp_prediction >= 1000:
            warning_1000 += 1
        if tmp_prediction >= 500:
            spe_count += 1
            spe_1000 += 1

    elif tmp_test >= 500 and tmp_test < 1000:
        rel_500 += 1
        if prediction[i]- test[i]>=-0.5 and prediction[i] - test[i] <=0.5:
            log_500 += 1
        if  tmp_prediction >= tmp_test* 0.8 and tmp_prediction <= tmp_test*1.2:
            count_500 += 1
        if tmp_prediction >= 500 and tmp_prediction < 1000:
            warning_500 += 1
        if tmp_prediction >= 200:
            spe_count += 1
            spe_500 += 1

    elif tmp_test >= 200 and tmp_test < 500:
        rel_200 += 1
        if prediction[i]- test[i]>=-0.5 and prediction[i] - test[i] <=0.5:
            log_200 += 1
        if  tmp_prediction >= tmp_test* 0.8 and tmp_prediction <= tmp_test*1.2:
            count_200 += 1
        if tmp_prediction >= 200 and tmp_prediction < 500:
            warning_200 += 1
        if tmp_prediction >= 100 and tmp_prediction < 1000:
            spe_count += 1
            spe_200 += 1

    elif tmp_test >= 100 and tmp_test < 200:
        rel_100 += 1
        if prediction[i]- test[i]>=-0.5 and prediction[i] - test[i] <=0.5:
            log_100 += 1
        if  tmp_prediction >= tmp_test* 0.8 and tmp_prediction <= tmp_test*1.2:
            count_100 += 1
        if tmp_prediction >= 100 and tmp_prediction < 200:
            warning_100 += 1
        if tmp_prediction < 500:
            spe_count += 1
            spe_100 += 1

    else:
        rel_0 += 1
        if prediction[i]- test[i]>=-0.5 and prediction[i] - test[i] <=0.5:
            log_0 += 1
        if  (tmp_prediction >= tmp_test* 0.8 and tmp_prediction <= tmp_test*1.2) or abs(tmp_test-tmp_prediction)<= thre:
            count_0 += 1
        if tmp_prediction < 100:
            warning_0 += 1
        if tmp_prediction < 200:
            spe_count += 1
            spe_0 += 1


    if prediction[i] - test[i]>= -0.5 and prediction[i] - test[i] <= 0.5:
        count_abs += 1
    elif (tmp_test-tmp_prediction <= 0.2*tmp_test and tmp_test-tmp_prediction >=-0.2*tmp_test) or abs(tmp_test-tmp_prediction)<=thre:
        count_abs += 1

    """
    if tmp_test <= 10:
        count_0 += 1
    if tmp_test <= 50:
        count_50 += 1
    if tmp_test <= 100:
        count_100 += 1
    """
    if  tmp_prediction >= tmp_test* 0.8 and tmp_prediction <= tmp_test*1.2:
        count += 1
    elif tmp_test-tmp_prediction <= thre and tmp_test-tmp_prediction >=-thre:
        count += 1
print len(test)
print thre
print "20% error: ", count, count/float(len(test))
print "ln +- 0.5 error: ", count_abs, count_abs/float(len(test))
print "total same: ",warning_500 +warning_1000+warning_200+warning_100+warning_0, (warning_0+warning_500 +warning_1000+warning_200+warning_100)/float(len(test))
print "max test: ",max(test)
print "10 real count: ", count_0, count_0/float(len(test))
print "50 real count: ", count_50, count_50/float(len(test))
print "100 real count: ", count_100, count_100/float(len(test))
print "1000 up: ", rel_1000, count_1000,count_1000/float(rel_1000), log_1000,log_1000/float(rel_1000), warning_1000,warning_1000/float(rel_1000), spe_1000, spe_1000/float(rel_1000)
print "500 up: ", rel_500, count_500,count_500/float(rel_500), log_500,log_500/float(rel_500), warning_500,warning_500/float(rel_500), spe_500, spe_500/float(rel_500)
print "200 up: ", rel_200, count_200,count_200/float(rel_200), log_200,log_200/float(rel_200), warning_200, warning_200/float(rel_200), spe_200, spe_200/float(rel_200)
print "100 up: ", rel_100, count_100,count_100/float(rel_100), log_100,log_100/float(rel_100), warning_100,warning_100/float(rel_100), spe_100, spe_100/float(rel_100)
#print "0 up: ", rel_0, count_0,count_0/float(rel_0), log_0,log_0/float(rel_0), warning_0,warning_0/float(rel_0), spe_0, spe_0/float(rel_0)
print "special count: ", spe_count, spe_count/float(len(test))
