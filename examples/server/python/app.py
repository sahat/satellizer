from datetime import datetime, timedelta
import os
import jwt
import json
import requests
import base64
from functools import wraps
from urlparse import parse_qs, parse_qsl
from urllib import urlencode
from flask import Flask, g, send_file, request, redirect, url_for, jsonify
from flask.ext.sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from requests_oauthlib import OAuth1
from jwt import DecodeError, ExpiredSignature

# Configuration

current_path = os.path.dirname(__file__)
client_path = os.path.abspath(os.path.join(current_path, '..', '..', 'client'))

app = Flask(__name__, static_url_path='', static_folder=client_path)
app.config.from_object('config')

db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True)
    password = db.Column(db.String(120))
    display_name = db.Column(db.String(120))
    facebook = db.Column(db.String(120))
    github = db.Column(db.String(120))
    google = db.Column(db.String(120))
    linkedin = db.Column(db.String(120))
    twitter = db.Column(db.String(120))
    bitbucket = db.Column(db.String(120))

    def __init__(self, email=None, password=None, display_name=None,
                 facebook=None, github=None, google=None, linkedin=None,
                 twitter=None, bitbucket=None):
        if email:
            self.email = email.lower()
        if password:
            self.set_password(password)
        if display_name:
            self.display_name = display_name
        if facebook:
            self.facebook = facebook
        if google:
            self.google = google
        if linkedin:
            self.linkedin = linkedin
        if twitter:
            self.twitter = twitter
        if bitbucket:
            self.bitbucket = bitbucket

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_json(self):
        return dict(id=self.id, email=self.email, displayName=self.display_name,
                    facebook=self.facebook, google=self.google,
                    linkedin=self.linkedin, twitter=self.twitter,
                    bitbucket=self.bitbucket)


db.create_all()


def create_token(user):
    payload = {
        'sub': user.id,
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(days=14)
    }
    token = jwt.encode(payload, app.config['TOKEN_SECRET'])
    return token.decode('unicode_escape')


def parse_token(req):
    token = req.headers.get('Authorization').split()[1]
    return jwt.decode(token, app.config['TOKEN_SECRET'])


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not request.headers.get('Authorization'):
            response = jsonify(message='Missing authorization header')
            response.status_code = 401
            return response

        try:
            payload = parse_token(request)
        except DecodeError:
            response = jsonify(message='Token is invalid')
            response.status_code = 401
            return response
        except ExpiredSignature:
            response = jsonify(message='Token has expired')
            response.status_code = 401
            return response

        g.user_id = payload['sub']

        return f(*args, **kwargs)

    return decorated_function


# Routes

@app.route('/')
def index():
    return send_file(os.path.join(client_path, 'index.html'))


@app.route('/api/me')
@login_required
def me():
    user = User.query.filter_by(id=g.user_id).first()
    return jsonify(user.to_json())


@app.route('/auth/login', methods=['POST'])
def login():
    user = User.query.filter_by(email=request.json['email']).first()
    if not user or not user.check_password(request.json['password']):
        response = jsonify(message='Wrong Email or Password')
        response.status_code = 401
        return response
    token = create_token(user)
    return jsonify(token=token)


@app.route('/auth/signup', methods=['POST'])
def signup():
    user = User(email=request.json['email'], password=request.json['password'])
    db.session.add(user)
    db.session.commit()
    token = create_token(user)
    return jsonify(token=token)


@app.route('/auth/facebook', methods=['POST'])
def facebook():
    access_token_url = 'https://graph.facebook.com/v2.3/oauth/access_token'
    graph_api_url = 'https://graph.facebook.com/v2.3/me'

    params = {
        'client_id': request.json['clientId'],
        'redirect_uri': request.json['redirectUri'],
        'client_secret': app.config['FACEBOOK_SECRET'],
        'code': request.json['code']
    }

    # Step 1. Exchange authorization code for access token.
    r = requests.get(access_token_url, params=params)
    access_token = dict(parse_qsl(r.text))

    # Step 2. Retrieve information about the current user.
    r = requests.get(graph_api_url, params=access_token)
    profile = json.loads(r.text)

    # Step 3. (optional) Link accounts.
    if request.headers.get('Authorization'):
        user = User.query.filter_by(facebook=profile['id']).first()
        if user:
            response = jsonify(message='There is already a Facebook account that belongs to you')
            response.status_code = 409
            return response

        payload = parse_token(request)

        user = User.query.filter_by(id=payload['sub']).first()
        if not user:
            response = jsonify(message='User not found')
            response.status_code = 400
            return response

        user.facebook = profile['id']
        user.display_name = user.display_name or profile['name']
        db.session.commit()
        token = create_token(user)
        return jsonify(token=token)

    # Step 4. Create a new account or return an existing one.
    user = User.query.filter_by(facebook=profile['id']).first()
    if user:
        token = create_token(user)
        return jsonify(token=token)

    u = User(facebook=profile['id'], display_name=profile['name'])
    db.session.add(u)
    db.session.commit()
    token = create_token(u)
    return jsonify(token=token)

@app.route('/auth/github', methods=['POST'])
def github():
    access_token_url = 'https://github.com/login/oauth/access_token'
    users_api_url = 'https://api.github.com/user'

    params = {
        'client_id': request.json['clientId'],
        'redirect_uri': request.json['redirectUri'],
        'client_secret': app.config['GITHUB_SECRET'],
        'code': request.json['code']
    }

    # Step 1. Exchange authorization code for access token.
    r = requests.get(access_token_url, params=params)
    access_token = dict(parse_qsl(r.text))
    headers = {'User-Agent': 'Satellizer'}

    # Step 2. Retrieve information about the current user.
    r = requests.get(users_api_url, params=access_token, headers=headers)
    profile = json.loads(r.text)

    # Step 3. (optional) Link accounts.
    if request.headers.get('Authorization'):
        user = User.query.filter_by(github=profile['id']).first()
        if user:
            response = jsonify(message='There is already a GitHub account that belongs to you')
            response.status_code = 409
            return response

        payload = parse_token(request)

        user = User.query.filter_by(id=payload['sub']).first()
        if not user:
            response = jsonify(message='User not found')
            response.status_code = 400
            return response

        user.github = profile['id']
        user.display_name = display_name or profile['name']
        db.session.commit()
        token = create_token(user)
        return jsonify(token=token)

    # Step 4. Create a new account or return an existing one.
    user = User.query.filter_by(github=profile['id']).first()
    if user:
        token = create_token(user)
        return jsonify(token=token)

    u = User(github=profile['id'], display_name=profile['name'])
    db.session.add(u)
    db.session.commit()
    token = create_token(u)
    return jsonify(token=token)



@app.route('/auth/google', methods=['POST'])
def google():
    access_token_url = 'https://accounts.google.com/o/oauth2/token'
    people_api_url = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect'

    payload = dict(client_id=request.json['clientId'],
                   redirect_uri=request.json['redirectUri'],
                   client_secret=app.config['GOOGLE_SECRET'],
                   code=request.json['code'],
                   grant_type='authorization_code')

    # Step 1. Exchange authorization code for access token.
    r = requests.post(access_token_url, data=payload)
    token = json.loads(r.text)
    headers = {'Authorization': 'Bearer {0}'.format(token['access_token'])}

    # Step 2. Retrieve information about the current user.
    r = requests.get(people_api_url, headers=headers)
    profile = json.loads(r.text)

    # Step 3. (optional) Link accounts.
    if request.headers.get('Authorization'):
        user = User.query.filter_by(google=profile['sub']).first()
        if user:
            response = jsonify(message='There is already a Google account that belongs to you')
            response.status_code = 409
            return response

        payload = parse_token(request)

        user = User.query.filter_by(id=payload['sub']).first()
        if not user:
            response = jsonify(message='User not found')
            response.status_code = 400
            return response
        user.google = profile['sub']
        user.display_name = user.display_name or profile['name']
        db.session.commit()
        token = create_token(user)
        return jsonify(token=token)

    # Step 4. Create a new account or return an existing one.

    user = User.query.filter_by(google=profile['sub']).first()
    if user:
        token = create_token(user)
        return jsonify(token=token)
    u = User(google=profile['sub'],
             display_name=profile['name'])
    db.session.add(u)
    db.session.commit()
    token = create_token(u)
    return jsonify(token=token)


@app.route('/auth/linkedin', methods=['POST'])
def linkedin():
    access_token_url = 'https://www.linkedin.com/uas/oauth2/accessToken'
    people_api_url = 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,email-address)'

    payload = dict(client_id=request.json['clientId'],
                   redirect_uri=request.json['redirectUri'],
                   client_secret=app.config['LINKEDIN_SECRET'],
                   code=request.json['code'],
                   grant_type='authorization_code')

    # Step 1. Exchange authorization code for access token.
    r = requests.post(access_token_url, data=payload)
    access_token = json.loads(r.text)
    params = dict(oauth2_access_token=access_token['access_token'],
                  format='json')

    # Step 2. Retrieve information about the current user.
    r = requests.get(people_api_url, params=params)
    profile = json.loads(r.text)
    
    # Step 3. (optional) Link accounts.
    if request.headers.get('Authorization'):
        user = User.query.filter_by(linkedin=profile['id']).first()
        if user:
            response = jsonify(message='There is already a LinkedIn account that belongs to you')
            response.status_code = 409
            return response

        payload = parse_token(request)

        user = User.query.filter_by(id=payload['sub']).first()
        if not user:
            response = jsonify(message='User not found')
            response.status_code = 400
            return response
        user.linkedin = profile['id']
        user.display_name = user.display_name or (profile['firstName'] + ' ' + profile['lastName'])
        db.session.commit()
        token = create_token(user)
        return jsonify(token=token)

    # Step 4. Create a new account or return an existing one.

    user = User.query.filter_by(linkedin=profile['id']).first()
    if user:
        token = create_token(user)
        return jsonify(token=token)
    u = User(linkedin=profile['id'],
             display_name=profile['firstName'] + ' ' + profile['lastName'])
    db.session.add(u)
    db.session.commit()
    token = create_token(u)
    return jsonify(token=token)


@app.route('/auth/twitter', methods=['POST'])
def twitter():
    request_token_url = 'https://api.twitter.com/oauth/request_token'
    access_token_url = 'https://api.twitter.com/oauth/access_token'

    if request.json.get('oauth_token') and request.json.get('oauth_verifier'):
        auth = OAuth1(app.config['TWITTER_CONSUMER_KEY'],
                      client_secret=app.config['TWITTER_CONSUMER_SECRET'],
                      resource_owner_key=request.json.get('oauth_token'),
                      verifier=request.json.get('oauth_verifier'))
        r = requests.post(access_token_url, auth=auth)
        profile = dict(parse_qsl(r.text))

        user = User.query.filter_by(twitter=profile['user_id']).first()
        if user:
            token = create_token(user)
            return jsonify(token=token)
        u = User(twitter=profile['user_id'],
                 display_name=profile['screen_name'])
        db.session.add(u)
        db.session.commit()
        token = create_token(u)
        return jsonify(token=token)
    else:
        oauth = OAuth1(app.config['TWITTER_CONSUMER_KEY'],
                       client_secret=app.config['TWITTER_CONSUMER_SECRET'],
                       callback_uri=app.config['TWITTER_CALLBACK_URL'])
        r = requests.post(request_token_url, auth=oauth)
        oauth_token = dict(parse_qsl(r.text))
        return jsonify(oauth_token)


@app.route('/auth/bitbucket', methods=['POST'])
def bitbucket():
    access_token_url = 'https://bitbucket.org/site/oauth2/access_token'
    users_api_url = 'https://api.bitbucket.org/2.0/user'
    auth_encoded = base64.b64encode(
        "{0}:{1}".format(request.json['clientId'],
                         app.config['BITBUCKET_SECRET']))

    headers = {'Authorization': 'Basic {0}'.format(auth_encoded)}
    payload = dict(redirect_uri=request.json['redirectUri'],
                   code=request.json['code'],
                   grant_type='authorization_code')

    # Step 1. Exchange authorization code for access token.
    r = requests.post(access_token_url, data=payload, headers=headers)
    token = json.loads(r.text)
    params = {'access_token': token['access_token']}

    # Step 2. Retrieve information about the current user.
    r = requests.get(users_api_url, params=params)
    profile = json.loads(r.text)

    # Step 3. (optional) Link accounts.
    if request.headers.get('Authorization'):
        user = User.query.filter_by(bitbucket=profile['uuid']).first()
        if user:
            response = jsonify(message='There is already a Bitbucket account that belongs to you')
            response.status_code = 409
            return response

        payload = parse_token(request)

        user = User.query.filter_by(id=payload['sub']).first()
        if not user:
            response = jsonify(message='User not found')
            response.status_code = 400
            return response

        user.bitbucket = profile['uuid']
        user.display_name = user.display_name or profile['display_name']
        db.session.commit()
        token = create_token(user)
        return jsonify(token=token)

    # Step 4. Create a new account or return an existing one.
    user = User.query.filter_by(bitbucket=profile['uuid']).first()
    if user:
        token = create_token(user)
        return jsonify(token=token)

    u = User(bitbucket=profile['uuid'], display_name=profile['display_name'])
    db.session.add(u)
    db.session.commit()
    token = create_token(u)
    return jsonify(token=token)


if __name__ == '__main__':
    app.run(port=3000)
