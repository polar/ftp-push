class CamerasController < ApplicationController
  before_filter :authenticate_user!, :except => [ :show, :index ]
  
  def current
    @camera = Camera.find_by_ftp_userid[params[:id]]
    send_file @camera.current, :type => 'image/jpeg', :disposition => 'inline'
  end
  
  def index
    @cameras = Camera.all
  end

  def show
    @camera = Camera.find(params[:id])
  end

  def new
    @camera = Camera.new
  end

  def create
    @camera = Camera.new(params[:camera])
    @camera.user = current_user
    
    if @camera.save
      redirect_to @camera, :notice => "Successfully created camera."
    else
      render :action => 'new' 
    end
  end

  def edit
    @camera = Camera.find(params[:id])
  end

  def update
    @camera = Camera.find(params[:id])
    if @camera.update_attributes(params[:camera])
      redirect_to @camera, :notice  => "Successfully updated camera."
    else
      render :action => 'edit'
    end
  end

  def destroy
    @camera = Camera.find(params[:id])
    @camera.destroy
    redirect_to cameras_url, :notice => "Successfully destroyed camera."
  end
end
