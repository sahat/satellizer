Rails.application.routes.draw do
  scope :auth, controller: :auth do
    post :login
    post :signup
    post :google
    post :facebook
  end

  get 'api/me', to: 'api#show'
  put 'api/me', to: 'api#update'

  root to: redirect('/index.html')
end
