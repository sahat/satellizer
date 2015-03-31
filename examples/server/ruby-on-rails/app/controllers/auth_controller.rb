class AuthController < ApplicationController
  before_action :set_oauth_user, only: [:facebook, :google] 

  def signup
    @user = User.create auth_params
    render json: auth_success
  end

  def login
    @user = User.find_by email: params[:email] if params[:email].present?

    if @user && @user.authenticate(params[:password])
      render json: auth_success
    else
      render json: { message: 'Invalid credentials' }, status: :unauthorized
    end
  end

  def facebook
    render json: auth_success
  end

  def google
    render json: auth_success
  end

  private

  def set_oauth_user
    @oauth = OAuth.const_get(action_name.capitalize).new params
    
    @user = User.for_oauth @oauth
  end

  def auth_params
    params.require(:auth).permit(:email, :password, :displayName)
  end

  def auth_success
    { token: Token.encode(@user.id) }
  end
end