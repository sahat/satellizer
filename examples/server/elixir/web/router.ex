defmodule Satellizer.Router do
  use Phoenix.Router

  plug Plug.Static, at: "/static", from: :satellizer
  get "/", Satellizer.PageController, :index, as: :page
end
