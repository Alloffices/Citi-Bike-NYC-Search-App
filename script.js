
// API URL: http://api.citybik.es/v2/networks/citi-bike-nyc
const mymap = L.map('mapid').setView([40.7143528, -74.00597309999999], 11.5);
L.tileLayer('https://maps.heigit.org/openmapsurfer/tiles/roads/webmercator/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> | Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

const myIcon = L.icon({iconUrl: 'https://smarttripsaustin.org/wp-content/uploads/2018/09/Bike-icon.png',iconSize: [15, 15]});
const api_url = 'http://api.citybik.es/v2/networks/citi-bike-nyc';

let bikeStations = 10;

async function getBikeStation() {
  const response = await fetch(api_url)
  const data = await response.json()

	for (var i = 0; i < bikeStations; i++) {
	  // Create constant with Lat and Long of each station
	  const { latitude, longitude } = data.network.stations[i]
		// Name of station
	  const stationName =  "<b>Location:</b> "+''+data.network.stations[i].name+' '+"<br />";
	  // Available bikes at station
	  const popUpTxt = "<b>Available Bikes:</b> "+''+data.network.stations[i].free_bikes+' '+"<br />";
	  // Data updated at this station
	  const stationUpdatedData = "<b>Updated Data:</b> "+''+data.network.stations[i].timestamp.slice(0, -17)+' '+"<br />";
	  // Empty slots available at station
	  const emptySlots = "<b>Empty Slots:</b> "+''+data.network.stations[i].empty_slots+' '+"<br />";
		// Displays each marker on map
		L.marker([latitude, longitude], {icon: myIcon}).addTo(mymap).bindPopup(stationName + stationUpdatedData + popUpTxt + emptySlots);
	} 

}

// Zoom when station is opened
mymap.on('popupopen', function(centerMarker) {
	const zoomLvl = 13;
  let cM = mymap.project(centerMarker.popup._latlng);
  cM.y -= centerMarker.popup._container.clientHeight / zoomLvl
  console.log(mymap.unproject(cM));
  mymap.setView(mymap.unproject(cM), zoomLvl, {animate: true});
});

// Reset zoom when station blurb is closed
mymap.on('popupclose', function(centerMarker) {
	const zoomLvl = 10;
  mymap.setView([40.7143528, -74.00597309999999], zoomLvl, {animate: true});
});

var layer = '';//define the layer that contains the markers

mymap.on('zoomend', function() {
    var currentZoom = mymap.getZoom();
    console.log("zoomed")
    //Update X and Y based on zoom level
    var x= 50; //Update x 
    var y= 50; //Update Y         
    var LeafIcon = L.Icon.extend({
        options: {
            iconSize:     [x, y] // Change icon size according to zoom level
        }
    });
    layer.setIcon(LeafIcon);
});

getBikeStation()
