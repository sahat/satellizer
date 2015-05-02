require "sinatra/base"

class SinatraStatic < Sinatra::Base
  client_folder = File.expand_path('../../../client', __FILE__)
  set :public_folder, client_folder

  get "/" do
    send_file File.join(client_folder, 'index.html')
  end
end