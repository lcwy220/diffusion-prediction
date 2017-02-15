# -*-coding:utf-8-*-

from sklearn import cross_validation
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.ensemble import GradientBoostingRegressor
from sklearn import metrics

import math
import json
import redis
import pickle

K = 10

def train_gbdt():
    
    topic_field_dict = {'art':1,'computer':2,'economic':3, \
                    'education':4,'environment':5, 'medicine':6,\
                    'military':7,'politics':8,'sports':9,\
                    'traffic':10,'life':11,'anti-corruption':12,\
                    'employment':13,'fear-of-violence':14,\
                    'house':15,'law':16,'peace':17,\
                    'religion':18,'social-security':19,'null':20}

    gbdt=GradientBoostingRegressor(
              loss='ls'
              , learning_rate=0.1
              , n_estimators=200 #2000
              , subsample=1
              , min_samples_split=2
              , min_samples_leaf=1
              , max_depth=8  #5
              , init=None
              , random_state=None
              , max_features=None
              , alpha=0.9  #0.9
              , verbose=0
              , max_leaf_nodes=None
              , warm_start=False
              )
    training_data = []
    '''
    #event-1228
    with open("0116_005_feature_delete2_1228.txt") as f:
        for line in f:
            line_list = line.split('\t')
            #for i in range(2):
            for i in range(1):  #004 一个领域
                line_list[i] =  topic_field_dict[line_list[i]]
            training_data.append(line_list)
    print 'training_data_1',len(training_data)   
    
    #event-0103
    with open("0116_005_feature_delete2_0103.txt") as f:
        for line in f:
            line_list = line.split('\t')
            #for i in range(2):
            for i in range(1):  #004 一个领域
                line_list[i] =  topic_field_dict[line_list[i]]
            training_data.append(line_list)        
    print 'training_data_2:::',len(training_data)
    '''
    #event-0116
    with open("0119_005_feature_delete2_0116.txt") as f:
        for line in f:
            line_list = line.split('\t')
            #for i in range(2):
            for i in range(1):  #004 一个领域
                line_list[i] =  topic_field_dict[line_list[i]]
            training_data.append(line_list)
    print 'training_data_1',len(training_data)   
    
    traing_value = []
    
    '''
    #event-1228
    with open("0116_005_truth_delete2_1228.txt") as f:
        for line in f:
            line = line.strip()
            #print 'line::',line
            #traing_value.append(math.log(float(line)+1))
            traing_value.append(float(line)+1)
    
    #event-0103        
    with open("0116_005_truth_delete2_0103.txt") as f:
        for line in f:
            line = line.strip()
            #print 'line::',line
            #traing_value.append(math.log(float(line)+1))
            traing_value.append(float(line)+1)
    '''
    #event-0116
    with open("0119_005_truth_delete2_0116.txt") as f:
        for line in f:
            line = line.strip()
            #print 'line::',line
            #traing_value.append(math.log(float(line)+1))
            traing_value.append(float(line)+1)
    X_train, X_test, y_train, y_test = cross_validation.train_test_split(training_data, traing_value, test_size=0.20, random_state=0)
    gbdt.fit(X_train, y_train)
    print "test: ", len(y_test)
    print "train: ", len(y_train)


    pred = gbdt.predict(X_test)
    ratio = []
    prediction = []
    for i in range(len(y_test)):
        #if pred[i] <= 0:
         #   pred[i] = 0
        prediction.append(pred[i])
        #if int(y_test[i]) == 0:
         #   iter_ratio = 0
        #else:
        #iter_ratio = (math.exp(pred[i])-math.exp(y_test[i]))/math.exp(y_test[i])
        iter_ratio = (pred[i]-y_test[i])/y_test[i]
        ratio.append(iter_ratio)
    print ratio

    print 'gbdt.feature_importances_:::',gbdt.feature_importances_
    with open("all_result_1000_5.txt","w") as f:
        f.write(json.dumps(ratio))
    with open("all_result_1000_5_value.txt","w") as f:
        f.write(json.dumps(y_test))
    with open("all_result_1000_5_predicton.txt","w") as f:
        f.write(json.dumps(prediction))

    #把模型存到硬盘
    with open("macro-prediction-value.pkl" ,"wb") as f:
        pickle.dump(gbdt, f)
    

if __name__ == "__main__":
    train_gbdt()


