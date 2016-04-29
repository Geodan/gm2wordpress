/*
  Plugin Name: Geodanmaps
  Plugin URI:  www.geodanmaps.nl
  Description: Geodanmaps plugin to embed multiple maps from different public configurations.
  Version: 0.1
  Author: Gabriel Guita
  Author http://www.geodanmaps.nl
  License: MIT
*/
System.config({
	transpiler: 'babel',
	map: {
		app: '../wp-content/plugins/gd-maps/js/app'
	},
	paths: {
		babel: '../wp-content/plugins/gd-maps/bower_components/babel/browser.min.js',
		jquery: '../wp-content/plugins/gd-maps/bower_components/jquery/dist/jquery.min.js',
		openlayers: '../wp-content/plugins/gd-maps/bower_components/OpenLayers/OpenLayers.js',
		'gdmap-core': '../wp-content/plugins/gd-maps/bower_components/gdmap-core/dist/gdmap-core.min.js',
		'gdmap-config': '../wp-content/plugins/gd-maps/bower_components/gdmap-config/dist/gdmap-config.min.js',
		'gdmap-config2ol': '../wp-content/plugins/gd-maps/bower_components/gdmap-config2ol/dist/gdmap-config2ol.min.js'
	},

	meta: {
		openlayers: {
			exports: 'OpenLayers'
		}
	}
});

System.import('../wp-content/plugins/gd-maps/js/app/main.js').then(function(main) {
	main.initialize();
});
