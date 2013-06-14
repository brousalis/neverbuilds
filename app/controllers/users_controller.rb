class UsersController < ApplicationController
  def new
    @user = User.new
  end

  def update
    current_user.update_attributes(params[:user])
    current_user.save
    redirect_to request.env["HTTP_REFERER"]
  end

  def create
    @user = User.new(params[:user])
    if @user.save
      session[:user_id] = @user.id
      render :json => { "status" => "success", "location" => "/"}
    else
      render :json => { "status" => "failure", "errors" => @user.errors.full_messages.join(', ')}
    end
  end
end
