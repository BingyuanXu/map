const apiKey = `pk.eyJ1Ijoid2ludGVycGVnbWFyayIsImEiOiJja2E1eDdpMWgwMW8wMnpwYXFjbmxxeHBoIn0.06tIBjpFGBEIDtO0wHKIvQ`;
const form = document.querySelector(`form`);
const input = document.querySelector(`input`);
const listContainer = document.querySelector(`.points-of-interest`)
let latitude = 0;
let longitude = 0;
let map;
let marker;


form.onsubmit = function (e) {
  console.log(input.value)
  prefer(input.value, longitude, latitude)
  .then(json => preferList(json))
  input.value = ``;
  e.preventDefault();
}

listContainer.onclick = function (e) {
  if(e.target.tagName === `LI`) {
    longitude = e.target.closest(`.poi`).dataset.long;
    latitude = e.target.closest(`.poi`).dataset.lat;
  //  mapboxgl.accessToken = apiKey;
  //  let map = new mapboxgl.Map({
  //    container: 'map', // container id
  //    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
  //    center: [longitude, latitude], // starting position [lng, lat]
  //    zoom: 11 // starting zoom
  //  });
 
    marker
     .setLngLat([longitude, latitude])
     .addTo(map);
 }

  }




function prefer(input, longitude, latitude) {
  return fetch(`
  https://api.mapbox.com/geocoding/v5/mapbox.places/${input}.json?proximity=${longitude},${latitude}&access_token=${apiKey}&limit=10`)
    .then(res => res.json())
    .then(json => {
      return json.features;
    })

}

function preferList(json) {
  json.sort((a,b) => {
    return  GetDistance(latitude,longitude,a.geometry.coordinates[1],a.geometry.coordinates[0]) -  GetDistance(latitude,longitude,b.geometry.coordinates[1],b.geometry.coordinates[0]);
  })
let html = ``;

json.forEach(element => {
  html += `
  <li class=${element[`place_type`][0]} data-long="${element.geometry.coordinates[0]}" data-lat="${element.geometry.coordinates[1]}">
  <ul>
    <li class="name">${element.text}</li>
    <li class="street-address">${element.properties.address}</li>
    <li class="distance">${ GetDistance(latitude,longitude,element.geometry.coordinates[1],element.geometry.coordinates[0]).toFixed(1)} KM</li>
  </ul>
</li>
  `
});
listContainer.innerHTML = html;

}




navigator.geolocation.getCurrentPosition(success, error);

function error() {
  status.textContent = 'Unable to retrieve your location';
}


function success(position) {
   latitude = position.coords.latitude;
   longitude = position.coords.longitude;

  mapboxgl.accessToken = apiKey;
   map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: [longitude, latitude], // starting position [lng, lat]
    zoom: 11 // starting zoom
  });

  marker = new mapboxgl.Marker()
    .setLngLat([longitude, latitude])
    .addTo(map);
}


function Rad(d){
  return d * Math.PI / 180.0;
}

function GetDistance(lat1,lng1,lat2,lng2){

   var radLat1 = Rad(lat1);
   var radLat2 = Rad(lat2);
   var a = radLat1 - radLat2;
   var  b = Rad(lng1) - Rad(lng2);
   var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
   Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
   s = s *6378.137 ;
   s = Math.round(s * 10000) / 10000; 

   return s;
}

