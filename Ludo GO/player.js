class Player {
  constructor(index, name, color, isHuman = true) {
    this.index = index;
    this.name = name;
    this.color = color;
    this.isHuman = isHuman;
    this.tokens = [];
    this.captureCount = 0;
    this.startIndex = this.getStartIndex();
    this.homeEntry = this.getHomeEntry();
    this.baseCoords = this.generateBaseCoords();
    for (let i = 0; i < 4; i++) this.tokens.push(new Token(i, this));
  }

  getStartIndex() {
    const map = { red: 1, green: 14, yellow: 27, blue: 40 };
    return map[this.color];
  }

  getHomeEntry() {
    const map = { red: 50, green: 12, yellow: 25, blue: 38 };
    return map[this.color];
  }

  generateBaseCoords() {
    const cs = window.cellSize;
    let cx = 0, cy = 0;
    switch (this.color) {
      case "red": cx = 3 * cs; cy = 3 * cs; break;
      case "green": cx = 12 * cs; cy = 3 * cs; break;
      case "blue": cx = 3 * cs; cy = 12 * cs; break;
      case "yellow": cx = 12 * cs; cy = 12 * cs; break;
    }
    const offset = cs * 0.9;
    return [
      { x: cx - offset / 2, y: cy - offset / 2 },
      { x: cx + offset / 2, y: cy - offset / 2 },
      { x: cx - offset / 2, y: cy + offset / 2 },
      { x: cx + offset / 2, y: cy + offset / 2 }
    ];
  }

  generateMoves(dice, diceUsed) {
    const moves = [];
    for (const t of this.tokens) {
      for (let d = 0; d < dice.length; d++) {
        if (diceUsed[d]) continue;
        const steps = dice[d];
        if (t.state === 'base' && steps === 6) {
          moves.push({ token: t, steps: 0, source: d });
        } else if (t.state === 'active') {
          const boardLen = window.boardPath.length;
          const entryIndex = this.homeEntry;
         
          if (t.canEnterHome()) {
            let distToEntry = (entryIndex - t.pathIndex + boardLen) % boardLen;
           
            if (distToEntry === 0) {
              const stepsIntoHome = steps - 1;
              if (stepsIntoHome >= 0 && stepsIntoHome < window.homePaths[this.color].length) {
                moves.push({ token: t, steps, source: d });
              }
            } else if (steps <= distToEntry) {
              moves.push({ token: t, steps, source: d });
            } else {
              const stepsIntoHome = steps - distToEntry - 1;
              if (stepsIntoHome < window.homePaths[this.color].length) {
                moves.push({ token: t, steps, source: d });
              }
            }
          } else {
            moves.push({ token: t, steps, source: d });
          }
        } else if (t.state === 'homePath') {
          const homeLen = window.homePaths[this.color].length;
          if (t.homeIndex + steps <= homeLen) moves.push({ token: t, steps, source: d });
        }
      }
    }
    return moves;
  }

  selectToken(mx, my, validMoves) {
    for (const mv of validMoves) {
      const t = mv.token;
      const d = dist(mx, my, t.x, t.y);
      if (d < window.cellSize * 0.6) return { tokenId: t.id, steps: mv.steps, source: mv.source };
    }
    return null;
  }

  isWinner() {
    return this.tokens.every(t => t.state === 'finished');
  }
}