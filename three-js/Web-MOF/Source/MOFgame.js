var atomRadius = 10;

var lineColor = 0x36c2fc;
var lineWidth = 2;
// ------------------------------------------
var atomColor = 0xcc0000; // RED for 2nd structure atoms
var atomGeo = new THREE.SphereGeometry(atomRadius, 32, 32);
var atomMat = new THREE.MeshLambertMaterial( { color: atomColor } );

var TexLoad = new THREE.TextureLoader();

var addBox = function(height, width, depth, boxColor, image=undefined){
  boxGeo = new THREE.BoxGeometry( width, height, depth );
  // Check threejs examples for textuting with local urls
  if(image !== undefined){
    boxMat = new THREE.MeshPhongMaterial({map: TexLoad.load(image)});
  } else{
    boxMat = new THREE.MeshLambertMaterial({ color: boxColor });
  }

  boxMesh = new THREE.Mesh( boxGeo, boxMat );
  scene.add(boxMesh);
  return boxMesh;
}

var addCylinder = function(top_r, bottom_r, height, cylinderPosition){
  var cylinderGeo = new THREE.CylinderGeometry( top_r, bottom_r, height, 32 );
  var cylinderMat = new THREE.MeshLambertMaterial( {color: 0x283747} );
  var cylinder = new THREE.Mesh( cylinderGeo, cylinderMat );
  cylinder.position.set(cylinderPosition[0], cylinderPosition[1], cylinderPosition[2]);
  scene.add( cylinder );
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
  return text;
};
