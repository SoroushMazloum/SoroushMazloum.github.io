class Step {
  constructor(dx, dy, dz) {
    this.dx = dx;
    this.dy = dy;
    this.dz = dz;
    this.tried = false;
  }
}

function allOptions() {
  return [
    new Step(1, 0, 0),
    new Step(-1, 0, 0),
    new Step(0, 1, 0),
    new Step(0, -1, 0),
    new Step(0, 0, 1),
    new Step(0, 0, -1),
  ];
}

class Spot {
  constructor(i, j, k) {
    this.i = i;
    this.j = j;
    this.k = k;
    this.x = i * spacing; // + 0.1*random(-spacing,spacing);
    this.y = j * spacing; // + 0.1*random(-spacing,spacing);;
    this.z = k * spacing; // + 0.1*random(-spacing,spacing);;
    this.options = allOptions();
    this.visited = false;
  }

  clear() {
    this.visited = false;
    this.options = allOptions();
  }

  nextSpot() {
    let validOptions = [];
    for (let option of this.options) {
      let newX = this.i + option.dx;
      let newY = this.j + option.dy;
      let newZ = this.k + option.dz;
      if (isValid(newX, newY, newZ) && !option.tried) {
        validOptions.push(option);
      }
    }

    if (validOptions.length > 0) {
      let step = random(validOptions);
      step.tried = true;
      return grid[this.i + step.dx][this.j + step.dy][this.k + step.dz];
    }
    return undefined;
  }
}
