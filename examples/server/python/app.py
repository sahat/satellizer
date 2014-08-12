import sqlite3
from flask import Flask, request, session, g, redirect, url_for, abort

# configuration
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

app = Flask(__name__)
app.config.from_object(__name__)

@app.route('/api/me')
def me():
    pass

@app.route('/auth/login', methods=['POST'])
def login():
    pass

@app.route('/auth/signup', methods=['POST'])
def signup():
    pass

@app.route('/auth/facebook', methods=['POST'])
def facebook():
    pass

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
    app.run()