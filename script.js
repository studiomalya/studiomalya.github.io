function InfoBox(opts) {
    google.maps.OverlayView.call(this);
    this.latlng_ = opts.latlng;
    this.map_ = opts.map;
    this.content = opts.content;
    this.offsetVertical_ = -195;
    this.offsetHorizontal_ = 5;
    this.height_ = 165;
    this.width_ = 266;
    var me = this;
    this.boundsChangedListener_ =
        google.maps.event.addListener(this.map_, "bounds_changed", function () {
            return me.panMap.apply(me);
        });
    this.setMap(this.map_);
}
/* InfoBox extends GOverlay class from the Google Maps API
 */
InfoBox.prototype = new google.maps.OverlayView();
/* Creates the DIV representing this InfoBox
 */
InfoBox.prototype.remove = function () {
    if (this.div_) {
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
    }
};
/* Redraw the Bar based on the current projection and zoom level
 */
InfoBox.prototype.draw = function () {
    // Creates the element if it doesn't exist already.
    this.createElement();
    if (!this.div_) return;
    // Calculate the DIV coordinates of two opposite corners of our bounds to
    // get the size and position of our Bar
    var pixPosition = this.getProjection().fromLatLngToDivPixel(this.latlng_);
    if (!pixPosition) return;
    // Now position our DIV based on the DIV coordinates of our bounds
    this.div_.style.width = this.width_ + "px";
    this.div_.style.left = (pixPosition.x + this.offsetHorizontal_) + "px";
    this.div_.style.height = this.height_ + "px";
    this.div_.style.top = (pixPosition.y + this.offsetVertical_) + "px";
    this.div_.style.display = 'block';
};
InfoBox.prototype.createElement = function () {
    var panes = this.getPanes();
    var div = this.div_;
    if (!div) {
        // This does not handle changing panes. You can set the map to be null and
        // then reset the map to move the div.
        div = this.div_ = document.createElement("div");
            div.className = "infobox"
        var contentDiv = document.createElement("div");
            contentDiv.className = "content"
            contentDiv.innerHTML = this.content;
        var closeBox = document.createElement("div");
            closeBox.className = "close";
            closeBox.innerHTML = "x";
        div.appendChild(closeBox);

        function removeInfoBox(ib) {
            return function () {
                ib.setMap(null);
            };
        }
        google.maps.event.addDomListener(closeBox, 'click', removeInfoBox(this));
        div.appendChild(contentDiv);
        div.style.display = 'none';
        panes.floatPane.appendChild(div);
        this.panMap();
    } else if (div.parentNode != panes.floatPane) {
        // The panes have changed. Move the div.
        div.parentNode.removeChild(div);
        panes.floatPane.appendChild(div);
    } else {
        // The panes have not changed, so no need to create or move the div.
    }
}
/* Pan the map to fit the InfoBox.
 */
InfoBox.prototype.panMap = function () {
    // if we go beyond map, pan map
    var map = this.map_;
    var bounds = map.getBounds();
    if (!bounds) return;
    // The position of the infowindow
    var position = this.latlng_;
    // The dimension of the infowindow
    var iwWidth = this.width_;
    var iwHeight = this.height_;
    // The offset position of the infowindow
    var iwOffsetX = this.offsetHorizontal_;
    var iwOffsetY = this.offsetVertical_;
    // Padding on the infowindow
    var padX = 40;
    var padY = 40;
    // The degrees per pixel
    var mapDiv = map.getDiv();
    var mapWidth = mapDiv.offsetWidth;
    var mapHeight = mapDiv.offsetHeight;
    var boundsSpan = bounds.toSpan();
    var longSpan = boundsSpan.lng();
    var latSpan = boundsSpan.lat();
    var degPixelX = longSpan / mapWidth;
    var degPixelY = latSpan / mapHeight;
    // The bounds of the map
    var mapWestLng = bounds.getSouthWest().lng();
    var mapEastLng = bounds.getNorthEast().lng();
    var mapNorthLat = bounds.getNorthEast().lat();
    var mapSouthLat = bounds.getSouthWest().lat();
    // The bounds of the infowindow
    var iwWestLng = position.lng() + (iwOffsetX - padX) * degPixelX;
    var iwEastLng = position.lng() + (iwOffsetX + iwWidth + padX) * degPixelX;
    var iwNorthLat = position.lat() - (iwOffsetY - padY) * degPixelY;
    var iwSouthLat = position.lat() - (iwOffsetY + iwHeight + padY) * degPixelY;
    // calculate center shift
    var shiftLng =
        (iwWestLng < mapWestLng ? mapWestLng - iwWestLng : 0) +
        (iwEastLng > mapEastLng ? mapEastLng - iwEastLng : 0);
    var shiftLat =
        (iwNorthLat > mapNorthLat ? mapNorthLat - iwNorthLat : 0) +
        (iwSouthLat < mapSouthLat ? mapSouthLat - iwSouthLat : 0);
    // The center of the map
    var center = map.getCenter();
    // The new map center
    var centerX = center.lng() - shiftLng;
    var centerY = center.lat() - shiftLat;
    // center the map to the new shifted center
    map.setCenter(new google.maps.LatLng(centerY, centerX));
    // Remove the listener after panning is complete.
    google.maps.event.removeListener(this.boundsChangedListener_);
    this.boundsChangedListener_ = null;
};

function initialize() {
    var markers = []; // makers array
  
    var myOptions = { // map settings
        zoom: 2,
        center: new google.maps.LatLng(51.8751107,14.6461619),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        sensor: 'true'
    }
    var map = new google.maps.Map(document.getElementById("canvas-map"), myOptions);
  
    var data = [ // map data
      {
        'id':1,
        'content':'Canberra',
        'position': {
          'lat':-35.3074093,
          'lng':149.1230592
         }
      },
      {
        'id':2,
        'content':'Melbourne',
        'position': {
          'lat':-37.6756223,
          'lng':144.8009068
         }
      },
      {
        'id':3,
        'content':'Palu',
        'position': {
          'lat':-0.8988995,
          'lng':119.8501715
         }
      },
      {
        'id':4,
        'content':'Sika',
        'position': {
          'lat':-8.4556829,
          'lng':121.9009795
         }
      },
      {
        'id':5,
        'content':'Kupang',
        'position': {
          'lat':-10.1776711,
          'lng':123.618186
         }
      },
      {
        'id':6,
        'content':'Denpasar, bali',
        'position': {
          'lat':-8.6725072,
          'lng':115.1542319
         }
      },
      {
        'id':7,
        'content':'jakarta',
        'position': {
          'lat':-6.1375686,
          'lng':106.8124393
         }
      },
      {
        'id':8,
        'content':'New york',
        'position': {
          'lat':40.8623924,
          'lng':-73.8794365
         }
      },
      {
        'id':9,
        'content':'Kota Yogyakarta',
        'position': {
          'lat':-7.7897056,
          'lng':110.3610265,
         }
      },
      {
        'id':10,
        'content':'Sleman',
        'position': {
          'lat':-7.689355,
          'lng':110.2411852
         }
      },
      {
        'id':11,
        'content':'Bantul',
        'position': {
          'lat':-7.9021542,
          'lng':110.2575432
         }
      },
      {
        'id':12,
        'content':'Temanggung',
        'position': {
          'lat':-7.3162486,
          'lng':110.175507
         }
      },
      {
        'id':13,
        'content':'Solo',
        'position': {
          'lat':-7.5591225,
          'lng':110.7837923
         }
      },
    ]
      
    for (var i = 0; i < data.length; i++) {
      var current = data[i];
  
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(current.position.lat, current.position.lng),
        map: map,
        content: current.content
      });
  
      markers.push(marker);
  
      google.maps.event.addListener(markers[i], "click", function (e) {
        var infoBox = new InfoBox({
            latlng: this.getPosition(),
            map: map,
            content: this.content
        });
      });
    }
}

jQuery(document).ready(function(){
    initialize();
});
