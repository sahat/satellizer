module OAuth
  class Google < OAuth::Base
    ACCESS_TOKEN_URL = 'https://accounts.google.com/o/oauth2/token'
    DATA_URL = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect'

    def get_access_token
      response = @client.post(ACCESS_TOKEN_URL, @params.merge(grant_type: 'authorization_code'))
      
      JSON.parse(response.body)['access_token']
    end

    def get_names
      names = data[:name].try(:split).to_a

      [data[:given_name] || names.first, data[:family_name] || names.last]
    end
  end
end