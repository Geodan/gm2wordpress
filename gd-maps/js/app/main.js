define(
	['gdmap-config2ol'],
    function(G) {
        'use strict';

        return {

            initialize: function() {
				var map = new G.config2ol.Map('map');		
				map.createMapFromConfiguration(
					urlApi,
					orgCode,
					'config',
					confValue,
					{
						context: this
					}).then(function()

					{
						map.map.zoomToMaxExtent();
						var newLan = 105000;
						var newLat = 489000;
						var zoom = map.map.zoom;
						map.map.setCenter(new OpenLayers.LonLat(newLan, newLat), zoomLevel);

					}, function(e)
					{
						console.log('this is the error');
						console.log(e);
					});


				//getJson from url based on public configurations
				var getJSON = function(publicUrlHaar) {
					return new Promise(function(resolve, reject) {
						var xhr = new XMLHttpRequest();
						xhr.open('get', publicUrlHaar, true);
						xhr.responseType = 'json';
						xhr.onload = function() {
							var status = xhr.status;
							if (status == 200) {
								resolve(xhr.response);
							} else {
								reject(status);
							}
						};
						xhr.send();
					});
				};

				getJSON(publicUrlHaar).then(function(data) {
					$('#selectConf').empty();
					$.each(data, function(i, data){
						$('#selectConf').append($('<option>').text(data.title).attr('value', data.name).attr('name', data.name));
					});

					$('#selectConf').val();
					 
					var hiddenField = $('#gd_map_selectConf_value').val();
					$( "option[value='"+hiddenField+"']" ).prop('selected', true);

				}, function(status) {
					//error detection....
					var status = status;
					if (status == '404'){
						alert("Current organisation code doesn't exist, please try again.");
					}

					console.log(status + ' Something went wrong..');
				});

				$("#selectConf").change(function(){

					$(this[this.selectedIndex]).val();
					$(this[this.selectedIndex]).text();
					$('#gd_map_selectConf_value').val($(this[this.selectedIndex]).val());

				 	$('#gd_map_selectConf_value').text($(this[this.selectedIndex]).text());
					var dynamicConfName = $('#gd_map_selectConf_value').val();
		 
					$('#map > div').remove();
					map.createMapFromConfiguration(
					urlApi,
					orgCode,
					'config',
					dynamicConfName,
					{
						context: this
					}).then(function()

					{
						map.map.zoomToMaxExtent();
						var newLan = 105000;
						var newLat = 489000;
						var zoom = map.map.zoom;
						map.map.setCenter(new OpenLayers.LonLat(newLan, newLat), zoomLevel);

					}, function(e)
					{
						console.log('this is the error');
						console.log(e);
					});
 
				});

			},

        };

    }
);


