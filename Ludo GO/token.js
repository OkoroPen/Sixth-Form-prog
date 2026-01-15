class Token {
  constructor(id, player) {
    this.id = id;
    this.player = player;
    this.color = player.color;
    this.state = 'base';      
    this.pathIndex = -1;      
    this.homeIndex = -1;
    this.distanceTraveled = 0;
    this.x = 0; this.y = 0;
    this.targetX = 0; this.targetY = 0;
    this.speed = 8;          
    this.flashUntil = 0;
    this.updateCoordinates(true);
  }

  resetToBase() {
    this.state = 'base';
    this.pathIndex = -1;
    this.homeIndex = -1;
    this.distanceTraveled = 0;
    this.updateCoordinates(true);
  }

  activate() {
    this.state = 'active';
    this.pathIndex = this.player.startIndex;
    this.distanceTraveled = 0;
    this.updateCoordinates(true);
  }

  canEnterHome() {
    return this.distanceTraveled >= window.boardPath.length - 1;
  }

  stepForward(steps) {
    if (this.state !== 'active') return false;

    const boardLen = window.boardPath.length;
    const entryIndex = this.player.homeEntry;
   
    this.distanceTraveled += steps;

    if (this.canEnterHome()) {
      let distToEntry = (entryIndex - this.pathIndex + boardLen) % boardLen;
     
      if (distToEntry === 0 || steps > distToEntry) {
        const stepsIntoHome = (distToEntry === 0) ? steps - 1 : steps - distToEntry - 1;
        if (stepsIntoHome >= 0 && stepsIntoHome < window.homePaths[this.player.color].length) {
          this.state = 'homePath';
          this.homeIndex = stepsIntoHome;
          this.updateCoordinates();
          return true;
        } else {
          this.distanceTraveled -= steps;
          return false;
        }
      }
    }

    this.pathIndex = (this.pathIndex + steps) % boardLen;
    this.updateCoordinates();
    return true;
  }

  moveHomePath(steps) {
    if (this.state !== 'homePath') return false;

    this.homeIndex += steps;
    if (this.homeIndex >= window.homePaths[this.player.color].length) {
      this.homeIndex = window.homePaths[this.player.color].length - 1;
      this.state = 'finished';
    }

    this.updateCoordinates();
    return true;
  }

  updateCoordinates(force = false) {
    let tx, ty;
    if (this.state === 'base') {
      const base = this.player.baseCoords[this.id];
      tx = base.x; ty = base.y;
    } else if (this.state === 'active') {
      const tile = window.boardPath[this.pathIndex];
      tx = tile.x + window.cellSize / 2;
      ty = tile.y + window.cellSize / 2;
    } else if (this.state === 'homePath') {
      const h = window.homePaths[this.player.color][this.homeIndex];
      tx = h.x * window.cellSize + window.cellSize / 2;
      ty = h.y * window.cellSize + window.cellSize / 2;
    } else if (this.state === 'finished') {
      tx = 7.5 * window.cellSize;
      ty = 7.5 * window.cellSize;
    }

    if (force) { this.x = tx; this.y = ty; }

    this.targetX = tx;
    this.targetY = ty;
  }

  animate() {
    this.x += (this.targetX - this.x) * 0.2;
    this.y += (this.targetY - this.y) * 0.2;
  }

  draw() {
    this.animate();
    push();
    stroke(0);
    if (this.flashUntil && frameCount < this.flashUntil) fill(255, 200, 0);
    else fill(this.color);
    ellipse(this.x, this.y, window.cellSize * 0.78);
    noStroke();
    fill(0);
    textSize(12);
    textAlign(CENTER, CENTER);
    text(this.id + 1, this.x, this.y + 1);
    pop();
  }

  flash() { this.flashUntil = frameCount + 18; }
}
