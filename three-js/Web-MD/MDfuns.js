// Converts uniform distribution to normal distribution
// Gives numbers with given "mean" and "std" values between "low" and high"
var normDist = function(mean, std, low, high) {
	
	var x1, x2, w, y1, y2;
  
	do {
    	x1 = Math.random() * 2 - 1;
    	x2 = Math.random() * 2 - 1;
    	w = x1 * x1 + x2 * x2;
  	} while (w >= 1);
  		
  	w = Math.sqrt(-2 * Math.log(w) / w); // Box-Muller transform

  	y1 = mean + (x1 * w) * std; 
  	y2 = mean + (x2 * w) * std; 
  
  	//return y1; // throw away extra sample y * c

  	if (low <= y1 && y1 <= high) {
  		return y1;
  	}
  	else if (low <= y2 && y2 <= high) {
  		return y2;
  	}
  	else {
  		return Math.random()*(high-low)+low;
  	}
}

// Periodic boundary condition for one dimensiom
var pbc = function(x,ucX) {

  if (x > ucX/2)  {x -= ucX};
  if (x < -ucX/2) {x += ucX};

  return x;
}

// Calculate forces using Lennard-Jones
// unitCellSizeX, unitCellSizeY, unitCellSizeZ, sig and eps should be defined globally
var forces = function(dx,dy,dz,axis) {

  // Minimum image convention
  dx = pbc(dx,unitCellSizeX);
  dy = pbc(dy,unitCellSizeY);
  dz = pbc(dz,unitCellSizeZ);

  var r = Math.sqrt(dx*dx+dy*dy+dz*dz);

  var f = 24*eps*(2*(Math.pow(sig,12)/Math.pow(r,13)) - (Math.pow(sig,6)/Math.pow(r,7)));
  //f in kg*A/s^2

  var fx = f*dx/r;
  var fy = f*dy/r;
  var fz = f*dz/r;

  if (axis == "x") { return fx; };
  if (axis == "y") { return fy; };
  if (axis == "z") { return fz; };
  }


