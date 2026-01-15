/**
 * The Player class defines the functions to draw and move the player
 * the player coordinates are stored (this.x,this.y) as is the current image (this.img)
 * this could be extended to include player health and other attributes
 */
let playerImages

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.img = playerImages[1] //use the 'right' character image from the array of playerImages
    }

    draw() {
        // player is represented by a static character
        image(this.img, cellSize * this.x, cellSize * this.y, cellSize, cellSize)
    }

    up() {
        // check if the player can move up the screen by 1
        // position above the player has same x value ( 0 difference) and decrease in y (-1 difference)
        this.checkTarget(0, -1);
        // change which character image is being used
        this.img = playerImages[0]
    }

    right() {
        // TASK 5: make the player move right
        // TODO: write similar code to the up() function, but make this increase the x position by one, whilst keeping y the same. Use image 1 from the playerImages array
        this.checkTarget(1, 0);
        this.img = playerImages[1]
    }

    // TASK 6: add code to allow player to move left and down. 
    // TODO: Create a function called down() that checks the location below the player and uses the down image (image 2)
    down() {
        this.checkTarget(0, 1)
        this.img = playerImages[2]
    }
    // TODO: Create a function called left() that checks the location to the left of the player and uses the left image (image 3)
    left() {
        this.checkTarget(-1, 0);
        this.img = playerImages[3]
    }

    checkTarget(dx, dy) {
        // Examine the target location's value and take appropriate action
        // Target is player position plus the x and y changes passed as dx dy
        // 3 is firepit, 2 is exit, 1 is wall 0 is path

        switch (level[this.y + dy][this.x + dx]) {
            case 0:      // array contains 0 at that position - it's path
                // so change player position
                this.x += dx;
                this.y += dy;
                break
            case 1: // it's wall
                // don't change anything
                break
            // TASK 7: extend this switch statement to check if the target cell is an exit or a firepit
            // TODO: add case statement to deal with exit (2) - gameState should be changed to GSWIN
            // TODO: add case statement to deal with firepit (3) - gameState should be changed to GSLOSE
            case 2:
                gameState = GSWIN;
                break
            case 3:
                gameState = GSLOSE;
                break
        }
    }

}