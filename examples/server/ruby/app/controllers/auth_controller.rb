class AuthController < ApplicationController

  def signup
    @user = User.create auth_params
    render json: { token: Token.encode(@user.id) }
  end

  def login
    @user = User.find_by email: params[:email] if params[:email].present?

    if @user && @user.authenticate(params[:password])
      render json: { token: Token.encode(@user.id) }
    else
      render json: { message: 'Invalid credentials' }, status: :unauthorized
    end
  end

  def authenticate
    @oauth = "Oauth::#{params['provider'].titleize}".constantize.new(params)     
    if @oauth.authorized?
      @user = User.from_auth(@oauth.formatted_user_data, current_user)
      if @user
        render_success(token: @oauth.access_token, authentication_token: @user.authentication_token, id: @user.id)
      else
        render_error "This #{params[:provider]} account is used already"
      end
    else
      render_error("There was an error with #{params['provider']}. please try again.")
    end
  end

  # Twitter don't support auth2 protocol yet, so it has it's own implementation for now
  def twitter
    if params[:oauth_token].blank?
      render_success({ oauth_token: twitter_oauth.request_token })
    else
      render_success({ token: twitter_oauth.access_token })
    end
  end

  def twitter_step_2
    if twitter_oauth.authorized?
      if User.from_auth(twitter_oauth.formatted_account_info, current_user)
        render_success("connected twitter to profile successfuly")
      else
        render_error "This twitter account is used already"
      end
    else
      render_error("There was an error with twitter. please try again.")
    end
  end

  private
  
    def twitter_oauth
      @oauth ||= Oauth::Twitter.new(params)
    end

    def auth_params
      params.require(:auth).permit(:email, :password, :displayName)
    end

end