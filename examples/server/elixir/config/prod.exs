use Mix.Config

config :phoenix, Satellizer.Router,
  port: System.get_env("PORT"),
  ssl: false,
  host: "example.com",
  code_reload: false,
  cookies: true,
  session_key: "_satellizer_key",
  session_secret: "3(C6F#2DQLTE41_2PB@U7BIL^#T@CS)LH$!_D12FT*W#0P#3=&K#=BJ=+F0QQB@LX3X4"

config :phoenix, :logger,
  level: :error

