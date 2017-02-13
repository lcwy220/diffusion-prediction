安装igraph包
安装pinyin 0.4.0

1.寻找关键点
(1)基于pagerank



(2)基于粉丝数
执行文件：key_node_fans.py

调用函数：
get_user_fans_rank(hash_tag)

输入参数：hash_tag为事件名称

输出结果：
user_fans_rank 为一数组

[{u'sort': [289066], u'_type': u'text', u'_source': {u'comment': 51, u'uid': u'2087875965', u'sentiment': u'0', u'sensitive': 0, u'sensitive_words_string': u'', u'text': u'\u3010\u6797\u4e39\u201c\u5c0f\u4e09\u201d\u8d75\u96c5\u6dc7\u54ed\u6ce3\u9053\u6b49\uff1a\u4e0d\u662f\u7092\u4f5c \u4e0e\u6797\u4e39\u65e0\u7ecf\u6d4e\u74dc\u845b\u3011#\u6797\u4e39\u51fa\u8f68#\u4e8b\u4ef6\u5973\u4e3b\u8d75\u96c5\u6dc7\u53ec\u5f00\u5a92\u4f53\u6c9f\u901a\u4f1a\uff0c\u6d12\u6cea\u9053\u6b49\u3002\u5979\u79f0\uff0c\u6ca1\u6709\u4eba\u4f1a\u4e3a\u6210\u540d\u8fd9\u6837\u7092\u4f5c\uff1b\u8ddf\u6797\u4e39\u6ca1\u6709\u4efb\u4f55\u7ecf\u6d4e\u74dc\u845b\uff0c\u4e70\u5962\u4f88\u54c1\u3001\u4e70\u8f66\u4e70\u623f\u90fd\u4e0d\u662f\u771f\u7684\uff1b\u5185\u5fc3\u7684\u6050\u60e7\u3001\u6127\u759a\u8ba9\u4f5c\u4e3a\u5973\u6027\u7684\u6211\u7b2c\u4e00\u65f6\u95f4\u9009\u62e9\u4e86\u9003\u907f\uff1b\u771f\u5fc3\u9053\u6b49\u5e76\u63a5\u53d7\u6279\u8bc4\u3002\uff08\u8fbd\u6c88\u665a\u62a5\uff09', u'user_fansnum': 289066, u'mid': u'4044671950925069', u'keywords_string': u'\u51fa\u8f68&\u6c9f\u901a&\u7b2c\u4e00&\u5185\u5fc3&\u6279\u8bc4&\u65f6\u95f4&\u4e8b\u4ef6&\u6127\u759a&\u9009\u62e9&\u4e70\u8f66&\u5973\u6027&\u6797\u4e39&\u6210\u540d&\u53ec\u5f00&\u5962\u4f88\u54c1&\u8d75\u96c5\u6dc7&\u74dc\u845b&\u8fbd\u6c88\u665a\u62a5&\u771f\u5fc3&\u6d12\u6cea&\u7ecf\u6d4e&\u5c0f\u4e09&\u54ed\u6ce3&\u5a92\u4f53&\u4e70\u623f&\u9053\u6b49&\u6050\u60e7', u'sensitive_words_dict': u'{}', u'ip': u'124.42.72.125', u'timestamp': 1479808402, u'keywords_dict': u'{"\\u51fa\\u8f68": 1, "\\u6c9f\\u901a": 1, "\\u7b2c\\u4e00": 1, "\\u5185\\u5fc3": 1, "\\u6279\\u8bc4": 1, "\\u65f6\\u95f4": 1, "\\u4e8b\\u4ef6": 1, "\\u6127\\u759a": 1, "\\u9009\\u62e9": 1, "\\u4e70\\u8f66": 1, "\\u5973\\u6027": 1, "\\u6797\\u4e39": 4, "\\u6210\\u540d": 1, "\\u53ec\\u5f00": 1, "\\u5962\\u4f88\\u54c1": 1, "\\u8d75\\u96c5\\u6dc7": 2, "\\u74dc\\u845b": 2, "\\u8fbd\\u6c88\\u665a\\u62a5": 1, "\\u771f\\u5fc3": 1, "\\u6d12\\u6cea": 1, "\\u7ecf\\u6d4e": 2, "\\u5c0f\\u4e09": 1, "\\u54ed\\u6ce3": 1, "\\u5a92\\u4f53": 1, "\\u4e70\\u623f": 1, "\\u9053\\u6b49": 3, "\\u6050\\u60e7": 1}', u'geo': u'\u4e2d\u56fd&\u5317\u4eac&\u5317\u4eac', u'event': u'\u8d75\u96c5\u6dc7\u6d12\u6cea\u9053\u6b49', u'retweeted': 5, u'message_type': 1}, u'_score': None, u'_index': u'event', u'_id': u'4044671950925069'}]




(3)基于负面情绪微博中粉丝数最大的用户

执行文件：key_node_negtive.py

调用函数：
get_negtive_user_fans_rank(hash_tag)

输入参数：hash_tag为事件名称

输出结果：
negtive_user_fans_rank 为一数组

[{u'sort': [289066], u'_type': u'text', u'_source': {u'comment': 51, u'uid': u'2087875965', u'sentiment': u'0', u'sensitive': 0, u'sensitive_words_string': u'', u'text': u'\u3010\u6797\u4e39\u201c\u5c0f\u4e09\u201d\u8d75\u96c5\u6dc7\u54ed\u6ce3\u9053\u6b49\uff1a\u4e0d\u662f\u7092\u4f5c \u4e0e\u6797\u4e39\u65e0\u7ecf\u6d4e\u74dc\u845b\u3011#\u6797\u4e39\u51fa\u8f68#\u4e8b\u4ef6\u5973\u4e3b\u8d75\u96c5\u6dc7\u53ec\u5f00\u5a92\u4f53\u6c9f\u901a\u4f1a\uff0c\u6d12\u6cea\u9053\u6b49\u3002\u5979\u79f0\uff0c\u6ca1\u6709\u4eba\u4f1a\u4e3a\u6210\u540d\u8fd9\u6837\u7092\u4f5c\uff1b\u8ddf\u6797\u4e39\u6ca1\u6709\u4efb\u4f55\u7ecf\u6d4e\u74dc\u845b\uff0c\u4e70\u5962\u4f88\u54c1\u3001\u4e70\u8f66\u4e70\u623f\u90fd\u4e0d\u662f\u771f\u7684\uff1b\u5185\u5fc3\u7684\u6050\u60e7\u3001\u6127\u759a\u8ba9\u4f5c\u4e3a\u5973\u6027\u7684\u6211\u7b2c\u4e00\u65f6\u95f4\u9009\u62e9\u4e86\u9003\u907f\uff1b\u771f\u5fc3\u9053\u6b49\u5e76\u63a5\u53d7\u6279\u8bc4\u3002\uff08\u8fbd\u6c88\u665a\u62a5\uff09', u'user_fansnum': 289066, u'mid': u'4044671950925069', u'keywords_string': u'\u51fa\u8f68&\u6c9f\u901a&\u7b2c\u4e00&\u5185\u5fc3&\u6279\u8bc4&\u65f6\u95f4&\u4e8b\u4ef6&\u6127\u759a&\u9009\u62e9&\u4e70\u8f66&\u5973\u6027&\u6797\u4e39&\u6210\u540d&\u53ec\u5f00&\u5962\u4f88\u54c1&\u8d75\u96c5\u6dc7&\u74dc\u845b&\u8fbd\u6c88\u665a\u62a5&\u771f\u5fc3&\u6d12\u6cea&\u7ecf\u6d4e&\u5c0f\u4e09&\u54ed\u6ce3&\u5a92\u4f53&\u4e70\u623f&\u9053\u6b49&\u6050\u60e7', u'sensitive_words_dict': u'{}', u'ip': u'124.42.72.125', u'timestamp': 1479808402, u'keywords_dict': u'{"\\u51fa\\u8f68": 1, "\\u6c9f\\u901a": 1, "\\u7b2c\\u4e00": 1, "\\u5185\\u5fc3": 1, "\\u6279\\u8bc4": 1, "\\u65f6\\u95f4": 1, "\\u4e8b\\u4ef6": 1, "\\u6127\\u759a": 1, "\\u9009\\u62e9": 1, "\\u4e70\\u8f66": 1, "\\u5973\\u6027": 1, "\\u6797\\u4e39": 4, "\\u6210\\u540d": 1, "\\u53ec\\u5f00": 1, "\\u5962\\u4f88\\u54c1": 1, "\\u8d75\\u96c5\\u6dc7": 2, "\\u74dc\\u845b": 2, "\\u8fbd\\u6c88\\u665a\\u62a5": 1, "\\u771f\\u5fc3": 1, "\\u6d12\\u6cea": 1, "\\u7ecf\\u6d4e": 2, "\\u5c0f\\u4e09": 1, "\\u54ed\\u6ce3": 1, "\\u5a92\\u4f53": 1, "\\u4e70\\u623f": 1, "\\u9053\\u6b49": 3, "\\u6050\\u60e7": 1}', u'geo': u'\u4e2d\u56fd&\u5317\u4eac&\u5317\u4eac', u'event': u'\u8d75\u96c5\u6dc7\u6d12\u6cea\u9053\u6b49', u'retweeted': 5, u'message_type': 1}, u'_score': None, u'_index': u'event', u'_id': u'4044671950925069'}]



(4)基于敏感度及影响力较大的用户

执行文件：key_node_sensitive.py

调用函数：
get_sensitive_user_fans_rank(hash_tag)

输入参数：hash_tag为事件名称

输出结果：
sensitive_user_fans_rank 为一数组

[{u'sort': [289066], u'_type': u'text', u'_source': {u'comment': 51, u'uid': u'2087875965', u'sentiment': u'0', u'sensitive': 0, u'sensitive_words_string': u'', u'text': u'\u3010\u6797\u4e39\u201c\u5c0f\u4e09\u201d\u8d75\u96c5\u6dc7\u54ed\u6ce3\u9053\u6b49\uff1a\u4e0d\u662f\u7092\u4f5c \u4e0e\u6797\u4e39\u65e0\u7ecf\u6d4e\u74dc\u845b\u3011#\u6797\u4e39\u51fa\u8f68#\u4e8b\u4ef6\u5973\u4e3b\u8d75\u96c5\u6dc7\u53ec\u5f00\u5a92\u4f53\u6c9f\u901a\u4f1a\uff0c\u6d12\u6cea\u9053\u6b49\u3002\u5979\u79f0\uff0c\u6ca1\u6709\u4eba\u4f1a\u4e3a\u6210\u540d\u8fd9\u6837\u7092\u4f5c\uff1b\u8ddf\u6797\u4e39\u6ca1\u6709\u4efb\u4f55\u7ecf\u6d4e\u74dc\u845b\uff0c\u4e70\u5962\u4f88\u54c1\u3001\u4e70\u8f66\u4e70\u623f\u90fd\u4e0d\u662f\u771f\u7684\uff1b\u5185\u5fc3\u7684\u6050\u60e7\u3001\u6127\u759a\u8ba9\u4f5c\u4e3a\u5973\u6027\u7684\u6211\u7b2c\u4e00\u65f6\u95f4\u9009\u62e9\u4e86\u9003\u907f\uff1b\u771f\u5fc3\u9053\u6b49\u5e76\u63a5\u53d7\u6279\u8bc4\u3002\uff08\u8fbd\u6c88\u665a\u62a5\uff09', u'user_fansnum': 289066, u'mid': u'4044671950925069', u'keywords_string': u'\u51fa\u8f68&\u6c9f\u901a&\u7b2c\u4e00&\u5185\u5fc3&\u6279\u8bc4&\u65f6\u95f4&\u4e8b\u4ef6&\u6127\u759a&\u9009\u62e9&\u4e70\u8f66&\u5973\u6027&\u6797\u4e39&\u6210\u540d&\u53ec\u5f00&\u5962\u4f88\u54c1&\u8d75\u96c5\u6dc7&\u74dc\u845b&\u8fbd\u6c88\u665a\u62a5&\u771f\u5fc3&\u6d12\u6cea&\u7ecf\u6d4e&\u5c0f\u4e09&\u54ed\u6ce3&\u5a92\u4f53&\u4e70\u623f&\u9053\u6b49&\u6050\u60e7', u'sensitive_words_dict': u'{}', u'ip': u'124.42.72.125', u'timestamp': 1479808402, u'keywords_dict': u'{"\\u51fa\\u8f68": 1, "\\u6c9f\\u901a": 1, "\\u7b2c\\u4e00": 1, "\\u5185\\u5fc3": 1, "\\u6279\\u8bc4": 1, "\\u65f6\\u95f4": 1, "\\u4e8b\\u4ef6": 1, "\\u6127\\u759a": 1, "\\u9009\\u62e9": 1, "\\u4e70\\u8f66": 1, "\\u5973\\u6027": 1, "\\u6797\\u4e39": 4, "\\u6210\\u540d": 1, "\\u53ec\\u5f00": 1, "\\u5962\\u4f88\\u54c1": 1, "\\u8d75\\u96c5\\u6dc7": 2, "\\u74dc\\u845b": 2, "\\u8fbd\\u6c88\\u665a\\u62a5": 1, "\\u771f\\u5fc3": 1, "\\u6d12\\u6cea": 1, "\\u7ecf\\u6d4e": 2, "\\u5c0f\\u4e09": 1, "\\u54ed\\u6ce3": 1, "\\u5a92\\u4f53": 1, "\\u4e70\\u623f": 1, "\\u9053\\u6b49": 3, "\\u6050\\u60e7": 1}', u'geo': u'\u4e2d\u56fd&\u5317\u4eac&\u5317\u4eac', u'event': u'\u8d75\u96c5\u6dc7\u6d12\u6cea\u9053\u6b49', u'retweeted': 5, u'message_type': 1}, u'_score': None, u'_index': u'event', u'_id': u'4044671950925069'}]



2.寻找关键微博

(1)转发量最大的微博

执行文件：key_mblog_retweet.py

调用函数：
get_mblog_retweet_rank(hash_tag)

输入参数：hash_tag为事件名称

输出结果：
mblog_retweet_rank 为一数组

[{u'sort': [289066], u'_type': u'text', u'_source': {u'comment': 51, u'uid': u'2087875965', u'sentiment': u'0', u'sensitive': 0, u'sensitive_words_string': u'', u'text': u'\u3010\u6797\u4e39\u201c\u5c0f\u4e09\u201d\u8d75\u96c5\u6dc7\u54ed\u6ce3\u9053\u6b49\uff1a\u4e0d\u662f\u7092\u4f5c \u4e0e\u6797\u4e39\u65e0\u7ecf\u6d4e\u74dc\u845b\u3011#\u6797\u4e39\u51fa\u8f68#\u4e8b\u4ef6\u5973\u4e3b\u8d75\u96c5\u6dc7\u53ec\u5f00\u5a92\u4f53\u6c9f\u901a\u4f1a\uff0c\u6d12\u6cea\u9053\u6b49\u3002\u5979\u79f0\uff0c\u6ca1\u6709\u4eba\u4f1a\u4e3a\u6210\u540d\u8fd9\u6837\u7092\u4f5c\uff1b\u8ddf\u6797\u4e39\u6ca1\u6709\u4efb\u4f55\u7ecf\u6d4e\u74dc\u845b\uff0c\u4e70\u5962\u4f88\u54c1\u3001\u4e70\u8f66\u4e70\u623f\u90fd\u4e0d\u662f\u771f\u7684\uff1b\u5185\u5fc3\u7684\u6050\u60e7\u3001\u6127\u759a\u8ba9\u4f5c\u4e3a\u5973\u6027\u7684\u6211\u7b2c\u4e00\u65f6\u95f4\u9009\u62e9\u4e86\u9003\u907f\uff1b\u771f\u5fc3\u9053\u6b49\u5e76\u63a5\u53d7\u6279\u8bc4\u3002\uff08\u8fbd\u6c88\u665a\u62a5\uff09', u'user_fansnum': 289066, u'mid': u'4044671950925069', u'keywords_string': u'\u51fa\u8f68&\u6c9f\u901a&\u7b2c\u4e00&\u5185\u5fc3&\u6279\u8bc4&\u65f6\u95f4&\u4e8b\u4ef6&\u6127\u759a&\u9009\u62e9&\u4e70\u8f66&\u5973\u6027&\u6797\u4e39&\u6210\u540d&\u53ec\u5f00&\u5962\u4f88\u54c1&\u8d75\u96c5\u6dc7&\u74dc\u845b&\u8fbd\u6c88\u665a\u62a5&\u771f\u5fc3&\u6d12\u6cea&\u7ecf\u6d4e&\u5c0f\u4e09&\u54ed\u6ce3&\u5a92\u4f53&\u4e70\u623f&\u9053\u6b49&\u6050\u60e7', u'sensitive_words_dict': u'{}', u'ip': u'124.42.72.125', u'timestamp': 1479808402, u'keywords_dict': u'{"\\u51fa\\u8f68": 1, "\\u6c9f\\u901a": 1, "\\u7b2c\\u4e00": 1, "\\u5185\\u5fc3": 1, "\\u6279\\u8bc4": 1, "\\u65f6\\u95f4": 1, "\\u4e8b\\u4ef6": 1, "\\u6127\\u759a": 1, "\\u9009\\u62e9": 1, "\\u4e70\\u8f66": 1, "\\u5973\\u6027": 1, "\\u6797\\u4e39": 4, "\\u6210\\u540d": 1, "\\u53ec\\u5f00": 1, "\\u5962\\u4f88\\u54c1": 1, "\\u8d75\\u96c5\\u6dc7": 2, "\\u74dc\\u845b": 2, "\\u8fbd\\u6c88\\u665a\\u62a5": 1, "\\u771f\\u5fc3": 1, "\\u6d12\\u6cea": 1, "\\u7ecf\\u6d4e": 2, "\\u5c0f\\u4e09": 1, "\\u54ed\\u6ce3": 1, "\\u5a92\\u4f53": 1, "\\u4e70\\u623f": 1, "\\u9053\\u6b49": 3, "\\u6050\\u60e7": 1}', u'geo': u'\u4e2d\u56fd&\u5317\u4eac&\u5317\u4eac', u'event': u'\u8d75\u96c5\u6dc7\u6d12\u6cea\u9053\u6b49', u'retweeted': 5, u'message_type': 1}, u'_score': None, u'_index': u'event', u'_id': u'4044671950925069'}]



(2)负面情绪转发量最大的微博

执行文件：key_mblog_retweet_negtive.py

调用函数：
get_negtive_mblog_retweet_rank(hash_tag)

输入参数：hash_tag为事件名称

输出结果：
negtive_mblog_retweet_rank 为一数组

[{u'sort': [289066], u'_type': u'text', u'_source': {u'comment': 51, u'uid': u'2087875965', u'sentiment': u'0', u'sensitive': 0, u'sensitive_words_string': u'', u'text': u'\u3010\u6797\u4e39\u201c\u5c0f\u4e09\u201d\u8d75\u96c5\u6dc7\u54ed\u6ce3\u9053\u6b49\uff1a\u4e0d\u662f\u7092\u4f5c \u4e0e\u6797\u4e39\u65e0\u7ecf\u6d4e\u74dc\u845b\u3011#\u6797\u4e39\u51fa\u8f68#\u4e8b\u4ef6\u5973\u4e3b\u8d75\u96c5\u6dc7\u53ec\u5f00\u5a92\u4f53\u6c9f\u901a\u4f1a\uff0c\u6d12\u6cea\u9053\u6b49\u3002\u5979\u79f0\uff0c\u6ca1\u6709\u4eba\u4f1a\u4e3a\u6210\u540d\u8fd9\u6837\u7092\u4f5c\uff1b\u8ddf\u6797\u4e39\u6ca1\u6709\u4efb\u4f55\u7ecf\u6d4e\u74dc\u845b\uff0c\u4e70\u5962\u4f88\u54c1\u3001\u4e70\u8f66\u4e70\u623f\u90fd\u4e0d\u662f\u771f\u7684\uff1b\u5185\u5fc3\u7684\u6050\u60e7\u3001\u6127\u759a\u8ba9\u4f5c\u4e3a\u5973\u6027\u7684\u6211\u7b2c\u4e00\u65f6\u95f4\u9009\u62e9\u4e86\u9003\u907f\uff1b\u771f\u5fc3\u9053\u6b49\u5e76\u63a5\u53d7\u6279\u8bc4\u3002\uff08\u8fbd\u6c88\u665a\u62a5\uff09', u'user_fansnum': 289066, u'mid': u'4044671950925069', u'keywords_string': u'\u51fa\u8f68&\u6c9f\u901a&\u7b2c\u4e00&\u5185\u5fc3&\u6279\u8bc4&\u65f6\u95f4&\u4e8b\u4ef6&\u6127\u759a&\u9009\u62e9&\u4e70\u8f66&\u5973\u6027&\u6797\u4e39&\u6210\u540d&\u53ec\u5f00&\u5962\u4f88\u54c1&\u8d75\u96c5\u6dc7&\u74dc\u845b&\u8fbd\u6c88\u665a\u62a5&\u771f\u5fc3&\u6d12\u6cea&\u7ecf\u6d4e&\u5c0f\u4e09&\u54ed\u6ce3&\u5a92\u4f53&\u4e70\u623f&\u9053\u6b49&\u6050\u60e7', u'sensitive_words_dict': u'{}', u'ip': u'124.42.72.125', u'timestamp': 1479808402, u'keywords_dict': u'{"\\u51fa\\u8f68": 1, "\\u6c9f\\u901a": 1, "\\u7b2c\\u4e00": 1, "\\u5185\\u5fc3": 1, "\\u6279\\u8bc4": 1, "\\u65f6\\u95f4": 1, "\\u4e8b\\u4ef6": 1, "\\u6127\\u759a": 1, "\\u9009\\u62e9": 1, "\\u4e70\\u8f66": 1, "\\u5973\\u6027": 1, "\\u6797\\u4e39": 4, "\\u6210\\u540d": 1, "\\u53ec\\u5f00": 1, "\\u5962\\u4f88\\u54c1": 1, "\\u8d75\\u96c5\\u6dc7": 2, "\\u74dc\\u845b": 2, "\\u8fbd\\u6c88\\u665a\\u62a5": 1, "\\u771f\\u5fc3": 1, "\\u6d12\\u6cea": 1, "\\u7ecf\\u6d4e": 2, "\\u5c0f\\u4e09": 1, "\\u54ed\\u6ce3": 1, "\\u5a92\\u4f53": 1, "\\u4e70\\u623f": 1, "\\u9053\\u6b49": 3, "\\u6050\\u60e7": 1}', u'geo': u'\u4e2d\u56fd&\u5317\u4eac&\u5317\u4eac', u'event': u'\u8d75\u96c5\u6dc7\u6d12\u6cea\u9053\u6b49', u'retweeted': 5, u'message_type': 1}, u'_score': None, u'_index': u'event', u'_id': u'4044671950925069'}]





3.寻找关键边

文件：key_edge.py

调用函数：
compute_key_edge(hash_tag)

输入参数：hash_tag为事件名称


输出结果：

返回关键边集合：

{(85, 68): [[(u'1642591402', u'5614460264', 0.00023356300362022657), (u'1642591402', u'1405634855', 0.00023356300362022657), (u'1642591402', u'1858037672', 0.00023356300362022657), (u'1642591402', u'1842342703', 0.00023356300362022657), (u'1642591402', u'1056897511', 0.00023356300362022657), (u'1642591402', u'1921699045', 0.00023356300362022657)]]}

说明：（85,68）表示社区85和社区68，(u'1642591402', u'5614460264', 0.00023356300362022657)中1642591402和5614460264表示用户id,0.00023356300362022657表示s_ij值

其他说明：正式使用时把函数开头部分对hash_tag赋的特定值注释掉。



4.信息传播最大化，寻找weak nodes

文件：

调用函数：start_ci(filename,L)

输入参数：filename为数据文件名，L为半径


输出结果：

输出Influencers.txt文件，格式如下：

1 12979 8903

2 4781 1592

3 8418 934

4 1524 434

5 12167 339

6 13586 415

7 10660 229

第一列表示Rank,第二列表示Node_ID，第三列表示Degree
