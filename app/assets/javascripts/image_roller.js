  /**
   * ImageRoller
   *  This class is an object that contantly refreshs an image
   *  avoiding the browser cache by adding a bogus argument to the
   *  src url for loading the image. It hopefully is unique by adding
   *  a current timestamp in milliseconds. 
   * Note: This may not work correctly if your url pays attention to 
   * HTML args (after the "?").
   * 
   * The javascript:
   * 
   *    var imageRoller = new ImageRoller('feed-1', 'feed-image', 2000);
   * 
   * expects the following set up in the DOM.
   *
   *  <div id="feed-1">
   *    <div class="feed-image" src="feed-url">
   *      <img src="initial-url" onload="imageRoller.start();">
   *    </div>
   *  </div>
   * 
   * Of course "imageRoller.star();" can go anywhere whenever when you 
   * you want to start rolling the images. But onload of the initial
   * image gives us a nice start and an convient event.
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
      this.fetchFeed(this.feedID,this.feedImageClassName,this.refreshRate,this.errorImageURL);
    },
  
    /*
     * This function must be called by name from the prototype.
     * It does not reference any part of the instance of the class, 
     * as that would cause garbage collection and recursive upward
     * reference chains.
     */
    fetchFeed : function(feedID,feedImageClassName,refreshRate,errorImageURL) {
	var feedElement = $('div#'+feedID);
	var feedImage = $('div#'+feedID+' div.'+ feedImageClassName);
	var image = new Image();
	feedURL = feedImage.attr('src');
	feedTime = (new Date()).getTime();
	image.onload = function() {
	  // We just loaded a new image. Get rid of the old one and put it in the
	  // container div.
	  $('div#'+feedID+' div.'+ feedImageClassName).empty().append(image);
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
	image.src = feedURL + '?' + feedTime;
	//alert(image.src);
    }
  };