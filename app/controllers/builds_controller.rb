class BuildsController < ApplicationController
  include Opinio::Controllers::Helpers

  before_filter :authorize, :only => [:create, :update, :new, :delete]

  def index
    @builds   = Build.where(:order => "created_at DESC").all
    @featured = Build.where(:type => "featured").limit(5)
    session[:class] = "trickster_rogue"
    session[:race] = "halfling"
  end 

  def destroy
    @build.destroy
    redirect_to "/"
  end

  def update
    @build.update_attributes(params[:build])
    render :json => {"status" => "success", 
                     "redirect" => build_path(@build)}
  end

  def show
    @build = Build.find(params[:id])
  end

  def new
    @build = Build.new((params[:build] || {}).merge(
      :character_class => session[:class]
      # TODO: race
    ))
  end

  def create
    @build = Build.new(params[:build])
    @build.user = current_user
    if @build.save
      render :json => {"status" => "success", 
                       "redirect" => "/builds/#{@build.id}"}
    else
      render :json => {"status" => "failure", 
                       "errors" => @build.errors.full_messages},
             :status => :unprocessable_entity
    end
  end 

  def pick
    @race = params[:race]
    @class = params[:class]

    session[:race] = @race
    session[:class] = @class

    respond_to do |format|
      format.js
    end 
  end
end
