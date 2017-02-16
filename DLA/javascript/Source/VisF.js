// Visualization Functions -------------------------------------------------------------------------
var black = 0x000000;
var blue = 0x0055ff;
var red = 0xcc0000;
var green = 0x009933;
var purple = 0x990099;

var red_color = [255.0, 13.0, 13.0];

var addBall = function(coor, ballRadius, ballColor){
	var ballGeo = new THREE.SphereGeometry(ballRadius, 8, 8);
	var rgbColor = new THREE.Color();
	rgbColor.setRGB(ballColor[0]/255, ballColor[1]/255, ballColor[2]/255);
	var ballMat = new THREE.MeshLambertMaterial( { color: rgbColor } );
	newBall = new THREE.Mesh(ballGeo, ballMat);
	newBall.position.set( coor[0], coor[1], coor[2] );
	scene.add( newBall );
};

var addLine = function(coor1, coor2, lineColor){
  var lineMat = new THREE.LineBasicMaterial({color: lineColor, linewidth: 5});
  var lineGeo = new THREE.Geometry();
  lineGeo.vertices.push(
  new THREE.Vector3(coor1[0], coor1[1], coor1[2]),
  new THREE.Vector3(coor2[0], coor2[1], coor2[2])
  );
  var line = new THREE.Line( lineGeo, lineMat );
  scene.add( line );
};
