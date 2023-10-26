


        var map = L.map('map', {center: [39.999192, -75.136999], zoom: 11});
    	L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}').addTo(map);
    	map.doubleClickZoom.disable();

        var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZW5ld25hbSIsImEiOiJjbG83cXp6bm0wOGt0MmpvNG9uZGhiNm45In0.qYMc7A5eJWmwFz-jYJbNTw';
    
        var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr}),
            streets  = L.tileLayer(mbUrl, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttr});
    
        var baseMaps = {
        "grayscale": grayscale,
        "streets": streets
        };

        var temple = L.marker([39.981192, -75.155399]);
        var drexel = L.marker([39.957352834066796, -75.18939693143933]);
        var penn = L.marker([39.95285548473699, -75.19309508637147]);

        var universities = L.layerGroup([temple, drexel, penn]);
        var universityLayer = {
        "Phily University": universities
        };

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
            fillColor: setColorFunc(feature.properties.num_bll_5p),
            fillOpacity: 0.9,
            weight: 1,
            opacity: 1,
            color: '#ffffff',
            dashArray: '3'
        };
        }
        
        var neighborhoodsLayer = null;
        $.getJSON("data/blood_lead.geojson",function(data){
        neighborhoodsLayer = L.geoJson(data, {
        style: styleFunc,
        onEachFeature: onEachFeatureFunc
        }).addTo(map);

        var overlayLayer = {
            "blood_lead_level": neighborhoodsLayer,
            "Phily University": universities
        };
        
        L.control.layers(baseMaps, overlayLayer).addTo(map);

        });



        
        // Set function for color ramp, you can use a better palette
        function setColorFunc(density){
            return density > 50 ? '#392057' :
                density > 40 ? '#5c338e' :
                density > 30 ? '#804dbf' :
                density > 20 ? '#a784d2' :
                density > 10 ? '#d7c7eb' :
                density > 0 ? '#efe8f8' :
                                '#BFBCBB';
        };

        // Now we’ll use the onEachFeature option to add the listeners on our state layers:
        function onEachFeatureFunc(feature, layer){
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomFeature
            });
            layer.bindPopup('Blood lead level: '+feature.properties.num_bll_5p);
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
            neighborhoodsLayer.resetStyle(e.target);
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
            div.innerHTML += '<b>Blood lead level</b><br />';
            div.innerHTML += 'by census tract<br />';
            div.innerHTML += '<br>';
            div.innerHTML += '<i style="background: #392057"></i><p>50+</p>';
            div.innerHTML += '<i style="background: #5c338e"></i><p>40-50</p>';
            div.innerHTML += '<i style="background: #804dbf"></i><p>30-40</p>';
            div.innerHTML += '<i style="background: #a784d2"></i><p>20-30</p>';
            div.innerHTML += '<i style="background: #d7c7eb"></i><p>10-20</p>';
            div.innerHTML += '<i style="background: #efe8f8"></i><p>0-10</p>';
            div.innerHTML += '<hr>';
            div.innerHTML += '<i style="background: #BFBCBB"></i><p>No Data</p>';
     
            // Return the Legend div containing the HTML content
            return div;
        };

        // Add Legend to Map
        legend.addTo(map);

        
