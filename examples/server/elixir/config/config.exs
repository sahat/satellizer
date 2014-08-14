# This file is responsible for configuring your application
use Mix.Config

# Note this file is loaded before any dependency and is restricted
# to this project. If another project depends on this project, this
# file won't be loaded nor affect the parent project.

config :phoenix, Satellizer.Router,
  port: System.get_env("PORT"),
  ssl: false,
  code_reload: false,
  static_assets: true,
  cookies: true,
  session_key: "_satellizer_key",
  session_secret: "3(C6F#2DQLTE41_2PB@U7BIL^#T@CS)LH$!_D12FT*W#0P#3=&K#=BJ=+F0QQB@LX3X4"

config :phoenix, :logger,
  level: :error


# Import environment specific config. Note, this must remain at the bottom of
# this file to properly merge your previous config entries.
import_config "#{Mix.env}.exs"
