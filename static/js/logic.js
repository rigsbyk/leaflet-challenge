// create the map object
var myMap = L.map("map", {
    center: [45.52, -90.67],
    zoom:3
  });
  
  // Adding a tile layer (the background map image) to our map
  // We use the addTo method to add objects to our map
  var graymap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "light-v10",
    accessToken: API_KEY  
  })
  
  graymap.addTo(myMap);
  

// Use d3 to call the json file with data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {
    // functions for radius, for color and for style

     // style function
     function mapStyle(feature){
        return {
            opacity: 1,
            fillOpacity: 0.75,
            fillColor: mapColor(feature.properties.mag),
            color: "purple",
            radius: mapRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    function mapColor(mag) {
        switch (true) {
            case mag > 5:
                return "#C9292E";
            case mag > 4:
                return "#C98029";
            case mag > 3:
                return "#FBB45F";
            case map > 2:
                return "#DCD928";
            case map > 1:
                return "#FDFB88";
            default:
                return "#83F641";
        }
    }

   
    // function to get the radius

    function mapRadius(mag) {
        if (mag  === 0){
            return 1;
        }

        return mag * 4;

    }


    // load the GEoJson Layer
    L.geoJSON(data, {
        // gets the cricleMarker
      pointToLayer: function(feature, latlng){
          return L.circleMarker(latlng);
      },

      style: mapStyle,

      OnEachFeature: function(feature, layer) {
        layer.bindPopup("Maginitude" + feature.properties.mag +
          "<br>Location:" + feature.properties.place);
      }


    }).addTo(myMap)

    // create the legend
    var legend = L.control({
        position: "bottomright"
    });

    legend.onAdd = function(){
        var div = L.DomUtil.create("div", "info legend");

        var grades = [0,1,2,3,4,5];
        var colors = ["#83F641","#FDFB88","#DCD928","#FBB45F","#C98029","#C9292E"];
        
        for (var i = 0; i< grades.length; i++){
            
            div.innerHTML +=
            "<i style='background:" + colors[i] + "'></i>" +
              grades[i] + (grades[i+1] ? "&ndash;" + grades[i+1]+ "<br>" : "+");
        } 
        return div;
    };

    legend.addTo(myMap);




});
