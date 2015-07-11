module Oauth
  class Linkedin < Oauth::Base
    ACCESS_TOKEN_URL = 'https://www.linkedin.com/uas/oauth2/accessToken'
    DATA_URL = 'https://api.linkedin.com/v1/people/~:(id,email-address,first-name,last-name,picture-url,summary,location,picture-urls::(original),public-profile-url)?format=json'

    def get_data
      response = @client.get(DATA_URL, oauth2_access_token: @access_token)
      @data = JSON.parse(response.body).with_indifferent_access
      @uid = @data[:id] ||= @data[:sub]
      @data
    end

    def formatted_user_data
      {
        provider:        'linkedin',
        token:            @access_token,
        linkedin_profile: @data['publicProfileUrl'],
        email:            @data['emailAddress'],
        image_url:        @data['pictureUrl'],
        first_name:       @data['firstName'],
        last_name:        @data['lastName'],
        about:            @data['summary'],
        uid:              @data['id']
      }
    end

  end
end