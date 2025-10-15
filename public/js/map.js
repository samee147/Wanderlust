console.log("longitude",listing.longitude);
console.log("latitude",listing.latitude);

let map = new mappls.Map('map', {center:{lat:listing.latitude,lng:listing.longitude},zoom: 16 });

var marker = new mappls.Marker({
    map: map,
    position: {"lat": listing.latitude,"lng":listing.longitude},
    popupHtml: `<div>${listing.title}</div>`
    });

console.log("mappls map loaded");

