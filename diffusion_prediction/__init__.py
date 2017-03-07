# -*- coding: utf-8 -*-

from flask import Flask
from elasticsearch import Elasticsearch
from flask_debugtoolbar import DebugToolbarExtension
from diffusion_prediction.extensions import admin
from diffusion_prediction.jinja import gender, tsfmt, Int2string, gender_text, user_email, user_location, user_birth, user_vertify, weibo_source
from diffusion_prediction.social_sensing.views import mod as socialsensingModule
from diffusion_prediction.prediction.views import mod as predictionModule
from diffusion_prediction.manage.views import mod as manageModule
from diffusion_prediction.interfere.views import mod as interfereModule
#import sys
#reload(sys)
#sys.setdefaultencoding('utf-8')
from diffusion_prediction.event_analysis.topic_time_analyze.views import mod as topicTimeModule
from diffusion_prediction.event_analysis.topic_geo_analyze.views import mod as topicGeoModule
from diffusion_prediction.event_analysis.topic_network_analyze.views import mod as topicNetworkModule
from diffusion_prediction.event_analysis.topic_sen_analyze.views import mod as topicSenModule
from diffusion_prediction.event_analysis.topic_language_analyze.views import mod as topicLanguageModule

def create_app():
    app = Flask(__name__)

    register_blueprints(app)
    register_extensions(app)
    register_jinja_funcs(app)

    # Create modules
    app.register_blueprint(socialsensingModule)
    app.register_blueprint(predictionModule)
    app.register_blueprint(manageModule)
    app.register_blueprint(interfereModule)
    app.register_blueprint(topicTimeModule)
    app.register_blueprint(topicGeoModule)
    app.register_blueprint(topicNetworkModule)
    app.register_blueprint(topicSenModule)
    app.register_blueprint(topicLanguageModule)
    # the debug toolbar is only enabled in debug mode
    app.config['DEBUG'] = True


    app.config['ADMINS'] = frozenset(['youremail@yourdomain.com'])
    app.config['SECRET_KEY'] = 'SecretKeyForSessionSigning'
    
    '''
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqldb://%s:@%s/%s?charset=utf8' % (MYSQL_USER, MYSQL_HOST, MYSQL_DB)
    app.config['SQLALCHEMY_ECHO'] = False
    '''
    app.config['DATABASE_CONNECT_OPTIONS'] = {}

    app.config['THREADS_PER_PAGE'] = 8

    app.config['CSRF_ENABLED'] = True
    app.config['CSRF_SESSION_KEY'] = 'somethingimpossibletoguess'

    # Enable the toolbar?
    app.config['DEBUG_TB_ENABLED'] = app.debug
    # Should intercept redirects?
    app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = True
    # Enable the profiler on all requests, default to false
    app.config['DEBUG_TB_PROFILER_ENABLED'] = True
    # Enable the template editor, default to false
    app.config['DEBUG_TB_TEMPLATE_EDITOR_ENABLED'] = True
    
    # debug toolbar
    # toolbar = DebugToolbarExtension(app)
    
    '''
    app.config['MONGO_HOST'] = MONGODB_HOST
    app.config['MONGO_PORT'] = MONGODB_PORT

    app.config['MONGODB_SETTINGS'] = {
        'db': MASTER_TIMELINE_54API_WEIBO_DB,
        'host': MONGODB_HOST,
        'port': MONGODB_PORT
    }

    # Create mysql database
    db.init_app(app)
    with app.test_request_context():
        db.create_all()

    # Create mongo_engine
    mongo_engine.init_app(app)

    admin.init_app(app)
    """
    # Create mysql database admin, visit via url: http://HOST:PORT/admin/
    for m in model.__all__:
        m = getattr(model, m)
        n = m._name()
        admin.add_view(SQLModelView(m, db.session, name=n))

    for m in mongodb_model.__all__:
        admin.add_view(MongoDBView(m))
    """

    # init mongo
    mongo.init_app(app)
    '''
    return app
   

def register_blueprints(app):
    app.register_blueprint(socialsensingModule)
    app.register_blueprint(manageModule)
    app.register_blueprint(predictionModule)
    
    #app.register_blueprint(interfereModule)

def register_extensions(app):
    app.config.setdefault('ES_URL', 'http://219.224.134.216:9202/')
    app.extensions['es_prediction'] = Elasticsearch(app.config['ES_URL'])

def register_jinja_funcs(app):
    funcs = dict(gender=gender,
                 tsfmt=tsfmt,
                 int2string=Int2string,
                 gender_text=gender_text,
                 user_email=user_email,
                 user_location=user_location,
                 user_birth=user_birth,
                 user_vertify=user_vertify,
                 weibo_source=weibo_source)
    app.jinja_env.globals.update(funcs)
