Rails.application.routes.draw do
  post :login, to: 'auth#login'
  post :signup, to: 'auth#signup'
  post '/:provider',      to: 'auth#authenticate'
  post '/twitter',        to: 'auth#twitter'
  post '/twitter_step_2', to: 'auth#twitter_step_2'

  get '/me', to: 'api#show'
  put '/me', to: 'api#update'
end
