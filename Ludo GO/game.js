// Game Class
class Game {
  constructor({ onUpdate = null, onGameEnd = null, boardPathLength = 0 } = {}) {
    this.players = [];
    this.onUpdate = onUpdate;
    this.onGameEnd = onGameEnd;
    this.boardPathLength = boardPathLength;
    this.dice = [0, 0];
    this.diceUsed = [true, true];
    this.validMoves = [];
    this.currentPlayerIndex = 0;
    this.safeZones = [];
    this.winners = [];
    this.aiDelay = 2000;
    this.awaitingHumanMove = false;
    this.victoryMode = 'both';
    this.gameOver = false;
  }

  addPlayer(p) { this.players.push(p); }       // adds a new player to the game
  setSafeZones(arr) { this.safeZones = arr || []; }       // Defines Safezones
  getCurrentPlayer() { return this.players[this.currentPlayerIndex]; }        //Returns the current player's turn

  //Initializes the game
  startGame() {
    if (this.players.length !== 4) return; // MAkes sure the game has 4 players 
    this.gameOver = false; // Resets the game over flag
    this.setSafeZones(this.players.map(p => p.startIndex));

    // Randomize who starts
    const rolls = [];
    for (let i = 0; i < this.players.length; i++) {
      const total = Math.floor(Math.random() * 6) + 1; // Rolls one dice for each player
      rolls.push({ index: i, total });
    }
    rolls.sort((a, b) => b.total - a.total); // Highest number takes precedence
    this.currentPlayerIndex = rolls[0].index;

    const starter = this.getCurrentPlayer();
    const logEl = document.getElementById('log');
    if (logEl) logEl.innerText = `${starter.name} starts first!`;

    // Prepare for first turn
    this.dice = [0, 0]; //Resets Dice state
    this.diceUsed = [true, true];
    this.validMoves = [];

    if (starter.isHuman) {
      this.awaitingHumanMove = true;
      if (this.onUpdate) this.onUpdate(this.dice);
      if (logEl) logEl.innerText = `${starter.name}'s turn! Click "Roll Dice" to roll.`;
    } else {
      this.awaitingHumanMove = false;
      this.handleAITurnIfNeeded();
    }
  }
// Rolls Dice ramdomly for the player
  rollDice() {
    if (this.gameOver) return;
    const cur = this.getCurrentPlayer();
    if (!cur) return;

    this.dice = [1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)];
    playSound("dice-sound");  // Plays sounds when dice rolls
    this.diceUsed = [false, false];

    this.updateValidMoves();
    if (this.onUpdate) this.onUpdate(this.dice);

    const logEl = document.getElementById('log');
    if (cur.isHuman) {
      this.awaitingHumanMove = true;
      if (logEl) logEl.innerText = `${cur.name}, choose a token to move! Dice: ${this.dice[0]}, ${this.dice[1]}`;
    } else {
      this.awaitingHumanMove = false;
      this.handleAITurnIfNeeded();
    }
  }

  updateValidMoves() {
    const p = this.getCurrentPlayer();
    if (!p) return;
    this.validMoves = p.generateMoves(this.dice, this.diceUsed) || [];
  }

  moveToken(player, token, steps, source) {
    if (this.gameOver) return false;
    if (player !== this.getCurrentPlayer()) return false;

    // Must match a valid move
    const found = this.validMoves.find(m =>
      m.token === token && m.steps === steps && m.source === source
    );
    if (!found) return false;

    // Mark activation flag if move is activation
    if (found.isActivation) token._activate = true;

    if (this.diceUsed[source]) return false;

    // State transitions
    if (token.state === 'base') {
      // Accept activation via flag or classic rule (steps===6 → we encoded as isActivation anyway)
      if (found.isActivation || steps === 0 || token._activate === true) {
        token.activate();
      } else {
        return false;
      }
    } else if (token.state === 'active') {
      token.stepForward(steps);
    } else if (token.state === 'homePath') {
      token.moveHomePath(steps);
      if (token.state === 'finished') {
        this.checkVictoryByHome(player);
      }
    }

    // Collision checks only for active-path positions
    if (token.state === 'active') this.checkCollisions(player, token);

    // Mark dice source as used and recompute valid moves
    this.diceUsed[source] = true;
    this.updateValidMoves();

    // If the other die is still unused AND there are valid moves, keep the turn
    if (this.diceUsed.some(u => !u) && this.validMoves.length > 0) {
      const logEl = document.getElementById('log');
      if (player.isHuman) {
        if (logEl) logEl.innerText = `${player.name}, use your other dice!`;
      } else {
        const aiPlayer = player;
        setTimeout(() => this.handleAISecondMove(aiPlayer), this.aiDelay);
      }
      return true;
    }

    // End of turn
    this.nextPlayer();

    const nextPlayer = this.getCurrentPlayer();
    if (!nextPlayer || this.gameOver) return true;

    if (nextPlayer.isHuman) {
      this.awaitingHumanMove = true;
      const logEl = document.getElementById('log');
      if (logEl) logEl.innerText = `${nextPlayer.name}'s turn! Click "Roll Dice" to roll.`;
    } else {
      this.awaitingHumanMove = false;
      this.handleAITurnIfNeeded();
    }

    return true;
  }

  handleAISecondMove(aiPlayer) { // Makes AI use  their second dice move
    if (this.gameOver) return;
    if (this.getCurrentPlayer() !== aiPlayer) return;

    this.updateValidMoves();
    const moves = this.validMoves;
    if (!moves || moves.length === 0) {
      this.nextPlayer();
      this.handleAITurnIfNeeded();
      return;
    }

    let chosen =
      moves.find(m => this.wouldCapture(aiPlayer, m)) ||
      moves.find(m => m.isActivation || m.token.state === 'base') ||
      moves.reduce((a, b) => (a.steps >= b.steps ? a : b), moves[0]);

    if (chosen.isActivation) chosen.token._activate = true;

    this.moveToken(aiPlayer, chosen.token, chosen.steps, chosen.source);
  }

  checkCollisions(player, token) {
    if (this.safeZones.includes(token.pathIndex)) return; // Handles capturing opponents token

    for (const other of this.players) {
      if (other === player) continue;
      for (const opp of other.tokens) {
        if (opp.state === 'active' && opp.pathIndex === token.pathIndex) {
          opp.resetToBase();  //Captured token resets to base
          opp.flash();
          player.captureCount = (player.captureCount || 0) + 1;
          playSound("capture-sound");

          const logEl = document.getElementById('log');
          if (logEl)
            logEl.innerText = `${player.name} captured ${other.name}'s token!`;

          this.checkVictoryByCapture(player);
          return;
        }
      }
    }
  }

  checkVictoryByCapture(player) {
    if (this.victoryMode === 'home') return false;
    if ((player.captureCount || 0) >= 4) {
      this.winners.push(player);
      this.gameOver = true;
      if (this.onGameEnd) this.onGameEnd({ winner: player, mode: 'capture' });
      return true;
    }
    return false;
  }

  checkVictoryByHome(player) {
    if (this.victoryMode === 'capture') return false;
    if (player.tokens.every(t => t.state === 'finished')) {
      this.winners.push(player);
      this.gameOver = true;
      if (this.onGameEnd) this.onGameEnd({ winner: player, mode: 'home' });
      return true;
    }
    return false;
  }

  nextPlayer() { // Advances to the next eligible player
    if (this.gameOver) return;

    const totalPlayers = this.players.length;

    // Clear awaiting for previous human
    const prevIndex = (this.currentPlayerIndex - 1 + totalPlayers) % totalPlayers;
    const prev = this.players[prevIndex];
    if (prev && prev.isHuman) this.awaitingHumanMove = false;

    let attempts = 0;
    do {
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % totalPlayers;
      attempts++;
      if (attempts > totalPlayers) {
        // All players have won - game over
        this.gameOver = true;
        return;
      }
    } while (this.players[this.currentPlayerIndex].isWinner());

    // Reset dice for next player
    this.dice = [0, 0];
    this.diceUsed = [true, true];
    this.validMoves = [];
    if (this.onUpdate) this.onUpdate(this.dice);

    const cur = this.getCurrentPlayer();
    const logEl = document.getElementById('log');
    if (cur && cur.isHuman) {
      this.awaitingHumanMove = true;
      if (logEl) logEl.innerText = `${cur.name}'s turn! Click "Roll Dice" to roll.`;
    }
  }

  handleAITurnIfNeeded() {
    if (this.gameOver) return;

    const cur = this.getCurrentPlayer();
    if (!cur || cur.isHuman || cur.isWinner()) return;

    // Roll dice if not rolled yet
    if (this.dice[0] === 0 && this.dice[1] === 0) {
      this.rollDice();
    }

    setTimeout(() => {
      if (this.gameOver) return;

      this.updateValidMoves();
      const moves = this.validMoves;
      if (!moves || moves.length === 0) {
        this.nextPlayer();
        this.handleAITurnIfNeeded();
        return;
      }

      let chosen =
        moves.find(m => this.wouldCapture(cur, m)) ||
        moves.find(m => m.isActivation || m.token.state === 'base') ||
        moves.reduce((a, b) => (a.steps >= b.steps ? a : b), moves[0]);

      if (chosen.isActivation) chosen.token._activate = true;

      this.moveToken(cur, chosen.token, chosen.steps, chosen.source);
    }, this.aiDelay);
  }
  // Checks if the move would land on an opponent
  wouldCapture(player, move) {
    if (!this.boardPathLength || this.boardPathLength <= 0) return false;
    const pos = (move.token.pathIndex + move.steps) % this.boardPathLength;
    for (const other of this.players) {
      if (other === player) continue;
      for (const ot of other.tokens) {
        if (ot.state === 'active' && ot.pathIndex === pos && !this.safeZones.includes(pos))
          return true;
      }
    }
    return false;
  }
}

//plays sound based on actions  (dice roll, token moves)
function playSound(id) {
  const audio = document.getElementById(id);
  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }
}

/*
// --- Bonus-turn helpers ---
isDoubleSix() {
  return this.dice && this.dice[0] === 6 && this.dice[1] === 6;
}

shouldGrantBonus(player) {
  // Bonus ONLY for AI players AND only when dice are exactly [6,6]
  return !player.isHuman && this.isDoubleSix();
}


 * Starts a bonus turn for the current AI player.
 * Resets dice state for a fresh roll and triggers the AI flow.
 
startBonusTurn(player) {
  if (this.gameOver) return;

  const logEl = document.getElementById('log');
  if (logEl) logEl.innerText = `${player.name} rolled 🎲 6 & 6 — bonus turn!`;

  // Reset dice for the same player to roll again
  this.dice = [0, 0];
  this.diceUsed = [true, true];
  this.validMoves = [];
  if (this.onUpdate) this.onUpdate(this.dice);

  // AI continues; human never gets bonus (by rule), so no UI prompt here
  this.handleAITurnIfNeeded();
}


// After applying a move and recomputing validMoves:
this.diceUsed[source] = true;
this.updateValidMoves();

// If the other die is still unused AND there are valid moves, keep the turn
if (this.diceUsed.some(u => !u) && this.validMoves.length > 0) {
  const logEl = document.getElementById('log');
  if (player.isHuman) {
    if (logEl) logEl.innerText = `${player.name}, use your other dice!`;
  } else {
    const aiPlayer = player;
    setTimeout(() => this.handleAISecondMove(aiPlayer), this.aiDelay);
  }
  return true;
}

// ---- BONUS TURN CHECK (both dice used OR no moves left) ----
const bothDiceUsed = this.diceUsed.every(u => u);
const noMovesRemain = this.validMoves.length === 0;

if ((bothDiceUsed || noMovesRemain) && this.shouldGrantBonus(player)) {
  // Human extra turns disabled by rule; this only runs for AI.
  this.startBonusTurn(player);
  return true; // Keep turn with same player; bonus handled above
}


this.nextPlayer();

const nextPlayer = this.getCurrentPlayer();
if (!nextPlayer || this.gameOver) return true;

if (nextPlayer.isHuman) {
  this.awaitingHumanMove = true;
  const logEl = document.getElementById('log');
  if (logEl) logEl.innerText = `${nextPlayer.name}'s turn! Click "Roll Dice" to roll.`;
} else {
  this.awaitingHumanMove = false;
  this.handleAITurnIfNeeded();
}*/