        var map;
        var marker;

        // The coordinates for your hotel/stay
        var hotel_latitude = 16.007761186914212;  // Example: Taj Mahal Palace, Mumbai
        var hotel_longitude =  73.49159859660362;

        // Function to initialize the map
        function initMap() {
            // 4. Initialize Mappls Map
            map = new mappls.Map('map', {
                center: { lat: hotel_latitude, lng: hotel_longitude },
                zoom: 16 // A good zoom level to see the hotel
            });

            // After the map loads, add the marker
            map.on('load', function() {
                // Create a marker for the hotel
                marker = new mappls.Marker({
                    position: { lat: hotel_latitude, lng: hotel_longitude },
                    map: map,
                    title: "luxury paradise" // Text that appears on hover
                });
            });
        }

    // This function will check if the Mappls library is ready
    function checkForMappls() {
        // Check if the global 'mappls' object and its 'Map' function exist
        if (typeof mappls !== 'undefined' && mappls.Map) {
            clearInterval(mapplsCheckInterval); // Stop checking
            initMap(); // The library is ready, so initialize the map
        }
    }

    // Start checking for the Mappls library every 100 milliseconds
    const mapplsCheckInterval = setInterval(checkForMappls, 100);