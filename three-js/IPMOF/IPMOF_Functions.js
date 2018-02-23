// --------------------------------- Animation Functions -------------------------------------------
var black = 0x000000;
var blue = 0x0055ff;
var red = 0xcc0000;
var green = 0x009933;
var purple = 0x990099;
var lineWidth = 10;

var addAtom = function(coor, atomRadius, atomColor){
	var atomGeo = new THREE.SphereGeometry(atomRadius, 8, 8);
	var rgbColor = new THREE.Color();
	rgbColor.setRGB(atomColor[0]/255, atomColor[1]/255, atomColor[2]/255);
	var atomMat = new THREE.MeshLambertMaterial( { color: rgbColor } );
	newAtom = new THREE.Mesh(atomGeo, atomMat);
	newAtom.position.set( coor[0], coor[1], coor[2] );
	scene.add( newAtom );
};

var addLine = function(coor1, coor2, lineColor){
  var lineMat = new THREE.LineBasicMaterial({color: lineColor, linewidth: lineWidth});
  var lineGeo = new THREE.Geometry();
  lineGeo.vertices.push(
  new THREE.Vector3(coor1[0], coor1[1], coor1[2]),
  new THREE.Vector3(coor2[0], coor2[1], coor2[2])
  );
  var line = new THREE.Line( lineGeo, lineMat );
  scene.add( line );
};

var drawUnitCell = function(edgePoints){
	addLine(edgePoints[0], edgePoints[1], red);
	addLine(edgePoints[0], edgePoints[2], green);
	addLine(edgePoints[0], edgePoints[3], blue);
	addLine(edgePoints[1], edgePoints[4], black);
	addLine(edgePoints[1], edgePoints[6], black);
	addLine(edgePoints[2], edgePoints[4], black);
	addLine(edgePoints[2], edgePoints[5], black);
	addLine(edgePoints[3], edgePoints[5], black);
	addLine(edgePoints[3], edgePoints[6], black);
	addLine(edgePoints[4], edgePoints[7], black);
	addLine(edgePoints[5], edgePoints[7], black);
	addLine(edgePoints[6], edgePoints[7], black);
};

var rotateUnitCell = function(edgePoints, xAngle, yAngle, zAngle, translationVector){
	var rotatedEdgePoints = [];
	for(var p = 0; p < edgePoints.length; p++){
		newCoor = edgePoints[p];
		q = q.rotation(newCoor, [0,0,0], [1,0,0], xAngle);
		newCoor = [q.x, q.y, q.z];
		q = q.rotation(newCoor, [0,0,0], [0,1,0], yAngle);
		newCoor = [q.x, q.y, q.z];
		q = q.rotation(newCoor, [0,0,0], [0,0,1], zAngle);
		newCoor = [q.x, q.y, q.z];
		newCoor = coorAdd(newCoor, translationVector);
		rotatedEdgePoints.push(newCoor);
	};
	return rotatedEdgePoints;
};

var initializeAnimation = function(baseMOF, atomVis){

	var WIDTH; 			// browser window WIDTH
	var HEIGHT; 		// browser window HEIGHT

	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight;

	renderer.setSize(WIDTH,HEIGHT);
	renderer.setClearColor(0xFFFFFF); // 0xFFFFFF corresponds to white
	document.body.appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(zoomAmount*1.5, WIDTH / HEIGHT, 0.1, 20000);
	camera.position.set(60,0,90);
	scene.add(camera);

	var light = new THREE.PointLight(0xFFFFFF); // white light
	light.position.set(-100, 200, 100);
	scene.add(light);

	controls = new THREE.OrbitControls(camera, renderer.domElement);

	// Add axis lines for x, y, z
	addLine([30,0,0], [-30,0,0], black);
	addLine([0,30,0], [0,-30,0], black);
	addLine([0,0,30], [0,0,-30], black);

	// Visualize all the atoms in the original structure
	var baseCoor;
	for(var i = 0 ; i < baseMOF.length; i++){
		visIndex = getVisIndex(baseMOF[i][3], baseAtomVis);
		baseCoor = [baseMOF[i][0], baseMOF[i][1], baseMOF[i][2]];
	  addAtom(baseCoor, baseAtomVis.radius[visIndex], baseAtomVis.color[visIndex]);
	};
	drawUnitCell(baseMOFedgeP);
	// Record number of total objects before IP
	objectNumber = scene.children.length-1;
};

var resetScene = function(objectNumber){
	idx = 0;
	for( var i = scene.children.length - 1; i > objectNumber; i--) {
		obj = scene.children[i];
		scene.remove(obj);
	};
};
// -------------------------------------------------------------------------------------------------
// Energy Map Related Functions --------------------------------------------------------------------
var findEmapIndex = function(coor, decimal, eMapMax, eMapMin){
	var sideLength = []; var rndCoor = [];
	for(var i = 0; i < coor.length; i++){
		sideLength.push(eMapMax[i] - eMapMin[i] + 1);
		rndCoor.push(Math.round(coor[i]*decimal)/decimal);
	};
	var eMapIndex = rndCoor[0]*sideLength[1]*sideLength[2] + rndCoor[1]*sideLength[2] + rndCoor[2];
	return eMapIndex;
};

var findAtomType = function(atomSymbol, eMapAtomNames, eMapAtomIndex){
	var atomIndex;
	for(var atom_idx = 0; atom_idx < eMapAtomNames.length; atom_idx++){
		if(atomSymbol === eMapAtomNames[atom_idx]){
			atomIndex = eMapAtomIndex[atom_idx];
		};
	};
	return atomIndex;
};

// Uses GLOBAL variabes of eMapAtomNames and eMapAtomIndex
var selectInitialCoordinates = function(referenceAtom, eMap, eLimit, fracUCV){
  var refAtomIndex = findAtomType(referenceAtom, eMapAtomNames, eMapAtomIndex);
  if(refAtomIndex === undefined){
    refAtomIndex = 3; console.log(referenceAtom, ' atom not found!');
  };
	var initialCoor = []; var eMapCoor, fracCoor, pbcCoor, pbcX, pbcY, pbcZ;
  for(var i = 0; i < eMap.length; i++){
		eMapCoor = [eMap[i][0], eMap[i][1], eMap[i][2]];
		fracCoor = car2frac(eMapCoor, baseMOF_UCsize, baseMOF_UCangle, fracUCV);
		pbcCoor = fracPBC(fracCoor);
		pbcCoor = frac2car(pbcCoor, baseMOF_UCsize, baseMOF_UCangle, fracUCV);
		pbcX = Math.round(eMapCoor[0]*10)/10;
		pbcY = Math.round(eMapCoor[1]*10)/10;
		pbcZ = Math.round(eMapCoor[2]*10)/10;
		if(pbcX === eMapCoor[0] && pbcY === eMapCoor[1] && pbcZ === eMapCoor[2]){
			if(eMap[i][refAtomIndex] < eLimit){
				initialCoor.push([eMap[i][0], eMap[i][1], eMap[i][2]]);
			};
		};
	};
	return initialCoor;
};

// PBC and Interpolation Functions -----------------------------------------------------------------
// 3D Linear Interpolation
// MODIFIES INPUT COORDINATE IF A ROUNDED COORDINATE VALUE IS GIVEN!!!!!!!!!!!!!
var trInterpolate = function(coor, atomIndex, eMap, eMapMax, eMapMin, gridSize){
	var coor1 = []; var coor0 = []; var dif = [];

	for(var i = 0; i < coor.length; i++){
		if(Math.round(coor[i]*10)/10 === coor[i]){
			coor[i] += 1E-10;
		};
		coor0[i] = Math.floor(coor[i]);
		coor1[i] = Math.ceil(coor[i]);
		dif[i] = ( coor[i] - coor0[i] ) / ( coor1[i] - coor0[i] );
	};

	var i000 = findEmapIndex(coor0, gridSize, eMapMax, eMapMin);
	var i100 = findEmapIndex([coor1[0],coor0[1],coor0[2]], gridSize, eMapMax, eMapMin);
	var i001 = findEmapIndex([coor0[0],coor0[1],coor1[2]], gridSize, eMapMax, eMapMin);
	var i101 = findEmapIndex([coor1[0],coor0[1],coor1[2]], gridSize, eMapMax, eMapMin);
	var i010 = findEmapIndex([coor0[0],coor1[1],coor0[2]], gridSize, eMapMax, eMapMin);
	var i110 = findEmapIndex([coor1[0],coor1[1],coor0[2]], gridSize, eMapMax, eMapMin);
	var i011 = findEmapIndex([coor0[0],coor1[1],coor1[2]], gridSize, eMapMax, eMapMin);
	var i111 = findEmapIndex(coor1, gridSize, eMapMax, eMapMin);

	var c00 = eMap[i000][atomIndex]*(1-dif[0]) + eMap[i100][atomIndex]*dif[0];
	var c01 = eMap[i001][atomIndex]*(1-dif[0]) + eMap[i101][atomIndex]*dif[0];
	var c10 = eMap[i010][atomIndex]*(1-dif[0]) + eMap[i110][atomIndex]*dif[0];
	var c11 = eMap[i011][atomIndex]*(1-dif[0]) + eMap[i111][atomIndex]*dif[0];

	var c0 = c00*(1-dif[1]) + c10*dif[1];
	var c1 = c01*(1-dif[1]) + c11*dif[1];

	var c = c0*(1-dif[2]) + c1*dif[2];

	return c;
};

var fracVolume = function(UCangle){
	var alp = degToRad(UCangle[0]);
	var bet = degToRad(UCangle[1]);
	var gam = degToRad(UCangle[2]);

	var v = 1 - Math.pow(Math.cos(alp),2) - Math.pow(Math.cos(bet),2);
	v += - Math.pow(Math.cos(gam),2) + 2*Math.cos(alp)*Math.cos(bet)*Math.cos(gam);
	v = Math.sqrt(v);

	return v;
};

var car2frac = function(coor, UCsize, UCangle, fracVolume){
  var alp = degToRad(UCangle[0]);
	var bet = degToRad(UCangle[1]);
	var gam = degToRad(UCangle[2]);

  var a = UCsize[0]; var b = UCsize[1]; var c = UCsize[2];
  var x = coor[0]; var y = coor[1]; var z = coor[2];
	var v = fracVolume;

  var xfrac = 1/a*x;
  xfrac += - Math.cos(gam)/(a*Math.sin(gam))*y;
  xfrac += (Math.cos(alp)*Math.cos(gam)-Math.cos(bet))/(a*v*Math.sin(gam))*z;

  var yfrac = 0;
  yfrac += 1/(b*Math.sin(gam))*y;
  yfrac += (Math.cos(bet)*Math.cos(gam)-Math.cos(alp))/(b*v*Math.sin(gam))*z;

  var zfrac = 0;
  zfrac += 0;
  zfrac += Math.sin(gam)/(c*v)*z;

  return [xfrac, yfrac, zfrac];
};

var fracPBC = function(fracCoor){
  var pbcCoor = [];
  for(var coorIndex = 0; coorIndex < fracCoor.length; coorIndex++){
    pbcCoor.push(fracCoor[coorIndex] - Math.floor(fracCoor[coorIndex]));
	};
  return pbcCoor;
};

var frac2car = function(coor, UCsize, UCangle, fracVolume){
	var alp = degToRad(UCangle[0]);
	var bet = degToRad(UCangle[1]);
	var gam = degToRad(UCangle[2]);

	var a = UCsize[0]; var b = UCsize[1]; var c = UCsize[2];
	var xfrac = coor[0]; var yfrac = coor[1]; var zfrac = coor[2];
	var v = fracVolume;

	var x = a*xfrac;
	x += b*Math.cos(gam)*yfrac;
	x += c*Math.cos(bet)*zfrac;

	var y = 0;
	y += b*Math.sin(gam)*yfrac;
	y += c*(Math.cos(alp)-Math.cos(bet)*Math.cos(gam))/Math.sin(gam)*zfrac;

	var z = 0;
	z += c*v/Math.sin(gam)*zfrac;

	return [x, y, z];
};
// General Geometry Functions ----------------------------------------------------------------------
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

var degToRad = function(deg){
	return deg/180*Math.PI;
};

var radToDeg = function(rad){
	return rad*180/Math.PI;
};
// Quaternion Functions ----------------------------------------------------------------------------
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
    var length = Math.sqrt( Math.pow(i,2) + Math.pow(j,2) + Math.pow(k,2) ); // What if length is 0??
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

// Output Functions --------------------------------------------------------------------------------
var recordSummary = function(IPsuccessful){
	console.log(firstPoint[0], firstPoint[1], firstPoint[2], xAngle, yAngle, zAngle, trialCount, structureCount, IPsuccessful);
};

var recordStructure = function(S1, S2, trialCount, structureCount, xAngle, yAngle, zAngle, structureTotalEnergy){
	var significantFigure = 3;
	var decimal = Math.pow(10,significantFigure);
	var xdeg = Math.round(xAngle / Math.PI * 180);
	var ydeg = Math.round(yAngle / Math.PI * 180);
	var zdeg = Math.round(zAngle / Math.PI * 180);
	console.log(S1.length + S2.length);
	console.log("IP Trial: " + trialCount + " Structure: " + structureCount);
	console.log("Rotation x: " + xdeg + " y: " + ydeg + " z: " + zdeg);
	console.log("Energy: " + structureTotalEnergy);
	var x, y, z;
	for(var i = 0; i < S1.length; i++){
		x = Math.round(S1[i][0]*decimal)/decimal;
		y = Math.round(S1[i][1]*decimal)/decimal;
		z = Math.round(S1[i][2]*decimal)/decimal;
		console.log(S1[i][3] + " " + x + " " + y + " " + z);
	};
	var x2, y2, z2;
	for(var i = 0; i < S2.length; i++){
		x2 = Math.round(S2[i][0]*decimal)/decimal;
		y2 = Math.round(S2[i][1]*decimal)/decimal;
		z2 = Math.round(S2[i][2]*decimal)/decimal;
		console.log(S2[i][3] + " " + x2 + " " + y2 + " " + z2);
	};
	console.log("--------------------------------------------------------------");
};
