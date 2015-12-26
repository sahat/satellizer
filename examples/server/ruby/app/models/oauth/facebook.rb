module Oauth
  class Facebook < Oauth::Base
    ACCESS_TOKEN_URL = 'https://graph.facebook.com/v2.5/oauth/access_token'
    DATA_URL = 'https://graph.facebook.com/v2.5/me'

    def get_data
      response = @client.get(DATA_URL, access_token: @access_token, fields: 'first_name, last_name, email, gender, about, link, website, picture')
      @data = JSON.parse(response.body).with_indifferent_access
      @data['image_url'] = @data['picture']['data']['url'] if @data['picture'].present?
      @uid = @data[:id] ||= @data[:sub]
      @data
    end

    def formatted_user_data
      {
        facebook_profile: @data['link'],
        first_name:       @data['first_name'],
        last_name:        @data['last_name'],
        image_url:        @data['image_url'],
        provider:        'facebook',
        gender:           @data['gender'],
        token:            @access_token,
        email:            @data['email'],
        uid:              @data['id']
      }
    end

  end
end
