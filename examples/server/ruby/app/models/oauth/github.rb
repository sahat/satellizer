module Oauth
  class Github < Oauth::Base
    ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token'
    DATA_URL = 'https://api.github.com/user'
    EMAIL_URL = 'https://api.github.com/user/emails'

    def get_access_token
      response = @client.post(ACCESS_TOKEN_URL, @params)
      response.body.split('=')[1].split('&')[0]
    end

    def get_data
      response = @client.get(DATA_URL, access_token: @access_token)
      @data = JSON.parse(response.body).with_indifferent_access
      @data["email"] = get_email if email_is_in_scopes(response.headers)
      @uid = @data[:id] ||= @data[:sub]
      @data
    end

    def formatted_user_data
      {
        provider:       'github',
        token:          @access_token,
        uid:            @data['id'],
        first_name:     @data['login'],
        email:          @data['email'],
        image_url:      @data['avatar_url'],
        github_profile: @data['html_url']
      }
    end

    def email_is_in_scopes headers
      headers.include?("X-OAuth-Scopes") && headers["X-OAuth-Scopes"].split(',').include?("user:email")
    end

    def get_email
      JSON.parse(@client.get(EMAIL_URL, access_token: @access_token).body)[0]["email"]
    end

  end
end