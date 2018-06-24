// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
var plates_Url ="https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"


d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });
  
  function createFeatures(earthquakeData) {
  
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><p>" + feature.properties.mag + "</p>");
    }
        
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {radius : feature.properties.mag*3, 
                                         fillOpacity:feature.properties.mag/4,
                                        color:choosecolor(feature),
                                        fillcolor:choosecolor(feature)});
        }
    });
    
    function choosecolor(feature){
        if (feature.properties.mag >0 && feature.properties.mag <=2){
            return '#FFFF00'
        }
        if (feature.properties.mag >2 && feature.properties.mag <=3){
            return '#FFA500'
        }
        if (feature.properties.mag >3){
            return '#FF0000'
        }

    }
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
  }
  function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
      "access_token=pk.eyJ1IjoiZHlsYnVyZ2VyIiwiYSI6ImNqaHNkZXpyYTAxdDAzcXJ6dzA3NHR5dXMifQ.oZt5CGSYffy4dZqIFSQciQ");
  
      
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
   };
    
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes,
      
     
    };
    d3.json(plates_Url, function(data) {
        console.log(L.geoJSON(data.features))
    })
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps,{
      collapsed: false
    }).addTo(myMap);

 // Add the info legend to the map
    var info = L.control({
        position: 'bottomright'
      });
      info.onAdd = function() {
        var div = L.DomUtil.create("div", "legend");
        return div;
      };
      info.addTo(myMap);
      document.querySelector(".legend").innerHTML = [
        "<p><b>Earthquakes in the last 7 days in US</b></p>",
        "<p>" + "<div class=\"box\" style=\"Background-color:#FFFF00;\" width =10 height = 10></div>"+"0-2</p>",
        "<p><div class=\"box\" style=\"background-color:#FFA500;\" width =20px height = 20px display: inline-block></div> 2-3</p>",
        "<p><div class=\"box\" style=\"background-color:#FF0000;\" width =20px height = 20px display: inline-block></div>Greater than 3</p>"]
        .join("");
  }

  
  
  

 
 

  