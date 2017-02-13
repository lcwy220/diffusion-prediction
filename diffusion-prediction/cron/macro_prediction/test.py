# -*-coding:utf-8-*-
'''
import IP
import argparse

from IP import find

def main():
    #parser = argparse.ArgumentParser()
    #parser.add_argument("ip",help = "ip or domain")
    #args = parser.parse_args()
    ip = '117.190.225.208'
    #if not args.ip:
#	return
    print(find(ip).encode("utf-8"))

if __name__ == '__main__':
    main()

'''

import requests
  
def lookup(ip):
  
  URL = 'http://freeipapi.17mon.cn/' + ip
  #try:
  r = requests.get(URL, timeout=3)
#  except requests.RequestException as e:
 #   print(e)
  
  json_data = r.json()
  print '所在国家：' + json_data[0].encode('utf-8')
  print '所在省份：' + json_data[1].encode('utf-8')
  print '所在城市：' + json_data[2].encode('utf-8')
  return(ip)
  
ip='117.190.225.208'
lookup(ip)


