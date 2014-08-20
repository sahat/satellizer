require 'sinatra'
require 'json'
require 'data_mapper'

client_folder = File.expand_path('../../../client', __FILE__)

configure do
  set :public_folder, client_folder
end



DataMapper::setup(:default, "sqlite3://#{Dir.pwd}/app.db")

class User
  include DataMapper::Resource
  property :id, Serial
  property :email, String, :required => true, :unique => true
  property :first_name, String
  property :last_name, String
  property :facebook, String
  property :foursquare, String
  property :google, String
  property :github, String
  property :linkedin, String
  property :twitter, String
end

DataMapper.finalize

User.auto_upgrade!



get '/' do
  puts settings.facebook_secret
  send_file File.join(client_folder, 'index.html')
end

post '/auth/login' do

end

post '/auth/signup' do

end

post '/auth/facebook' do

end

post '/auth/google' do

end

post '/auth/github' do

end

post '/auth/linkedin' do

end

post '/auth/foursquare' do

end

get '/auth/twitter' do

end

get '/api/me' do

end






configure :development do
  set :token_secret, 'hard to guess string'
  set :facebook_secret, '298fb6c080fda239b809ae418bf49700'
  set :foursquare_secret, ''
  set :github_secret, ''
  set :google_secret, ''
  set :linkedin_secret, ''
  set :twitter_consumer_key, ''
  set :twitter_consumer_secreT, ''
  set :twitter_callback_url, ''
end

configure :production do
  set :token_secret, ENV['TOKEN_SECRET']
  set :facebook_secret, ENV['FACEBOOK_SECRET']
  set :foursquare_secret, ENV['FOURSQUARE_SECRET']
  set :github_secret, ENV['GITHUB_SECRET']
  set :google_secret, ENV['GOOGLE_SECRET']
  set :linkedin_secret, ENV['LINKEDIN_SECRET']
  set :twitter_consumer_key, ENV['TWITTER_KEY']
  set :twitter_consumer_secreT, ENV['TWITTER_SECRET']
  set :twitter_callback_url, ENV['TWITTER_CALLBACK']
end