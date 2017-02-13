# -*-coding:utf-8-*-

# from task es create scan task
# create index with event name

from event_text_mappings import get_mappings
import sys
reload(sys)
sys.path.append('../../')
from global_utils import es_prediction
from global_config import index_manage_micro_task, index_type_micro_task

def create_task():
    



