<?php
/*
  Plugin Name: Geodanmaps
  Plugin URI:  www.geodanmaps.nl
  Description: Geodanmaps plugin to embed multiple maps from different public configurations.
  Version: 0.1
  Author: Gabriel Guita
  Author http://www.geodanmaps.nl
  License: MIT
*/

function add_map_section() {
    add_meta_box( 'geodanmaps-container', 'GeodanMaps', 'add_inputs', 'page' );
}

add_action( 'add_meta_boxes', 'add_map_section' );

//**** backend wordpress plugin block on each page ****
function add_inputs( $post ) {


$gd_map_selectConf_value = get_post_meta( $post->ID, 'gd_map_selectConf_value', true );
$gd_map_api_code = get_post_meta( $post->ID, 'gd_map_api_code', true );
$gd_map_zoom_lvl = get_post_meta( $post->ID, 'gd_map_zoom_lvl', true );
$gd_map_width = get_post_meta( $post->ID, 'gd_map_width', true );
$gd_map_height = get_post_meta( $post->ID, 'gd_map_height', true );

$postContent = '<script src="../wp-content/plugins/gd-maps/bower_components/system.js/dist/system.js"></script>';
$postContent .= '<script src="../wp-content/plugins/gd-maps/js/systemConfig.js"></script>';

$postContent .= '<link href="../wp-content/plugins/gd-maps/bower_components/OpenLayers/theme/default/style.css" type="text/css" rel="stylesheet"/>';
$postContent .= '<link href="../wp-content/plugins/gd-maps/css/style.css" type="text/css" rel="stylesheet" />';
$postContent .= '<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js" type="text/javascript"></script>';
$postContent .= '<table class="form-table gd-map-plugin "' . $gd_map_selectConf_value . '">';
$postContent .= '<tr valign="top" ><td>';
$postContent .= '<p>List of public configurations:</p>'; 
$postContent .= '<select id="selectConf" name="selectConf_name"></select>'; 
$postContent .= '<input type="hidden" id="gd_map_selectConf_value" name="gd_map_selectConf_value" value="'.$gd_map_selectConf_value.'" />'; 
$postContent .= '<small>Select configuration name for displaying the map.</small>'; 
$postContent .= ' </td></tr>'; 
$postContent .= ' <tr valign="top"><td>'; 
$postContent .= '<p>API KEY:</p>'; 
$postContent .= '<input type="text" name="gd_map_api_code" id="gd_map_api_code" value="'.$gd_map_api_code.'" placeholder="Apikey value" />'; 
$postContent .= '<small>Put here the apikey for displaying the map <br/> (default apikey is <i>GEME7495HAAR</i>).</small>'; 
$postContent .= '</td> </tr>'; 
$postContent .= ' <tr valign="top"><td>'; 
$postContent .= '<p>Zoom level:</p>'; 
$postContent .= '<input type="text" name="gd_map_zoom_lvl" id="gd_map_zoom_lvl" value="'.$gd_map_zoom_lvl.'" placeholder="Zoom level"/>'; 
$postContent .= '<small>Put here the zoom number for displaying the size of the map <br/> (default value is 4).</small>'; 
$postContent .= '</td></tr>'; 
$postContent .= '<tr valign="top"><td>'; 
$postContent .= '<p>Map width:</p>'; 
$postContent .= '<input type="text" name="gd_map_width" id="gd_map_width" value="'. $gd_map_width . '" placeholder="Width value" />'; 
$postContent .= ' <small>Default is 100%, dont forget the unit.</small>'; 
$postContent .= '</td> </tr>'; 
$postContent .= '<tr valign="top"><td>'; 
$postContent .= '<p>Map height:</p>'; 
$postContent .= '<input type="text" name="gd_map_height" id="gd_map_height" value="'. $gd_map_height. '" placeholder="Height value"/>'; 
$postContent .= ' <small>Default is 560px, dont forget the unit.</small>'; 
$postContent .= '</td></tr>'; 
$postContent .= '<tr valign="top"><td><span id="insertButton" class="button button-primary button-large">Insert map</span></td></tr>'; 
$postContent .= '</table>'; 
$postContent .= '<div id="map" class="admin-map"></div>'; 

$postContent .= "
<script>
  var orgCode = ". '\'' .$gd_map_selectConf_value . '\';' ."
  var zoomLevel = ". '\'' . $gd_map_zoom_lvl . '\';' ."
  if(orgCode === ''){
      var orgCode = 'GEME7495HAAR';
  }else{
    var orgCode = ". '\'' .$gd_map_api_code . '\';' ."
  }

  if(zoomLevel === ''){
      var zoomLevel = 3;
  }else{
    var zoomLevel =  ". '\'' . $gd_map_zoom_lvl . '\';' ."
  }
  var confValue = ". '\'' .$gd_map_selectConf_value . '\';' ."
  var urlApi = 'https://services.geodan.nl/public/document/wiebenik/api/';
  var publicUrlHaar = urlApi + orgCode + '/config/';
</script>";

echo $postContent;
return $postContent;
wp_reset_query();
}

//**** saving function - for all fields ****
function save( $post_id ) {    

  $gd_map_selectConf_value = sanitize_text_field( $_POST['gd_map_selectConf_value'] );
  update_post_meta( $post_id, 'gd_map_selectConf_value', $gd_map_selectConf_value );

  $gd_map_api_code = sanitize_text_field( $_POST['gd_map_api_code'] );
  update_post_meta( $post_id, 'gd_map_api_code', $gd_map_api_code );

  $gd_map_zoom_lvl = sanitize_text_field( $_POST['gd_map_zoom_lvl'] );
  update_post_meta( $post_id, 'gd_map_zoom_lvl', $gd_map_zoom_lvl );

  $gd_map_width = sanitize_text_field( $_POST['gd_map_width'] );
  update_post_meta( $post_id, 'gd_map_width', $gd_map_width );

  $gd_map_height = sanitize_text_field( $_POST['gd_map_height'] );
  update_post_meta( $post_id, 'gd_map_height', $gd_map_height );

}
add_action( 'save_post', 'save' );

//**** display map on frontend ****
function multiple_maps($atts) {
   extract(shortcode_atts(array(
      'width' => 400,
      'height' => 200,
      'id' => 'someId',
      'data' => 'data'

   ), $atts));

$showMap ='<link href="../wp-content/plugins/gd-maps/bower_components/OpenLayers/theme/default/style.css" type="text/css" rel="stylesheet"/>';
$showMap .= '<link href="../wp-content/plugins/gd-maps/css/style.css" type="text/css" rel="stylesheet" />';
$showMap .= '<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js" type="text/javascript"></script>';
$showMap .= '<div class="embedded-map">';
$showMap .= '<object style="top: 0; bottom: 0; left: 0; right: 0;" data="http://services.geodan.nl/public/viewer/?config='. $data .'&amp;a='. $id .'" ';
$showMap .= 'width="' . $width .'" height="' . $height .'">';
$showMap .= '<embed src="http://services.geodan.nl/public/viewer/?config='. $data .'&amp;a='. $id .'" width="'. $width .'" height="' . $height .'">';
$showMap .= '</object>';
$showMap .= '</div>';

  return $showMap;
}

add_shortcode('gd-maps', 'multiple_maps');

   function _add_my_quicktags()
    {
     ?>
     <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js" type="text/javascript"></script>
      <script type="text/javascript">

        var confMapValue = $('#gd_map_selectConf_value');
        var apiMapValue = $('#gd_map_api_code');
        var widthMapValue = $('#gd_map_width');
        var heightMapValue = $('#gd_map_height');
        var zoomMapValue = $('#gd_map_zoom_lvl');

        $("#insertButton").click(function() { 

          if( ! tinyMCE.activeEditor || tinyMCE.activeEditor.isHidden()) {
            jQuery('textarea#content').val('[gd-maps data="' + confMapValue.val() + '" id="' + apiMapValue.val() + '" width="' + widthMapValue.val() + '" height="' + heightMapValue.val() +'"]');
          } else {
            tinyMCE.execCommand('mceInsertRawHTML', false, '[gd-maps name="'+ confMapValue.text() +'" data="' + confMapValue.val() + '" id="' + apiMapValue.val() + '" width="' + widthMapValue.val() + '" height="' + heightMapValue.val() +'"]');
          }

        });

      </script>
<?php }
add_action('admin_print_footer_scripts',  '_add_my_quicktags');
?>