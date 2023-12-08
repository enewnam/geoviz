        var map = L.map('map', {center: [39.999192, -75.136999], zoom: 14});
    	L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png').addTo(map);
    	map.doubleClickZoom.disable();

        var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        mbUrl = 'https://tiles.stadiamaps.com/tiles/{id}/{z}/{x}/{y}{r}.png?api_key=6548ac8d-2ea1-4db5-8ff6-dfde7b83f99c';
    
        var grayscale = L.tileLayer(mbUrl, {id: 'alidade_smooth', tileSize: 512, zoomOffset: -1, attribution: mbAttr});

        var streets = L.tileLayer(mbUrl, {id: 'outdoors', tileSize: 512, zoomOffset: -1, attribution: mbAttr});

        // Create an Empty Popup
        var popup = L.popup();

        // Write function to set Properties of the Popup
        function onMapClick(e) {
            popup
                .setLatLng(e.latlng)
                .setContent("You clicked the map at " + e.latlng.toString())
                .openOn(map);
        }

        // Listen for a click event on the Map element
        map.on('click', onMapClick);
        
        // Set style function that sets fill color property equal to blood lead
        function styleFunc(feature) {
        return {
            fillColor: setColorFunc(feature.properties.TotalCount),
            fillOpacity: 0.7,
            weight: 1,
            opacity: 1,
            color: '#ffffff',
            dashArray: '3'
        };
        }
        
        
        var CensusBlocksLayer = null;
        $.getJSON("walkability2.geojson",function(data){
        CensusBlocksLayer = L.geoJson(data, {
        style: styleFunc,
        onEachFeature: onEachFeatureFunc
        }).addTo(map);
        });

        
        // Set function for color ramp, you can use a better palette
        function setColorFunc(density){
            return density > 2 ? '#3c1336' :
                density > 1 ? '#822ec9' :
                density > 0 ? '#7b6df4' :
                density > -1 ? '#76b6f8' :
                                '#BFBCBB';
        };

        // Now we’ll use the onEachFeature option to add the listeners on our state layers:
        function onEachFeatureFunc(feature, layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomFeature
            });
        
            // Use conditional checks to replace undefined or null values with "none"
            var comcor = feature.properties.ComCor || 'none';
            var farmar = feature.properties.Markets || 'none';
            var corsto = feature.properties.Stores || 'none';
        
            layer.bindPopup('<b>Commercial Corridors:</b> ' + comcor +
                '<br><b>Farmers Markets:</b> ' + farmar +
                '<br><b>Corner Stores:</b> ' + corsto);
        }

    
        function highlightFeature(e){
            var layer = e.target;
        
            layer.setStyle({
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.7
            });
            // for different web browsers
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }
        }

        // Define what happens on mouseout:
        function resetHighlight(e) {
            CensusBlocksLayer.resetStyle(e.target);
        }

        // As an additional touch, let’s define a click listener that zooms to the state: 
        function zoomFeature(e){
            console.log(e.target.getBounds());
            map.fitBounds(e.target.getBounds().pad(1.5));
        }

        // Add Scale Bar to Map
        L.control.scale({position: 'bottomleft', maxWidth: 200}).addTo(map);

        // Create Leaflet Control Object for Legend
        var legend = L.control({position: 'bottomright'});

        // Function that runs when legend is added to map
        legend.onAdd = function (map) {
            // Create Div Element and Populate it with HTML
            var div = L.DomUtil.create('div', 'legend');            
            div.innerHTML += '<b>Destinations</b><br />';
            div.innerHTML += 'by census block<br />';
            div.innerHTML += '<br>';
            div.innerHTML += '<i style="background: #3c1336"></i><p>3+</p>';
            div.innerHTML += '<i style="background: #822ec9"></i><p>2</p>';
            div.innerHTML += '<i style="background: #7b6df4"></i><p>1</p>';
            div.innerHTML += '<i style="background: #76b6f8"></i><p>0</p>';
            div.innerHTML += '<hr>';
            div.innerHTML += '<i style="background: #BFBCBB"></i><p>No Data</p>';
     
            // Return the Legend div containing the HTML content
            return div;
        };

        // Add Legend to Map
        legend.addTo(map);


        var map2 = L.map('map2', {center: [39.999192, -75.136999], zoom: 11});
    	L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png').addTo(map2);
    	map.doubleClickZoom.disable();

        var geojsonLayer2 = null;
        $.getJSON("commerce.geojson", function(data) {
            geojsonLayer2 = L.geoJson(data, {
                style: function(feature) {
                    // Customize the style based on the properties of each feature
                    return {
                        fillColor: 'orange',  // Change this to the desired fill color
                        color: 'black',      // Change this to the desired border color
                        weight: 1,            // Change this to the desired border weight
                        opacity: 1,           // Change this to the desired border opacity
                        fillOpacity: 0.7      // Change this to the desired fill opacity
                    };
                }
            });
        });

        var geojsonLayer3 = null;
        $.getJSON("cornerstores.geojson", function(data) {
            geojsonLayer3 = L.geoJson(data, {
                pointToLayer: function(feature, latlng) {
                    // Customize the marker based on the properties of each feature
                    return L.circleMarker(latlng, {
                        radius: 4,
                        fillColor: 'yellow',  // Change this to the desired fill color
                        color: 'black',      // Change this to the desired border color
                        weight: 1,            // Change this to the desired border weight
                        opacity: 1,           // Change this to the desired border opacity
                        fillOpacity: 0.7      // Change this to the desired fill opacity
                    });
                }
            });
        });

        var geojsonLayer4 = null;
        $.getJSON("farmersmarkets.geojson", function(data) {
            geojsonLayer4 = L.geoJson(data, {
                pointToLayer: function(feature, latlng) {
                    // Customize the marker based on the properties of each feature
                    return L.circleMarker(latlng, {
                        radius: 4,
                        fillColor: 'lime',  // Change this to the desired fill color
                        color: 'black',      // Change this to the desired border color
                        weight: 1,            // Change this to the desired border weight
                        opacity: 1,           // Change this to the desired border opacity
                        fillOpacity: 0.7      // Change this to the desired fill opacity
                    });
                }
            });
        });

        var baseMaps = {
            "Grayscale": grayscale,
            "Streets": streets
            };

        
        // Create an Empty Popup
        var popup2 = L.popup();

        // Write function to set Properties of the Popup
        function onMapClick(e) {
            popup2
                .setLatLng(e.latlng)
                .setContent("You clicked the map at " + e.latlng.toString())
                .openOn(map2);
        }

        // Listen for a click event on the Map element
        map2.on('click', onMapClick);

        // Set style function that sets fill color property equal to blood lead
        function styleFunc2(feature2) {
        return {
            fillColor: setColorFunc2(feature2.properties.TOTCOUNT),
            fillOpacity: 0.9,
            weight: 1,
            opacity: 1,
            color: '#ffffff',
            dashArray: '3'
        };
        }

        var NeighborhoodLayer = null;
        $.getJSON("NeighborhoodsCCFMCS2.geojson",function(data){
        NeighborhoodLayer = L.geoJson(data, {
        style: styleFunc2,
        onEachFeature: onEachFeatureFunc2
        }).addTo(map2);

        var overlayLayer2 = {
            "Census Blocks": NeighborhoodLayer,
            "Commercial Corridors": geojsonLayer2,
            "Corner Stores": geojsonLayer3,
            "Farmers Markets": geojsonLayer4
        };
        
        L.control.layers(baseMaps, overlayLayer2).addTo(map2);

        });

        // Set function for color ramp, you can use a better palette
        function setColorFunc2(density){
            return density > 15 ? '#3c1336' :
                density > 10 ? '#822ec9' :
                density > 5 ? '#7b6df4' :
                density > -1 ? '#76b6f8' :
                                '#BFBCBB';
        };



        function onEachFeatureFunc2(feature2, layer2) {
            layer2.on({
                mouseover: highlightFeature2,
                mouseout: resetHighlight2,
                click: zoomFeature2
            });
        
            // Use conditional checks to replace undefined or null values with "none"
            var neighborhood = feature2.properties.LISTNAME || 'none';
            var fmName = feature2.properties.Markets || 'none';
            var stores = feature2.properties.Stores || 'none';
            var ccName = feature2.properties.ComCors || 'none';
        
            layer2.bindPopup('<b>Neighborhood:</b> ' + neighborhood +
                '<br><b>Farmers Markets:</b> ' + fmName +
                '<br><b>Stores:</b> ' + stores +
                '<br><b>Commercial Centers:</b> ' + ccName);
        }


        function highlightFeature2(e2){
            var layer2 = e2.target;
        
            layer2.setStyle({
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.7
            });
            // for different web browsers
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer2.bringToFront();
            }
        }

        // Define what happens on mouseout:
        function resetHighlight2(e2) {
            NeighborhoodLayer.resetStyle(e2.target);
        }

        // As an additional touch, let’s define a click listener that zooms to the state: 
        function zoomFeature2(e2){
            console.log(e2.target.getBounds());
            map2.fitBounds(e2.target.getBounds().pad(1.5));
        }

        // Add Scale Bar to Map
        L.control.scale({position: 'bottomleft', maxWidth: 200}).addTo(map2);


        // Create Leaflet Control Object for Legend
        var legend2 = L.control({position: 'bottomright'});

        // Function that runs when legend is added to map
        legend2.onAdd = function (map2) {
            // Create Div Element and Populate it with HTML
            var div = L.DomUtil.create('div', 'legend');            
            div.innerHTML += '<b>Destinations</b><br />';
            div.innerHTML += 'by neighborhood<br />';
            div.innerHTML += '<br>';
            div.innerHTML += '<i style="background: #3c1336"></i><p>16+</p>';
            div.innerHTML += '<i style="background: #822ec9"></i><p>11-15</p>';
            div.innerHTML += '<i style="background: #7b6df4"></i><p>6-10</p>';
            div.innerHTML += '<i style="background: #76b6f8"></i><p>0-5</p>';
            div.innerHTML += '<hr>';
            div.innerHTML += '<i style="background: #BFBCBB"></i><p>No Data</p>';
     
            // Return the Legend div containing the HTML content
            return div;
        };

        // Add Legend to Map
        legend2.addTo(map2);