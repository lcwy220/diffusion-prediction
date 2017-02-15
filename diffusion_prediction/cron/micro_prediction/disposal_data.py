# -*-coding:utf-8-*-
import math
import sys
import json
import numpy as np


def read_data():

    thre = 12
    ss = open("feature-0108-%s.txt" %thre, "w")
    tt = open("value-0108-%s.txt" %thre, "w")
    count = 1
    feature_list = []
    feature_value = []
    with open("feature_data.txt","r") as f:
        for line in f:
            feature_list = json.loads(line.strip())
    with open("value_data.txt","r") as f:
        for line in f:
            feature_value = json.loads(line.strip())
    for i in range(len(feature_value)):
        tmp_feature = feature_list[i]
        tmp_value = feature_value[i]
        feature_len = len(tmp_feature[0])
        if feature_len-1 >= thre:
            for j in range(thre, feature_len-1):
                single_feature = []
                single_feature.append(j)
                tmp_total = tmp_feature[-3]
                single_feature.append(tmp_total[-1]+tmp_total[-3]-2*tmp_total[-2])
                for each in tmp_feature[0][j-thre:j]:
                    single_feature.append(math.log(int(each)+1)) 
                for each in tmp_feature[8][j-thre:j]:
                    single_feature.append(math.log(int(each)+1))
                for each in tmp_feature[10][j-thre:j]:
                    single_feature.append(math.log(int(each)+1))
                count_item = 0
                for item in tmp_feature:
                    count_item += 1
                    if count_item in set([1,9,11]):
                        continue
                    elif count_item in set([2,3,4]):
                        each_total_list = tmp_feature[-3][j-thre:j]
                        for each in item[j-thre:j]:
                            each_index = item[j-thre:j].index(each)
                            single_feature.append(math.log(float(each)+1))
                            single_feature.append(float(each)/(1+each_total_list[each_index]))
                    else:
                        single_feature.extend(item[j-thre: j])
                if tmp_value[j+1] >= 100:
                    ss.write(json.dumps(single_feature)+'\n')
                    tt.write(str(tmp_value[j+1])+'\n')
    ss.close()
    tt.close()


if __name__ == "__main__":
    read_data()




