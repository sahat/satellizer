module Oauth
  class Foursquare < Oauth::Base
    ACCESS_TOKEN_URL = 'https://foursquare.com/oauth2/access_token'
    USER_URL = 'https://api.foursquare.com/v2/users/self'

    def get_data
      response = @client.get(USER_URL, oauth_token: @access_token, v: 20140806)
      @data = JSON.parse(response.body)['response']['user']
      @uid = @data["id"]
      @data
    end

    def formatted_user_data
      {
        provider:       'foursquare',
        token:          @access_token,
        uid:            @data['id'],
        first_name:     @data['firstName'],
        last_name:      @data['lastName'],
        email:          @data['contact']['email'],
        image_url:      "#{@data['photo']['prefix']}256x256#{@data['photo']['suffix']}",
        foursquare_profile: "https://foursquare.com/user/#{@data['id']}"
      }
    end

  end
end


