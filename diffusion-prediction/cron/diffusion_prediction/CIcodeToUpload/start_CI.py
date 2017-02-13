#!/usr/bin/python
# -*- coding: <encoding name> -*-
import time
import sys,os,subprocess,commands
from subprocess import Popen,PIPE
def start_ci(filename,L):
    print 'start_CI:',time.ctime()
    L = str(L)
    command_popen = './CI'+' '+filename+' '+L
    print 'command_popen',command_popen
    p2 = Popen(command_popen,shell=True,stdout=PIPE)
    result = p2.stdout.read()
    #print "out:",result
    print 'end_CI:',time.ctime()
    return result

