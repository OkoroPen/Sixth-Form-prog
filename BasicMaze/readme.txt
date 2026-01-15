### Maze Game
Use this project along with the sheet you got in class

This simple maze game uses a 2d array to represent a maze
The array holds integer values representing
0 path
1 wall
2 exit
3 firepit

Currently the array is only 7x7, with a wall surrounding it, so actual playable area is 5x5
Currently the player does not have all of its movement code

Note that this project has the game code in script.js, and player.js has code for the Player class - this is an example of using object oriented programming (OOP).

#### BASIC

Get the player movement working so it moves up, down, left and right
The player must:
- NOT go through walls
- DIE in firepits
- WIN when reaches the exit

#### INTERMEDIATE
Introduce multiple levels with bigger mazes and treasure to pick up.
Don't just die on hitting a firepit but lose health, if health <=0 then die. This way you can design levels that require you to move through firepits to get to exit and teh skill becomes minimising the damage done.
Keep track of the player's score

#### ADVANCED
Have moving obstacles / enemies, plus any other features that you fancy


Character art downloaded from https://opengameart.org/content/top-down-runner
