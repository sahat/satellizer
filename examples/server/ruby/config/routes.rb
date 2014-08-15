Rails.application.routes.draw do
  get '/api/me', to: 'users:me'
  get '/auth/login', to: 'auth#login'
  get '/auth/signup', to: 'auth#signup'
  get '/auth/facebook', to: 'auth#facebook'
  get '/auth/google', to: 'auth#google'
  get '/auth/linkedin', to: 'auth#linkedin'
  get '/auth/twitter', to: 'auth#twitter'
end
