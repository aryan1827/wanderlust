mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

console.log(listing.geometry.coordinates);



const popup = new mapboxgl.Popup({ closeOnClick: false })
.setHTML(
    `<h4>${listing.location}, ${listing.country}</h4><br><p>Exact location provided after booking!</p>`
)

const marker1 = new mapboxgl.Marker({color: "red"})
.setLngLat(listing.geometry.coordinates) //Listing.geometry.coordinates
.setPopup(popup)
.addTo(map);

