
// API URL: http://api.citybik.es/v2/networks/citi-bike-nyc

const nycLocation = [40.7289254,-73.9790508];
const userLocation = [40.786,-73.9665];

// Initial Map View
const mymap = L.map('mapid').setView(nycLocation, 12);

// Sets map tile template
L.tileLayer('https://maps.heigit.org/openmapsurfer/tiles/roads/webmercator/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> | Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

// Map Bike Icon URL and size
myIcon = L.icon({iconUrl: 'http://www.altairapps.com/images/apps/icon_divvybikes.png', iconSize: [30, 30]});
myUserIcon = L.icon({iconUrl: 'https://i.graphicmama.com/uploads/2019/5/5cf0f3559404b-cartoon-man-dressed-as-lumberjack-vector-character-1.png', iconSize: [60, 60]});

// City Bike API (Free Opensource API)
const api_url = 'http://api.citybik.es/v2/networks/citi-bike-nyc';

// Amount of stations we will search
let bikeStations = 200;

async function getBikeStation() {
  const response = await fetch(api_url)
  const data = await response.json()
	for (var i = 0; i < bikeStations; i++) {
	  // Create constant with Lat and Long of each station
	  const { latitude, longitude } = data.network.stations[i]
	  // Gets distances from user and bike station
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
	const zoomLvl = 15;
  let cM = mymap.project(centerMarker.popup._latlng);
  cM.y -= centerMarker.popup._container.clientHeight / zoomLvl
  console.log(mymap.unproject(cM));
  mymap.setView(mymap.unproject(cM), zoomLvl, {animate: true});
});

// Reset zoom when station blurb is closed
mymap.on('click', function(centerMarker) {
	const zoomLvl = 12;
  mymap.setView(nycLocation, zoomLvl, {animate: true});
});

// Set a user on map
function locate() {
  L.marker(userLocation, {icon: myUserIcon}).addTo(mymap);
}

var from = mymap.latLngToLayerPoint([40.7289254,-73.9790508])
var to = mymap.latLngToLayerPoint([40.7289954,-73.9999508])
var meters = from.distanceTo(to)

function convertMetersToFeet(meters) {
	if (meters < (0)) {
		return 'input cannot be less than zero'; 
	} else {
		return (meters/0.3048).toFixed(0);
	}
}
console.log(convertMetersToFeet(meters) + "ft")

getBikeStation()

// User current location
locate()