/*
  Plugin Name: Geodanmaps
  Plugin URI:  www.geodanmaps.nl
  Description: Geodanmaps plugin to embed multiple maps from different public configurations.
  Version: 0.1
  Author: Gabriel Guita
  Author http://www.geodanmaps.nl
  License: MIT
*/
module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint']);

};