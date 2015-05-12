# This file is used by Rack-based servers to start the application.

require ::File.expand_path('../config/environment', __FILE__)
require './sinatra_static.rb'

# Hack this up, so we wouldn't need to duplicate client code
map "/api" do
  run Rails.application
end

map '/auth' do
  run Rails.application
end

# Use sinatra to serve static files, because it can be configured
map "/" do
  run SinatraStatic
end
