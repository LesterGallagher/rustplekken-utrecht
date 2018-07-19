var utrect_centrum_loc = [52.089358, 5.110006];

var blueIcon = L.icon({
    iconUrl: 'css/lib/leaflet/images/marker-icon-green.png',
    iconRetinaUrl: "css/lib/leaflet/images/marker-icon-2x-green.png",
    shadowUrl: 'css/lib/leaflet/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

document.addEventListener('init', function (event) {
    var page = event.target;

    if (page.id === 'map-page') {

        var map = L.map('map', {
            center: utrect_centrum_loc,
            zoom: 10,
            zoomControl: false,
            minZoom: 10,
            maxZoom: 20,
        });
        L.control.zoom({
            position: 'topright',
        }).addTo(map);
        L.tileLayer('maps/offline/{z}/{x}/{y}.png', {
            maxNativeZoom: 13,
            maxZoom: 18,
            minZoom: 10,
            bounds: L.latLngBounds([
                [52.48277778, 4.57055556], 
                [51.83638889, 5.97500000]
            ])
        }).addTo(map);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            minZoom: 14,
            maxZoom: 20,
            maxNativeZoom: 18,
        }).addTo(map);
        var geoJson = L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                var str = '';
                str += 'Woonplaats: ' + feature.properties.WOONPLAATS;
                str += '<br>Postcode: ' + feature.properties.POSTCD;
                str += '<br>Adres: ' + feature.properties.ADRES;
                str += '<br>Bedrijfsnaam: ' + feature.properties.BEDRIJFSNAAM;
                var lat = latlng.lat.toString().slice(9);
                var lng = latlng.lng.toString().slice(8);

                str += '<br><br><small class="muted">' + lat + ', ' + lng + '</small>';
                return L.marker(latlng, { icon: blueIcon })
                    .bindPopup(str);
            }
        }).addTo(map);
        var marker = L.marker([0, 0])
            .bindPopup('You', { autoPan: false })
            .addTo(map);

        marker.openPopup();
        var circle = L.circle([0, 0], 1).addTo(map);

        map.on('locationfound', onLocationFound);
        map.locate();

        function onLocationFound(e) {
            var radius = e.accuracy / 2;
            marker.setLatLng(e.latlng);
            circle.setLatLng(e.latlng);
            circle.setRadius(radius);
            marker._popup.setContent("You are within " + radius + " meters from this point")
        }

        function onLocationError() {
            console.warn('Unable to get location');
        }

        map.on('locationfound', onLocationFound);
        map.on('locationerror', onLocationError);

        // call locate every 3 seconds... forever
        setInterval(map.locate.bind(map), 3000);
    }
});

document.addEventListener("deviceready", function () {
    if (cordova.platformId === 'browser') {
        document.body.appendChild(document.createElement('script')).src = './js/browser.js';
    } else {
        document.body.appendChild(document.createElement('script')).src = './js/admob.js';
    }
    if (navigator.onLine === false) {
        window.ons.notification.alert({
            message: 'Je bent niet verbonden met de server. De gegevens die worden weergegeven zijn mogelijk verouderd.n',
        });
    }
}, false);

window.ons.disableAutoStatusBarFill();

function createContent(item) {

    var str = '<b>' + _app_localization.publicToilet[_app_userLang] + '</b><br>';
    if (item.dak) {
        str += _app_localization.locationIsRoofed[_app_userLang];
    } else {
        str += _app_localization.locationIsNotRoofed[_app_userLang];
    }
    str += '<br>'
    if (item.bijzonderheden && _app_localization[item.bijzonderheden][_app_userLang]) {
        str += _app_localization[item.bijzonderheden][_app_userLang];
        str += '<br>'
    }

    str += '<br><small style="color: #999;">';
    str += item.latitude.toString().slice(0, 9);
    str += ' ';
    str += item.longitude.toString().slice(0, 8);
    str += '</small>'
    return str;
}

window.fn = {};
window.fn.open = function() {
    document.getElementById('navigator').pushPage('views/about.html');
}
