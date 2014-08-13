import datetime
import os
import jwt
import json
import requests
from urlparse import parse_qsl
from flask import Flask, send_file, request, make_response, g, redirect, \
    url_for, abort, jsonify
from flask.ext.sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

# TODO: refactor and break apart code into modules

# Configuration

DATABASE = '/tmp/flaskr.db'
DEBUG = True
SECRET_KEY = 'development key'
USERNAME = 'admin'
PASSWORD = 'default'
TOKEN_SECRET = 'keyboard cat'
FACEBOOK_SECRET = '298fb6c080fda239b809ae418bf49700'
GOOGLE_SECRET = 'xGxxgKAObIRUwOKycySkL9Fi'
LINKEDIN_SECRET = '7bDltzdHlP9b42xy'
TWITTER_CONSUMER_KEY = 'vdrg4sqxyTPSRdJHKu4UVVdeD'
TWITTER_CONSUMER_SECRET = 'cUIobhRgRlXsFyObUMg3tBq56EgGSwabmcavQP4fncABvotRMA'
TWITTER_CALLBACK_URL = 'http://localhost:3000'
SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'

client_dir = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', '..', 'client'))

app = Flask(__name__, static_url_path='', static_folder=client_dir)
app.config.from_object(__name__)

# Database and User Model

db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True)
    password = db.Column(db.String(120))
    first_name = db.Column(db.String(120))
    last_name = db.Column(db.String(120))
    facebook = db.Column(db.String(120))
    google = db.Column(db.String(120))
    linkedin = db.Column(db.String(120))
    twitter = db.Column(db.String(120))

    def __init__(self, email=None, password=None, first_name=None,
                 last_name=None, facebook=None, google=None,
                 linkedin=None, twitter=None):
        if email:
            self.email = email.lower()
        if password:
            self.set_password(password)
        if first_name:
            self.first_name = first_name
        if last_name:
            self.last_name = last_name
        if facebook:
            self.facebook = facebook
        if google:
            self.google = google
        if linkedin:
            self.linkedin = linkedin
        if twitter:
            self.twitter = twitter

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)


db.create_all()

# Routes

@app.route('/')
def index():
    return send_file('../../client/index.html')


@app.route('/api/me')
def me():
    users = User.query.all()
    return jsonify(users)


@app.route('/auth/login', methods=['POST'])
def login():
    user = User.query.filter_by(email=request.json['email']).first()
    if not user or not user.check_password(request.json['password']):
        response = jsonify(message='Wrong Email or Password')
        response.status_code = 401
        return response
    token = create_jwt_token(user)
    return jsonify(token=token)


@app.route('/auth/signup', methods=['POST'])
def signup():
    u = User(email=request.json['email'],
             password=request.json['password'])
    db.session.add(u)
    db.session.commit()
    return 'OK'


def create_jwt_token(user):
    payload = dict(
        iat=datetime.datetime.now(),
        exp=datetime.datetime.now() + datetime.timedelta(days=7),
        user=dict(
            id=user.id,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            facebook=user.facebook,
            google=user.google,
            linkedin=user.linkedin,
            twitter=user.twitter
        )
    )
    token = jwt.encode(payload, app.config['TOKEN_SECRET'])
    return token


@app.route('/auth/facebook', methods=['POST'])
def facebook():
    access_token_url = 'https://graph.facebook.com/oauth/access_token'
    graph_api_url = 'https://graph.facebook.com/me'

    params = dict(client_id=request.json['clientId'],
                  redirect_uri=request.json['redirectUri'],
                  client_secret=app.config['FACEBOOK_SECRET'],
                  code=request.json['code'])

    # Step 1. Exchange authorization code for access token.
    r = requests.get(access_token_url, params=params)
    access_token = dict(parse_qsl(r.text))

    # Step 2. Retrieve information about the current user.
    r = requests.get(graph_api_url, params=access_token)
    profile = json.loads(r.text)
    user = User.query.filter_by(facebook=profile['id']).first()
    if user:
        token = create_jwt_token(user)
        return jsonify(token=token)
    u = User(facebook=profile['id'],
             first_name=profile['first_name'],
             last_name=profile['last_name'])
    db.session.add(u)
    db.session.commit()
    token = create_jwt_token(u)
    return jsonify(token=token)


@app.route('/auth/google', methods=['POST'])
def google():
    pass


@app.route('/auth/linkedin', methods=['POST'])
def linkedin():
    pass


@app.route('/auth/twitter')
def twitter():
    pass


if __name__ == '__main__':
    app.run(port=3000)