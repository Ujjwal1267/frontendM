import React from "react";
import Hero from "../components/Hero";
import Biography from "../components/Biography";
const map = () => {
  return (
    <>
<!DOCTYPE html>
<html>
<head>
    <title>Live Location with Nearest Hospital and Route</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <!-- Leaflet JavaScript -->
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <style>
        #map {
            height: 800px;
            width: 100%;
        }
    </style>
</head>
<body>
    <h2>Live Location with Nearest Hospital and Route on Leaflet Map</h2>
    <div id="map"></div>
    <script>
        // Initialize the map
        var map = L.map('map').setView([0, 0], 15);

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        var userMarker; // To store the user's location marker
        var hospitalMarkers = []; // To store all hospital markers
        var previousMarker; // To store the previously clicked hospital marker
        var routeLayer; // To store the route polyline

        // Custom icons for hospitals
        var defaultHospitalIcon = L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
            iconSize: [25, 41], // Default size
            iconAnchor: [12, 41]
        });
//https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png
        var enlargedHospitalIcon = L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
            iconSize: [35, 55], // Enlarged size
            iconAnchor: [17, 55]
        });

        // Function to get the user's current location
        function updateLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var lat = position.coords.latitude;
                    var lon = position.coords.longitude;

                    // Set the map view to the current location
                    map.setView([lat, lon], 13);

                    // Add or update the user's location marker
                    if (userMarker) {
                        userMarker.setLatLng([lat, lon]);
                    } else {
                        userMarker = L.marker([lat, lon]).addTo(map);
                        userMarker.bindPopup("You are here!").openPopup();
                    }

                    // Find the nearest hospital
                    findNearestHospital(lat, lon);
                });
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        }

        // Function to find the nearest hospital using Overpass API
        function findNearestHospital(lat, lon) {
            var query = `
                [out:json];
                node(around:5000, ${lat}, ${lon})["amenity"="hospital"];
                out body;
            `;
            var url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query);

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.elements && data.elements.length > 0) {
                        // Clear previous hospital markers
                        hospitalMarkers.forEach(marker => map.removeLayer(marker));
                        hospitalMarkers = [];

                        data.elements.forEach(hospital => {
                            var hospitalLat = hospital.lat;
                            var hospitalLon = hospital.lon;
                            var hospitalName = hospital.tags.name || "Unnamed Hospital";

                            // Add a marker for the hospital
                            var hospitalMarker = L.marker([hospitalLat, hospitalLon], { icon: defaultHospitalIcon }).addTo(map);
                            hospitalMarker.bindPopup(hospitalName);

                            // Add click event to enlarge icon and draw route
                            hospitalMarker.on('click', function() {
                                // Reset the previous marker's icon size
                                if (previousMarker) {
                                    previousMarker.setIcon(defaultHospitalIcon);
                                }

                                // Set the new marker's icon to enlarged
                                this.setIcon(enlargedHospitalIcon);
                                previousMarker = this;

                                // Draw the route to the hospital
                                drawRoute(lat, lon, hospitalLat, hospitalLon);
                            });

                            // Store the hospital marker
                            hospitalMarkers.push(hospitalMarker);
                        });
                    } else {
                        alert('No hospitals found nearby.');
                    }
                })
                .catch(error => {
                    console.error('Error fetching hospital data:', error);
                });
        }

        // Function to draw a route using OpenRouteService
        function drawRoute(startLat, startLon, endLat, endLon) {
            // Clear previous route
            if (routeLayer) {
                map.removeLayer(routeLayer);
            }

            var apiKey = '5b3ce3597851110001cf6248d4fbff4a52a74e0aaa4dd729712fbdbf';
            var url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${startLon},${startLat}&end=${endLon},${endLat}`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    var coordinates = data.features[0].geometry.coordinates;
                    var latlngs = coordinates.map(coord => [coord[1], coord[0]]);

                    // Draw polyline for the route
                    routeLayer = L.polyline(latlngs, { color: 'blue', weight: 5 }).addTo(map);
                    map.fitBounds(routeLayer.getBounds());
                })
                .catch(error => {
                    console.error('Error fetching route data:', error);
                });
        }

        // Update location on page load
        updateLocation();

        // Optionally, update the location at intervals (e.g., every 10 seconds)
        setInterval(updateLocation, 100000); // 10000 ms = 10 seconds
    </script>
</body>
</html>

  );
};

export default AboutUs;
