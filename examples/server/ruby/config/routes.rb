Rails.application.routes.draw do
  resources :users, except: [:new, :edit]

  get '/auth/facebook', to: 'auth#facebook'
  get '/auth/google', to: 'auth#google'
  get '/auth/linkedin', to: 'auth#linkedin'
  get '/auth/twitter', to: 'auth#twitter'
end
