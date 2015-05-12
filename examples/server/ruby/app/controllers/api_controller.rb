class APIController < ApplicationController
  before_filter :set_current_user, :authenticate_user!

  def show
    render json: current_user
  end

  def update
    current_user.update api_params

    head :no_content
  end

  private

  def api_params
    params.require(:api).permit(:email, :displayName)
  end
end