var atomRadius = 1.25;

var lineColor = 0x36c2fc;
var lineWidth = 2;
// ------------------------------------------
var atomColor = 0xcc0000; // RED for 2nd structure atoms
var atomGeo = new THREE.SphereGeometry(atomRadius, 32, 32);
var atomMat = new THREE.MeshLambertMaterial( { color: atomColor } );

var addCylinder = function(top_r, bottom_r, height, cylinderPosition){
  var cylinderGeo = new THREE.CylinderGeometry( top_r, bottom_r, height, 32 );
  var cylinderMat = new THREE.MeshLambertMaterial( {color: 0x283747} );
  var cylinder = new THREE.Mesh( cylinderGeo, cylinderMat );
  cylinder.position.set(cylinderPosition[0], cylinderPosition[1], cylinderPosition[2]);
  scene.add( cylinder );
}

var addLine = function(coor1, coor2){

  var lineMat = new THREE.LineBasicMaterial({color: lineColor, linewidth: lineWidth});
  var lineGeo = new THREE.Geometry();

  lineGeo.vertices.push(
    new THREE.Vector3(coor1[0], coor1[1], coor1[2]),
    new THREE.Vector3(coor2[0], coor2[1], coor2[2])
  );

  var line = new THREE.Line( lineGeo, lineMat );
  scene.add( line );

};

// ----------- Interpenetration Functions ----------------------
var addAtom = function(coor, atomRadius, atomColor){
	var atomGeo = new THREE.SphereGeometry(atomRadius, 8, 8);
	var atomMat = new THREE.MeshLambertMaterial( { color: atomColor } );
	newAtom = new THREE.Mesh(atomGeo, atomMat);
	newAtom.position.set( coor[0], coor[1], coor[2] );
	scene.add( newAtom );
};

// Speaker Properties ------------------------------------------------------------------------------
var speaker = {color: 0X06171C, height: 40, width: 25, depth: 20};
speaker.geo = new THREE.BoxGeometry( speaker.width, speaker.height, speaker.depth );
speaker.mat = new THREE.MeshLambertMaterial( { color: speaker.color } );
speaker.add = function(speakerCoor){
  mesh = new THREE.Mesh( speaker.geo, speaker.mat );
  mesh.position.set(speakerCoor);
  scene.add(mesh);
};

// Calculating circular coordinates for speakers ---------------------------------------------------
function get_speaker_info(radius, theta, num_of_speakers) {

  var x1 = 0;
  var y1 = 0;
  var positions = [];
  var labels = [8, 9, 10, 11, 12, 13, 14, 15, 16, 7, 6, 5, 4, 3, 2, 1];
  var new_theta = theta / 180 * Math.PI;
  theta = new_theta;
  for (var i = 0; i < num_of_speakers; i++) {
    x = x1 + radius * Math.sin(new_theta);
    y = y1 - radius * (1 - Math.cos(new_theta));
    if (i === Math.round(num_of_speakers / 2)) {
      new_theta = theta;
    }
    if (i < num_of_speakers / 2) {
      new_theta -= theta;
    } else {
      new_theta += theta;
    }
    positions.push([x, y]);
  }
  return {positions: positions, labels: labels};
}

// Adding text -------------------------------------------------------------------------------------
var label = new Object();
label.size = 100;
label.color = 0x800000;
//label.mat = new THREE.MeshBasicMaterial( {color: label.color});
label.add = function(labelCoor, string, size=label.size, color=label.color){
  if (typeof string !== "string") { string = string.toString(); };


  label.mat = new THREE.MeshBasicMaterial( {color: label.color});

  var labelGeo = new THREE.TextGeometry( string, {
    size: size,
    height: 0,
    font: "helvetiker",
    bevelEnabled: true,
    bevelThickness: 0,
    bevelSize: 1
  });
  var text = new THREE.Mesh(labelGeo, label.mat);
  text.position.set(labelCoor[0],labelCoor[1],labelCoor[2]);
  text.rotation.y = Math.PI;
  scene.add( text );
  texts.push( text );
};
