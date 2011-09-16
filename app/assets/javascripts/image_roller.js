  /**
   * ImageRoller
   * 
   * Author: Polar Humenn (C) 2011
   * 
   * This script requires JQuery.
   * 
   * This class is an object that contantly refreshs an image
   * from an image URL. Noting that the image may change behind
   * the URL, most browswers will cache the image and subvert
   * the next download. This approach avoids the browser cache by adding 
   * a bogus, but unique, argument, i.e. the current time stamp
   * in milliseconds, to the src url for loading the image. 
   * 
   * Note: This may not work correctly if your server behind
   * the url pays attention to HTML GET args (after the "?").
   * 
   * How to use:
   * 
   * The javascript:
   * 
   *  var imageRoller = new ImageRoller('feed-1', 'feed-image', 2000);
   * 
   * expects the following set up in the DOM.
   *
   *  <div id="feed-1">
   *    <div class="feed-image" src="feed-url">
   *      <img src="initial-url" onload="imageRoller.start();">
   *    </div>
   *  </div>
   * 
   * Of course "imageRoller.start();" may go anywhere whenever when you 
   * you want to start rolling the images. But onload of the initial
   * image gives us a nice start and a convient event.
   */
  var ImageRoller = function( feedID, feedImageClassName, refreshRate) {
       this.refreshRate = refreshRate;
       this.feedImageClassName = feedImageClassName;
       this.feedID = feedID;
    };
    
  ImageRoller.prototype = {
    // This should be a URL of a different server that is always up.
    _defaultErrorImageURL : "http://lh6.ggpht.com/_EM1XBJYyS7A/S9-L-YvRF8I/AAAAAAAAIPg/Ae08OBNsVHA/breaking-the-chains-of-debt%5B3%5D.jpg",
    
    // If errorImageURL is to be set, it must be set before start() is called.
    errorImageURL : null,
    
    start : function() {
      if (this.errorImageURL == null) {
	this.errorImageURL = this._defaultErrorImageURL;
      };
      this.fetchFeed(this.feedID, this.feedImageClassName ,this.refreshRate, this.errorImageURL);
    },
  
    /*
     * This function must be called by name from the prototype.
     * It does not reference any part of the instance of the class, 
     * or the function execution context as that would prevent
     * garbage collection of the images and keep upwardly recursive
     * reference chains of execution contexts. By actually forming a string
     * for the setTimeOut function call, we eliminate all references to 
     * any objects freeing up the function execution context for the 
     * garbage collector.
     */
    fetchFeed : function(feedID, feedImageClassName, refreshRate, errorImageURL) {
	var feedElement = $('div#'+feedID);
	var feedImage   = $('div#'+feedID+' div.'+ feedImageClassName);
	var image       = new Image();
	
	feedURL  = feedImage.attr('src');
	feedTime = (new Date()).getTime();
	
	image.onload = function() {
	  // We just loaded a new image. Get rid of the old one and put it in the
	  // container div. The empty() call allows the old image to be GC'd.
	  $('div#'+feedID+' div.'+ feedImageClassName).empty().append(image);
	  
	  // Since the last download took some time, calculate the time needed to
	  // maintain the refreshRate.
	  
	  var duration = Math.max(refreshRate - ((new Date()).getTime() - feedTime), 0);
	  if ($('div#'+feedID).length > 0) {
	    var arg1 = "'"+feedID+"'";
	    var arg2 = "'"+feedImageClassName+"'";
	    var arg3 = refreshRate;
	    var arg4 = errorImageURL ? "'"+errorImageURL+"'" : "null";
	    setTimeout("ImageRoller.prototype.fetchFeed("+arg1+","+arg2+","+arg3+","+arg4+")", duration);
	  };
	};
	
	image.onerror = function() {
	  $('div#'+feedID+' div.'+ feedImageClassName).empty().append(
	    "<img src='"+errorImageURL+"' alt='Problem with downloading next frame'/>");
	  
	  if ($('div#'+feedID).length > 0) {
	    var arg1 = "'"+feedID+"'";
	    var arg2 = "'"+feedImageClassName+"'";
	    var arg3 = refreshRate;
	    var arg4 = errorImageURL ? "'"+errorImageURL+"'" : "null";
	    setTimeout("ImageRoller.prototype.fetchFeed("+arg1+","+arg2+","+arg3+","+arg4+")", refreshRate);
	  };
	};
	
	// Finally, load the image, using the bogus argument.
	image.src = feedURL + '?' + feedTime;
    }
  };