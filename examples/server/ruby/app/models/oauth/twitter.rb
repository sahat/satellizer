module Oauth
  class Twitter
    attr_reader :access_token, :formatted_account_info, :twitter_account

    def initialize params
      @client = TwitterOAuth::Client.new( consumer_key: ENV['TWITTER_KEY'], consumer_secret: ENV['TWITTER_SECRET'])
      @params = params
      
      if params[:oauth_token] && params[:oauth_verifier]
        get_access_token 
      elsif params[:twitter_token]
        get_account
        format_account_info 
      end
    end

    def request_token
      if @request_token.blank?
        @token = @client.request_token(oauth_callback: "#{ENV['ANGULAR_SITE_URL']}")
        $redis.set(@token.token, @token.secret)
        @request_token = @token.token
      else
        @request_token
      end
    end

    def get_access_token
      @access_token = @client.authorize(
        @params[:oauth_token], $redis.get(@params[:oauth_token]),
        oauth_verifier: @params[:oauth_verifier]
      )
      $redis.set(@access_token.token, @access_token.secret)
      @access_token = @access_token.token
    end

    def get_account
      @twitter_account = TwitterOAuth::Client.new(
        consumer_key: ENV['TWITTER_KEY'], 
        consumer_secret: ENV['TWITTER_SECRET'],
        token: @params[:twitter_token],    
        secret: $redis.get(@params[:twitter_token])
      )
    end

    def authorized?
      @authorized ||= @twitter_account.authorized?
    end

    def format_account_info
      twitter_profile = @twitter_account.info
      begin
        website = twitter_profile["entities"]["url"]["urls"][0]["expanded_url"]
      rescue
      end
      @formatted_account_info = {
        provider:        'twitter', 
        uid:             twitter_profile["id"],
        name:            twitter_profile["name"],
        description:     twitter_profile["description"],
        website:         website,
        token:           @params[:twitter_token],
        secret:          $redis.get(@params[:twitter_token]),
        image_url:       twitter_profile["profile_background_image_url"],
        twitter_profile: "http://www.twitter.com/#{twitter_profile['screen_name']}"
      }
    end

  end
end