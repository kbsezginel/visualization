var atomRadius = 1.25;

var lineColor = 0x36c2fc;
var lineWidth = 2;
// ------------------------------------------
var atomColor = 0xcc0000; // RED for 2nd structure atoms
var atomGeo = new THREE.SphereGeometry(atomRadius, 32, 32);
var atomMat = new THREE.MeshLambertMaterial( { color: atomColor } );

var initializeAtoms = function(Atoms,atomColor){
	var sphereGeo = new THREE.SphereGeometry(atomRadius, 32, 32);
	var sphereMat = new THREE.MeshLambertMaterial( { color: atomColor } );
	var sphere;

	for(var i = 0; i <= Atoms.length-1; i++){
		sphere = new THREE.Mesh(sphereGeo,sphereMat);
		sphere.position.set( Atoms[i][0], Atoms[i][1], Atoms[i][2] );
		atomObjects.push(sphere);
		scene.add( sphere );
	};
};
// ---------------------------- Feb 23 -----------------------------------------
var reset = function(){
	idx = 0;
	for( var i = scene.children.length - 1; i >= objectNumber; i--) {
		obj = scene.children[i];
		scene.remove(obj);
	};
};

var findEmapIndex = function(coor, decimal, minCoor, maxCoor){
	var gridSize = Math.abs(minCoor) + Math.abs(maxCoor);
	for(var i = 0; i < 3; i++){
		coor[i] = Math.round(coor[i]*decimal)/decimal;
	};
	var eMapIndex = (coor[0]-minCoor)*Math.pow(gridSize+1,2) + (coor[1]-minCoor)*(gridSize+1) + coor[2]-minCoor;
	return eMapIndex;
};

var PBC = function(coor, cutOff){
	var pbcCoor = [];
	for(var i = 0; i < coor.length; i++){
		if(Math.abs(coor[i]) > cutOff){
			pbcCoor[i] = coor[i] - Math.sign(coor[i])*(2*cutOff);
		} else{
			pbcCoor[i] = coor[i];
		}
	};
	return pbcCoor;
};

//------------------------------------------------------------------------------
var calculateBonds = function(Atoms, bondLength){
	var distance, j;
	for(var i = 0; i <= Atoms.length-1; i++){
		j = i + 1;
		while(j <= Atoms.length-1){
			distance = coorDist(Atoms[i], Atoms[j]);
			if(distance === bondLength){
				addLine(Atoms[i], Atoms[j]);
			};
			j++;
		};
	};
};

var calculateCubeCoordinates = function(sideLength, bondLength){
	var coordinates = [];
	var i = 0;
	for(var x = 0;  x <= sideLength; x = x + bondLength){
		coordinates[i] = [];
		coordinates[i][0] = x;
		for(var y = 0;  y <= sideLength; y = y + bondLength){
			coordinates[i] = [x,y,[]];
			for(var z = 0;  z <= sideLength; z = z + bondLength){
				coordinates[i] = [x,y,z];
				i++;
			};
		};
	};
	return coordinates;
};

var plotEnergyMap = function(energyMap,maxEnergy,minEnergy){
	var dotGeo, dotMat, dot, colorCode;
	var color = new THREE.Color();
	for(var i = 0; i < energyMap.length; i++){
		if(energyMap[i][3] > 0.8*maxEnergy){
			colorCode = 1;
		} else{
			//colorCode = energyMap[i][3];
			colorCode = (energyMap[i][3] - minEnergy) / (maxEnergy*1E-8 - minEnergy);
			//colorCode = colorCode * 10000 - 9999;
			colorCode = colorCode / 2 + 0.5;
			//console.log(colorCode);
		};
		color.setHSL(colorCode,0.8,0.5);
		//dotGeo = new THREE.Geometry();
		dotGeo = new THREE.SphereGeometry(0.5);
		//dotGeo.vertices.push(new THREE.Vector3( energyMap[i][0], energyMap[i][1], energyMap[i][2] ));
		dotMat = new THREE.MeshLambertMaterial( { color: color } );
		//dotMat = new THREE.PointsMaterial( { size: 15, sizeAttenuation: false , color: color} );
		dot = new THREE.Mesh(dotGeo,dotMat);
		//dot = new THREE.Points( dotGeo, dotMat );
		dot.position.set(energyMap[i][0], energyMap[i][1], energyMap[i][2]);
		scene.add( dot );
	};
};

var findAtomType = function(atomSymbol){
	var atomIndex;
	switch(atomSymbol){
		case 'H':
			atomIndex = 3;
			break;
		case 'C':
			atomIndex = 4;
			break;
		case 'O':
			atomIndex = 5;
			break;
		case 'Zn':
			atomIndex = 6;
			break;
	};
	return atomIndex;
};

var moveCubeCoordinates = function(cubeCoor, cutOff){
	var coordinates = [];
	for(var i = 0; i < cubeCoor.length; i++){
		coordinates[i] = [];
		coordinates[i][0] = cubeCoor[i][0] - cutOff;
		coordinates[i][1] = cubeCoor[i][1] - cutOff;
		coordinates[i][2] = cubeCoor[i][2] - cutOff;
	};
	return coordinates;
};

var clearExtraCoordinates = function(cutOff){
	var coordinates = [];

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

var coorDist = function(coor1, coor2){
        var dx = coor2[0] - coor1[0];
        var dy = coor2[1] - coor1[1];
        var dz = coor2[2] - coor1[2];

        var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2) + Math.pow(dz,2));
        return distance;
};

var coorDiff = function(coor1, coor2){
  var coor3 = [coor2[0]-coor1[0], coor2[1]-coor1[1], coor2[2]-coor1[2]];
  return coor3;
};

var coorAdd = function(coor1, coor2){
  var coor3 = [coor2[0]+coor1[0], coor2[1]+coor1[1], coor2[2]+coor1[2]];
  return coor3;
};

// ----------- Interpenetration Functions ----------------------
var addAtom = function(coor, atomRadius, atomColor){
	var atomGeo = new THREE.SphereGeometry(atomRadius, 8, 8);
	var atomMat = new THREE.MeshLambertMaterial( { color: atomColor } );
	newAtom = new THREE.Mesh(atomGeo, atomMat);
	newAtom.position.set( coor[0], coor[1], coor[2] );
	scene.add( newAtom );
};


// Sort according to the 3rd value of a multidimensional array
// array.sort(sortFunction)
function sortFunction(a, b) {
    if (a[3] === b[3]) {
        return 0;
    }
    else {
        return (a[3] < b[3]) ? -1 : 1;
    }
};

var findHighEnergyIndex = function(energyMap, highEnergy) {
	for(var i = energyMap.length-1; i >= 0; i--){
		if(energyMap[i][3] < highEnergy) {
			var highEnergyIndex = i;
			break;
		};
	};
	return highEnergyIndex;
};

var calculateSphereEnergy = function(initalCoor, energyMap, bondLength, tolerance) {
	var distance;
	var coor = [];
	var lowerBound = bondLength * (100-tolerance) / 100; // tolerance in percent value
	var upperBound = 2*bondLength - lowerBound;
	var sphereEnergy = [];
	for(var i = 0; i < energyMap.length; i++){
		coor = [energyMap[i][0], energyMap[i][1], energyMap[i][2]];
		distance = coorDist(initialCoor, coor);
		if(distance > upperBound || distance < lowerBound){ continue; };
		sphereEnergy.push(energyMap[i]);
	};
	return sphereEnergy;
};

var recordStructure = function(S1, S2, structureIndex){
	console.log(S1.length + S2.length);
	console.log("IP Cube" + structureIndex);
	for(var i = 0; i < S1.length; i++){
		console.log("C "+ S1[i][0] + " " + S1[i][1] + " " + S1[i][2]);
	};
	for(var i = 0; i < S2.length; i++){
		console.log("O "+ S2[i][0] + " " + S2[i][1] + " " + S2[i][2]);
	};
	console.log("--------------------------------------------------------------");
};
// Quaternion Functions --------------------------------------------------------
function quaternion(w,x,y,z) {
  this.w = w;
  this.x = x;
  this.y = y;
  this.z = z;
  this.mult = function(Q1,Q2){
    var Q3 = new quaternion();
    Q3.w = Q1.w*Q2.w - Q1.x*Q2.x - Q1.y*Q2.y - Q1.z*Q2.z;
    Q3.x = Q1.x*Q2.w + Q1.w*Q2.x - Q1.z*Q2.y + Q1.y*Q2.z;
    Q3.y = Q1.y*Q2.w + Q1.z*Q2.x + Q1.w*Q2.y - Q1.x*Q2.z;
    Q3.z = Q1.z*Q2.w - Q1.y*Q2.x + Q1.x*Q2.y + Q1.w*Q2.z;
    return Q3;
  };
  this.conj = function(){
    var Qcon = new quaternion();
    Qcon.w = this.w;
    Qcon.x = -this.x;
    Qcon.y = -this.y;
    Qcon.z = -this.z;
    return Qcon;
  };
  this.inv = function(){
    var norm = Math.pow(this.w,2) + Math.pow(this.x,2) + Math.pow(this.y,2) + Math.pow(this.z,2);
    var Qinv = new quaternion();
    Qinv.w = this.w / norm;
    Qinv.x = -this.x / norm;
    Qinv.y = -this.y / norm;
    Qinv.z = -this.z / norm;
    return Qinv;
  };
  this.rotation = function(point,axisPoint1,axisPoint2,rotationAngle){
    var i = axisPoint2[0] - axisPoint1[0];
    var j = axisPoint2[1] - axisPoint1[1];
    var k = axisPoint2[2] - axisPoint1[2];
    var length = Math.sqrt( Math.pow(i,2) + Math.pow(j,2) + Math.pow(k,2) );
    i = i / length;
    j = j / length;
    k = k / length;
    var Qp = new quaternion();
    Qp.w = 0;
    Qp.x = point[0] - axisPoint2[0];
    Qp.y = point[1] - axisPoint2[1];
    Qp.z = point[2] - axisPoint2[2];
    var Qrot = new quaternion();
    Qrot.w = Math.cos(rotationAngle / 2.0);
    Qrot.x = Math.sin(rotationAngle / 2.0) * i;
    Qrot.y = Math.sin(rotationAngle / 2.0) * j;
    Qrot.z = Math.sin(rotationAngle / 2.0) * k;
    var Q = this.mult(this.mult(Qrot,Qp),Qrot.inv());
    Q.x = Q.x + axisPoint2[0];
    Q.y = Q.y + axisPoint2[1];
    Q.z = Q.z + axisPoint2[2];
    return Q;
  };
};

// ------------ Animation Functions --------------

var addBuildingBlock = function(coor, bondLength){

}
