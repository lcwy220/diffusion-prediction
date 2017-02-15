import pinyin

def ch2pinyin(chinese_name):
	
	pinyin_name = pinyin.get(chinese_name, format="strip", delimiter="_")

	return pinyin_name