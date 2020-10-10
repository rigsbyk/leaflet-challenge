// create the map object
var myMap = L.map("map", {
    center: [45.52, -122.67],
    zoom:5
  });
  
  // Adding a tile layer (the background map image) to our map
  // We use the addTo method to add objects to our map
  L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY  
  }).addTo(myMap);
  

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
                return "#210578";
            case mag > 4:
                return "#2A0A8F";
            case mag > 3:
                return "#370db9";
            case map > 2:
                return "#026DF5";
            case map > 1:
                return "#02EDF5";
            default:
                return "#ffffff";
        }
    }

   
    // function to get the radius

    function mapRadius(mag) {
        if (mag  === 0){
            return 1;
        }

        return mag * 5;

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


    }).addTo(map)

    // create the legend
    var legend = L.control({
        position: "bottomright"
    });

    legend.onAdd = function(){
        var div = L.DomUtil.create("div", "info legend");

        var grades = [0,1,2,3,4,5];
        var colors = [
                "#ffffff","#02EDF5","#026DF5","#370db9","#2A0A8F","#210578"];

        for (var i = 0; i< grades.length; i++){
            div.innerHTML +=
            "<i style= 'background: "+ colors[i]+ "'></i> " +
            grades[i] + (grades[i+1] ? "&ndash;" + grades[i+1]+ "<br>": "+");
        } 
        return div;
    };

    legend.addTo(map)




});
