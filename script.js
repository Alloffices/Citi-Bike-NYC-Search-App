// Preset DOM elements
function addDomElements(dom, free_bikes, emty, miles) {

	const wrapperEl = document.querySelector("#list");

	const card = document.createElement("div");
	const cardH = document.createElement("h1");
	const cardP = document.createElement("p");
	const cardPemty = document.createElement("p");
	const cardPm = document.createElement("p");

	let cardEl = wrapperEl.appendChild(card);
	let cardHead = card.appendChild(cardH);
	let cardPar = card.appendChild(cardP);
	let cardPem = card.appendChild(cardPemty);
	let cardPmiles = card.appendChild(cardPm);

	cardEl.classList.add("card");
	cardHead.classList.add("card-header");
	cardPar.classList.add("card-free-bikes");
	cardPem.classList.add("card-emty-slots");
	cardPmiles.classList.add("card-station-distance");

	cardHead.innerHTML = dom;
	cardPar.innerHTML = "Available Bikes: " +free_bikes;
	cardPem.innerHTML = "Emty Slots: " +emty;
	cardPmiles.innerHTML = "Station is: " +miles+ " miles away";
}

// API URL: http://api.citybik.es/v2/networks/citi-bike-nyc

const nycLocation = [40.7289254,-73.9790508];
const userLocation = [40.786, -73.9765];

// Initial Map View
const mymap = L.map('mapid').setView(nycLocation, 12);

const from = mymap.latLngToLayerPoint(userLocation)

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
let bikeStations = 50;

// JSON array for search
let stationNames = []

async function getBikeStation() {
  const response = await fetch(api_url)
  const data = await response.json()

	for (var i = 0; i < bikeStations; i++) {
	  // Create constant with Lat and Long of each station
	  const { latitude, longitude } = data.network.stations[i]

	  // Gets distances from user and bike station
	  let to = mymap.latLngToLayerPoint([latitude, longitude])

		// Where `1` below is the amount you want to move it.
		let meters = from.distanceTo(to) // Calculates distances between two points in meters
		var milesAway = getMiles(meters).toFixed(3); // Converts meters between 2 points into miles
		milesAway /= Math.pow(10, -2); // moves the decimal place 2 points to the right
		let statDistance = "<b>Station is: </b>" + milesAway + " Miles away";

		// Name of station
	  const stationName =  "<b>Location:</b> "+''+data.network.stations[i].name+' '+"<br />";

		// Pushes station location names ( to => stationNames ) and converts to lowercase
		let sN = data.network.stations[i].name.toLowerCase()
		stationNames.push(sN)

	  // Available bikes at station
	  const popUpTxt = "<b>Available Bikes:</b> "+''+data.network.stations[i].free_bikes+' '+"<br />";

	  // Data updated at this station
	  const stationUpdatedData = "<b>Updated Data:</b> "+''+data.network.stations[i].timestamp.slice(0, -17)+' '+"<br />";

	  // Empty slots available at station
	  const emptySlots = "<b>Empty Slots:</b> "+''+data.network.stations[i].empty_slots+' '+"<br />";

		// Append station in wrapper cards
	  await addDomElements(data.network.stations[i].name, data.network.stations[i].free_bikes, data.network.stations[i].empty_slots, milesAway)

		// Displays each marker on map
		L.marker([latitude, longitude], {icon: myIcon}).addTo(mymap).bindPopup(stationName + stationUpdatedData + popUpTxt + emptySlots + statDistance );
	}

	// console.log(stationNames)
}

mymap.on('popupopen', function(centerMarker) {
	const zoomLvl = 15;
  let cM = mymap.project(centerMarker.popup._latlng);
  cM.y -= centerMarker.popup._container.clientHeight / zoomLvl
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

// Calculates distances beteen two points in meters
function convertMetersToFeet(meters) {
	return (meters/0.3048).toFixed(0);
}

// Converts meters into Miles
function getMiles(i) {
	return i*0.000621371192;
}

// Search Stations With Recomendations
function find(term) {
  document.getElementById('list').innerHTML = '';

  if (term != '') {

		const wrapperEl = document.querySelector("#list");

    for (var i = 0; i < stationNames.length; i++) {
      if (stationNames[i].includes(term)) {

      	let cardResult = document.createElement("div");
        let cardHeader = document.createElement("h1");

				cardResult.classList.add("card");
				cardHeader.classList.add("card-header");

    		wrapperEl.appendChild(cardResult);
    		cardResult.appendChild(cardHeader);

        cardHeader.innerHTML = stationNames[i];
      }
    }
    document.getElementById('list').appendChild(cardResult);
  } else
	  document.getElementById('list').innerHTML = '';

	  ese()
	  ReplacingImage()
	}

	function showValue(ele) {
	  let t = document.getElementById('tbFind');
	  t.value = ele.innerHTML;
	  document.getElementById('list').innerHTML = '';
}

function ese() {
	empty()
	getBikeStation()
}

// Empty bike station array
function empty() {stationNames = []} empty();

function ReplacingImage(){
	const wrapperEl = document.querySelector(".wrapper");
	let imgLd = "https://media1.giphy.com/media/3o6Ztn5Du98sxh2h7G/giphy.gif";
  wrapperEl.innerHTML += '<img id="image_X" src="'+imgLd+'" />';
  var imgf = document.getElementById("image_X");
	setTimeout(function() {
	    wrapperEl.removeChild(imgf)
	}, 800);
}

getBikeStation()
locate()