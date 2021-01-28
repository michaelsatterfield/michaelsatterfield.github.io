

mapboxgl.accessToken = 'pk.eyJ1IjoibXNhdHRlcmZpZWxkIiwiYSI6ImNrZWN4MTg5ZjBuMnkydnNiOHhwYmloZjAifQ.-A8J_oCPk6l8pCnQmHT3Fw';


// the  geocode method from mapbox-geocoder-utils.js
geocode("Contramar Mexico City, Mexico", mapboxgl.accessToken).then(function(result) {
    console.log(result);
    map.setCenter(result);
    map.setZoom(5.5);

});


function geocode(search, token) {
    var baseUrl = 'https://api.mapbox.com';
    var endPoint = '/geocoding/v5/mapbox.places/';
    return fetch(baseUrl + endPoint + encodeURIComponent(search) + '.json' + "?" + 'access_token=' + token)
        .then(function(res) {
            return res.json();
            // to get all the data from the request, comment out the following three lines...
        }).then(function(data) {
            return data.features[0].center;
        });
}



var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-streets-v11',

    pitch: 45,
    center: [-99.1685, 19.4196]
});


map.on('load', function() {
    map.addSource('places', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'properties': {
                        'description':
                            '<strong>Make it Mount Pleasant</strong><p><a href="http://www.mtpleasantdc.com/makeitmtpleasant" target="_blank" title="Opens in a new window">Make it Mount Pleasant</a> is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>',
                        'icon': 'theatre'
                    },
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [[-99.1672, 19.4196 ]]
                    }
                }

            ]
        }
    });
// Add a layer showing the places.
    map.addLayer({
        'id': 'places',
        'type': 'symbol',
        'source': 'places',
        'layout': {
            'icon-image': '{icon}-15',
            'icon-allow-overlap': true
        }
    });

// When a click event occurs on a feature in the places layer, open a popup at the
// location of the feature, with description HTML from its properties.
    map.on('click', 'places', function(e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.description;

// Ensure that if the map is zoomed out such that multiple
// copies of the feature are visible, the popup appears
// over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
            .setLngLat([-99.1672, 19.4196])
            .setHTML("")
            .addTo(map);
    });

// Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'places', function() {
        map.getCanvas().style.cursor = 'pointer';
    });

// Change it back to a pointer when it leaves.
    map.on('mouseleave', 'places', function() {
        map.getCanvas().style.cursor = '';
    });
});






const places = [
    {
        Name: 'El Vilsito'   ,
        Info: '<p><img width="100px" src="images/pastor%20el%20vilsito.jpeg"><br>Hailed as one of the Best Pastor Tacos in Mexico City</p>',
        Coordinates: [- 99.1527, 19.3894]
    },
    {
        Name: 'La Gruta'    ,
        Info: '<p><img width="150px" src="images/gruta.jpeg"><br>Famous Restaurant Inside of a Cave<br> right next to<br>the Pyramid of the Sun (Teotihuacan)</p>',
        Coordinates: [-98.8397,19.6888  ]

    },
    {
        Name: 'Contramar'   ,
        Info: '<p><img width="100px" src="imagesg/contramar.jpg"><br>World Renowned Seafood Restaurant /<br>by<br> Gabriela Camara</p>',
        Coordinates: [-99.1685, 19.4196]

    }

];
places.forEach(function (place){




    var restaurant = new mapboxgl.Popup()
        .setHTML([place.Name+ place.Info])



    var marker = new mapboxgl.Marker().setLngLat(place.Coordinates).addTo(map).setPopup(restaurant);


});





    map.on('click', 'places', function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.description;

// Ensure that if the map is zoomed out such that multiple
// copies of the feature are visible, the popup appears
// over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }


    });



map.on('load', function() {
// Insert the layer beneath any symbol layer.
    var layers = map.getStyle().layers;

    var labelLayerId;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            labelLayerId = layers[i].id;
            break;
        }
    }

    map.addLayer(
        {
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
                'fill-extrusion-color': '#aaa',

// use an 'interpolate' expression to add a smooth transition effect to the
// buildings as the user zooms in
                'fill-extrusion-height': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    15,
                    0,
                    15.05,
                    ['get', 'height']
                ],
                'fill-extrusion-base': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    15,
                    0,
                    15.05,
                    ['get', 'min_height']
                ],
                'fill-extrusion-opacity': 0.6
            }
        },
        labelLayerId
    );
});
var layerList = document.getElementById('menu');
var inputs = layerList.getElementsByTagName('input');

function switchLayer(layer) {
    var layerId = layer.target.id;
    map.setStyle('mapbox://styles/mapbox/' + layerId);
}

for (var i = 0; i < inputs.length; i++) {
    inputs[i].onclick = switchLayer;
}


