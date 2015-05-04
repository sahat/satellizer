Rails.application.routes.draw do
  post :login, to: 'auth#login'
  post :signup, to: 'auth#signup'
  post :google, to: 'auth#google'
  post :facebook, to: 'auth#facebook'

  get '/me', to: 'api#show'
  put '/me', to: 'api#update'
end
