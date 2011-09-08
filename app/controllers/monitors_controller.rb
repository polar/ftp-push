##
# This controller handles the delivery of images from a particular camera.
##
class MonitorsController < ApplicationController
  
  ##
  # Get monitor/:id
  def show
    @camera = Camera.find_by_ftp_userid(params[:id])
    if (@camera == nil)
      render :text => "No such camera", :status => 500
    end
  end
  
  ##
  # GET monitor/current/:id
  # This returns the "current" picture for a particular camera.
  #
  def current
    @camera = Camera.find_by_ftp_userid(params[:id])

    if (@camera != nil)
      set_cache_buster
      logger.info "Sending File #{@camera.current}"
      send_file @camera.current, :type => 'image/jpeg', :disposition => 'inline'
    else
      raise "No Such Camera"
    end
    
    # from @camera.current
    rescue Camera::NoPictureException
      send_default_picture
  end

  private

  ##
  # This function sets the response headers to try to limit picture caching.
  # However, we find that most browsers ignore this, but we try.
  #
  def set_cache_buster
    response.headers["Cache-Control"] = "no-cache, no-store, max-age=0, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "Fri, 01 Jan 1990 00:00:00 GMT"
  end
  
  def send_default_picture
      #TODO Default Picture
    send_file "public/images/Test_Pattern.jpg", :type => 'image/jpeg', :disposition => 'inline'
  end
end
