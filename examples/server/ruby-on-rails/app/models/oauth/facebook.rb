module OAuth
  class Facebook < OAuth::Base
    HOST = 'https://graph.facebook.com'
    ACCESS_TOKEN_URL = HOST + '/oauth/access_token'
    DATA_URL = HOST + '/me'
    FRIENDS_URL = HOST + '/me/friends'

    attr_reader :access_token

    def get_access_token
      response = @client.get(ACCESS_TOKEN_URL, @params)
      
      Rack::Utils.parse_query(response.body)['access_token']
    end

    def get_names
      [data[:first_name], data[:last_name]]
    end
  end
end