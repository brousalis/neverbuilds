class BuildsController < ApplicationController
  before_filter :authorize, :only => [:create, :update, :new, :delete]

  def index
    @builds   = Build.where(:order => "created_at DESC").all
    @featured = Build.where(:type => "featured").limit(5)
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
    @feats = Marshal.load(@build.feats)
    @powers = Marshal.load(@build.powers)
  end

  def new
    @build = Build.new(params["build"] || {})
  end

  def create
    @build = Build.new(params["build"])
    @build.user = current_user
    @build.feats = Marshal.dump(params["build"]["feats"])
    @build.powers = Marshal.dump(params["build"]["powers"])
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

    respond_to do |format|
      format.js
    end 
  end
end
