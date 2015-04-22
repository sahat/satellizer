class AuthController < ApplicationController

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
    @oauth = OAuth.const_get(action_name.capitalize).new params
    
    @user = User.for_oauth @oauth

    render json: { token: Token.encode(@user.id) }
  end

  def google
    @oauth = OAuth.const_get(action_name.capitalize).new params
    
    @user = User.for_oauth @oauth

    render json: { token: Token.encode(@user.id) }
  end

  private

  def auth_params
    params.require(:auth).permit(:email, :password, :displayName)
  end
end