import os

DEBUG = True
TOKEN_SECRET = os.environ.get('SECRET_KEY') or 'hard to guess string''keyboard cat'
FACEBOOK_SECRET = os.environ.get('FACEBOOK_SECRET') or 'Facebook Client Secret'
FOURSQUARE_SECRET = os.environ.get('FOURSQUARE_SECRET') or 'Foursquare Client Secret'
GOOGLE_SECRET = os.environ.get('GOOGLE_SECRET') or 'Google Client Secret'
LINKEDIN_SECRET = os.environ.get('LINKEDIN_SECRET') or 'LinkedIn Client Secret'
TWITTER_CONSUMER_KEY = os.environ.get('TWITTER_CONSUMER_KEY') or 'Twitter Consumer Secret'
TWITTER_CONSUMER_SECRET = os.environ.get('TWITTER_CONSUMER_SECRET') or 'Twitter Consumer Secret'
TWITTER_CALLBACK_URL = os.environ.get('TWITTER_CALLBACK_URL') or 'http://localhost:3000'
SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI') or 'sqlite:///app.db'