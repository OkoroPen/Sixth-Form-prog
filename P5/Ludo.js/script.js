
let board;
const boardSize = 600;
const gridCount = 15;

const colors = [
    [255, 0, 0],    // Red
    [0, 255, 0],    // Green
    [255, 255, 0],  // Yellow
    [0, 0, 255],    // Blue
];

function setup() {
    createCanvas(boardSize, boardSize + 50);
    board = new Board(boardSize, gridCount, colors);
    board.drawBackground();
    board.drawBases();
    board.drawMainPath();
    board.drawHomePaths();
    board.drawCenter();
    board.drawGrid();
}
class Board {
    constructor(size, gridCount, colors, mainPath, homePaths) {
        this.size = size;
        this.gridCount = gridCount;
        this.colors = colors;
        this.mainPath = mainPath;
        this.homePaths = homePaths;
        this.cellSize = size / gridCount;
    }

    drawGrid() {
        stroke(0);
        noFill();
        for (let i = 0; i <= this.gridCount; i++) {
            line(i * this.cellSize, 0, i * this.cellSize, this.size);
            line(0, i * this.cellSize, this.size, i * this.cellSize);
        }
    }

    drawBackground() {
        for (let i = 0; i < this.gridCount; i++) {
            for (let j = 0; j < this.gridCount; j++) {
                fill(255);
                rect(i * this.cellSize, j * this.cellSize, this.cellSize, this.cellSize);
            }
        }
    }

    drawBases() {
        this._drawBase(0, 0, this.colors[0]);
        this._drawBase(9, 0, this.colors[1]);
        this._drawBase(9, 9, this.colors[2]);
        this._drawBase(0, 9, this.colors[3]);
    }

    drawMainPath() {
        for (let i = 0; i < this.mainPath.length; i++) {
            let pos = this.mainPath[i];
            if (this._isStartingSquare(i)) {
                fill(this.colors[this._getStartingSquarePlayer(i)]);
            } else {
                fill(255);
            }
            stroke(0);
            rect(pos.x * this.cellSize, pos.y * this.cellSize, this.cellSize, this.cellSize);

            if (this._isStarCell(i)) {
                fill(255, 204, 0);
                noStroke();
                push();
                translate(pos.x * this.cellSize + this.cellSize / 2, pos.y * this.cellSize + this.cellSize / 2);
                this._drawStar(0, 0, this.cellSize * 0.15, this.cellSize * 0.35, 5);
                pop();
                stroke(0);
            }
        }
    }

    drawHomePaths() {
        for (let p = 0; p < 4; p++) {
            for (let i = 0; i < this.homePaths[p].length - 1; i++) {
                let pos = this.homePaths[p][i];
                fill(this.colors[p]);
                stroke(0);
                rect(pos.x * this.cellSize, pos.y * this.cellSize, this.cellSize, this.cellSize);
            }
        }
    }

    drawCenter() {
        fill(200);
        rect(6 * this.cellSize, 6 * this.cellSize, this.cellSize * 3, this.cellSize * 3);
    }

    _drawBase(x, y, col) {
        noStroke();
        fill(col);
        rect(x * this.cellSize, y * this.cellSize, this.cellSize * 6, this.cellSize * 6);

        fill(255);
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                rect((x + 1 + i * 2) * this.cellSize, (y + 1 + j * 2) * this.cellSize, this.cellSize, this.cellSize);
            }
        }
    }

    _drawStar(x, y, radius1, radius2, npoints) {
        let angle = TWO_PI / npoints;
        let halfAngle = angle / 2.0;
        beginShape();
        for (let a = 0; a < TWO_PI; a += angle) {
            let sx = x + cos(a) * radius2;
            let sy = y + sin(a) * radius2;
            vertex(sx, sy);
            sx = x + cos(a + halfAngle) * radius1;
            sy = y + sin(a + halfAngle) * radius1;
            vertex(sx, sy);
        }
        endShape(CLOSE);
    }

    _isStartingSquare(index) {
        return index === 0 || index === 13 || index === 26 || index === 39;
    }

    _getStartingSquarePlayer(index) {
        if (index === 0) return 0;
        if (index === 13) return 1;
        if (index === 26) return 2;
        if (index === 39) return 3;
        return -1;
    }

    _isStarCell(index) {
        return [1, 9, 14, 22, 27, 35, 40, 48].includes(index);
    }
}

class PlayerPiece {
    constructor(playerIndex, pieceIndex) {
        this.playerIndex = playerIndex;
        this.pieceIndex = pieceIndex;
        this.inBase = true;
        this.onMainPathIndex = -1;
        this.onHomePathIndex = -1;
    }

    draw(cellSize, colors, homePaths, mainPath) {
        let pos;
        if (this.inBase) {
            const baseX = (this.playerIndex === 0 || this.playerIndex === 3) ? 1 : 10;
            const baseY = (this.playerIndex === 0 || this.playerIndex === 1) ? 1 : 10;
            const dx = (this.pieceIndex % 2) * 2;
            const dy = Math.floor(this.pieceIndex / 2) * 2;
            pos = createVector(baseX + dx, baseY + dy);
        } else if (this.onHomePathIndex >= 0) {
            pos = createVector(homePaths[this.playerIndex][this.onHomePathIndex].x, homePaths[this.playerIndex][this.onHomePathIndex].y);
        } else if (this.onMainPathIndex >= 0) {
            pos = createVector(mainPath[this.onMainPathIndex].x, mainPath[this.onMainPathIndex].y);
        }

        fill(colors[this.playerIndex]);
        ellipse(pos.x * cellSize + cellSize / 2, pos.y * cellSize + cellSize / 2, cellSize * 0.6);
    }
}

// Example instantiation usage


function draw() {
    board.drawBackground();
    board.drawBases();
    board.drawMainPath();
    board.drawHomePaths();
    board.drawCenter();
    board.drawGrid();
}
