module OAuth
  class Base
    attr_reader :provider, :data

    def initialize params
      @provider = self.class.name.split('::').last.downcase

      @params = {
        code: params[:code],
        redirect_uri: params[:redirectUri],
        client_id: params[:clientId],
        client_secret: Rails.application.secrets["#{ @provider }_oauth_secret"]
      }
      
      @client = HTTPClient.new
      @access_token = params[:access_token].presence || get_access_token
    end

    def get_data
      response = @client.get(self.class::DATA_URL, access_token: @access_token)

      @data = JSON.parse(response.body).with_indifferent_access

      @data[:id] ||= @data[:sub]
    end
  end
end