  /**
   * ImageRoller
   *  This class is an object that contantly refreshs an image
   *  avoiding the browser cache by adding a bogus argument to the
   *  src url for loading the image. It hopefully is unique by adding
   *  a current timestamp in milliseconds. 
   * Note: This may not work correctly if your url pays attention to 
   * HTML args (after the "?").
   */
  var ImageRoller = Class.create();
  
  ImageRoller.prototype = {
  
    _imageUrl    : "",
    _refreshTime : 1000,
    _element     : 0,
    
    initialize : function (refreshTime) {
       this._refreshTime = refreshTime;
    },
    
    /**
     * This function starts the viewer on a particular image element, of
     * which has its "src" property set.
     * An application would be:
     * <script ...>imageRoller = new ImageRoller(400);</script>
     * <img src='...url..." onLoad='imageRoller.start(this)'/>
     */
    start : function (imageElement) {
       this._element = imageElement;
       if (this._imageUrl == "") {
         this._imageUrl = imageElement.src;
       };
       // Javascript cannot handle the scope associated with just giving
       // "this.refreshImage" here. We have to give it a function scope,
       // and we cannot "this" inside as it refers to the immediate object
       // encapsulating the anonymous function.
       var me = this;
       setTimeout( function(){me._refreshImage();}, this._refreshTime);
    },
    _refreshImage : function () {
       this._element.src = this._imageUrl + "?" + new Date().getTime();
    }
  };