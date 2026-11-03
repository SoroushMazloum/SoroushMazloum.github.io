let grid;
let spacing = 20;
let cols, rows, depth;
let path = [];
let spot;

function make3DArray(cols, rows, depth) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
    for (let j = 0; j < arr[i].length; j++) {
      arr[i][j] = new Array(depth);
    }
  }
  return arr;
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  cols = floor(width / spacing);
  rows = floor(height / spacing);
  depth = cols;
  background(51);
  grid = make3DArray(cols, rows, depth);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      for (let k = 0; k < depth; k++) {
        grid[i][j][k] = new Spot(i, j, k);
      }
    }
  }
  const cx = floor(cols / 10);
  const rx = floor(rows / 10);
  const dx = floor(cols / 10);
  spot = grid[cx][rx][dx];
  path.push(spot);
  spot.visited = true;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function isValid(i, j, k) {
  if (i < 0 || i >= cols || j < 0 || j >= rows || k < 0 || k >= depth) {
    return false;
  }
  return !grid[i][j][k].visited;
}

let lerpX = 0;
let lerpY = 0;
let lerpZ = 0;

function draw() {
  background(0);

  let center = createVector(0, 0, 0);
  let minXYZ = createVector(Infinity, Infinity, Infinity);
  let maxXYZ = createVector(0, 0, 0);
  for (let v of path) {
    minXYZ.x = min(v.x, minXYZ.x);
    minXYZ.y = min(v.y, minXYZ.y);
    minXYZ.z = min(v.z, minXYZ.z);
    maxXYZ.x = max(v.x, maxXYZ.x);
    maxXYZ.y = max(v.y, maxXYZ.y);
    maxXYZ.z = max(v.z, maxXYZ.z);
  }

  center.x = (maxXYZ.x - minXYZ.x) * 0.5 + minXYZ.x;
  center.y = (maxXYZ.y - minXYZ.y) * 0.5 + minXYZ.y;
  center.z = (maxXYZ.z - minXYZ.z) * 0.5 + minXYZ.z;

  const amt = 0.05;
  lerpX = lerp(lerpX, center.x, amt);
  lerpY = lerp(lerpY, center.y, amt);
  lerpZ = lerp(lerpZ, center.z, amt);

  rotateY(frameCount * 0.002);
  translate(-lerpX, -lerpY, -lerpZ);

  spot = spot.nextSpot();
  if (!spot) {
    let stuck = path.pop();
    stuck.clear();
    spot = path[path.length - 1];
  } else {
    path.push(spot);
    spot.visited = true;
  }

  if (path.length === cols * rows * depth) {
    console.log("Solved!");
    noLoop();
  }

  strokeWeight(spacing * 0.1);
  noFill();

  colorMode(HSB);
  for (let i = 0; i < path.length - 1; i++) {
    let v1 = path[i];
    let v2 = path[i + 1];
    stroke((i + frameCount) % 360, 100, 100);
    line(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
  }

  stroke(255);
  strokeWeight(spacing * 0.5);
  point(spot.x, spot.y, spot.z);
}