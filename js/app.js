'use strict';

/*global ctx*/
/*global Resources*/
/*global Engine*/
/*global document*/

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Offset for images.
var imageOffsetX = 101;
var imageOffsetY = 73;

// Set of character skins
var skins = [
    {name : 'The boy', skin: 'images/char-boy.png'},
    {name : 'The cat girl', skin: 'images/char-cat-girl.png'},
    {name : 'The horn girl', skin: 'images/char-horn-girl.png'},
    {name : 'The pink girl', skin: 'images/char-pink-girl.png'},
    {name : 'The princess', skin: 'images/char-princess-girl.png'}
];

// Set of gems
var gemTypes = [
    'images/Gem Blue.png',
    'images/Gem Green.png',
    'images/Gem Orange.png'
];

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    // Random delay.
    this.x = - getRandomInt(1,4);
    // Random lane.
    this.y = getRandomInt(1,3);
    // Random speed.
    this.speed = getRandomInt(1,4);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // Move bug right until it`s out of screen;
    this.speed -= 4*dt;

    if(this.speed <= 0){
        this.x++;
        this.speed = getRandomInt(1,4);
    }

    // If it went off reset it.
    if(this.x > 4){
        this.x = -getRandomInt(1,4);
        this.y = getRandomInt(1,3);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x*imageOffsetX, this.y*imageOffsetY);
};

// Player class
var Player = function() {
    this.x = 2;
    this.y = 5;
    this.points = 0;
    this.skinType = 0;
};

// Draw the player
Player.prototype.render = function() {
    console.log(this.x, this.y);
    ctx.drawImage(Resources.get(skins[this.skinType].skin), this.x*imageOffsetX, this.y*imageOffsetY);  
};

// Reset position and points
Player.prototype.reset = function() {
    this.x = 2;
    this.y = 5;
    this.points = 0;
};

// Move player according to key pressed.
Player.prototype.handleInput = function(keyPressed) {
    // Move left
    if(keyPressed === 'left' && this.x > 0){
        this.x--;
    }

    // Move right
    if(keyPressed === 'right' && this.x < 4 ){
        this.x++;
    }

    // Move up
    if(keyPressed === 'up' && this.y > 0){
        this.y--;
    }

    // Move down
    if(keyPressed === 'down' && this.y < 5){
        this.y++;
    }
};

// Get player name according to the skin selected.
Player.prototype.name = function(){
    return skins[this.skinType].name;
};

// Select next skin
Player.prototype.nextSkin = function(){
    if(this.skinType < skins.length - 1){
        this.skinType++;
    }
};

// Select previous skin
Player.prototype.prevSkin = function(){
    if(this.skinType > 0){
        this.skinType--;
    }
};

//Gems player collects
var Gem = function(x, y) {
    // The image/sprite for our gems, this uses
    // a helper we've provided to easily load images
    this.sprite = gemTypes[getRandomInt(0,2)];
    // Position for row.
    this.x = x;
    // Position for lane.
    this.y = y;
};

// Draw the gem
Gem.prototype.render = function() {
    // Offset slightly changed by scaling.
    ctx.drawImage(Resources.get(this.sprite), this.x*imageOffsetX, this.y*(imageOffsetY+7), 101, 140);
};

// Main game object to control the game
// Sets gems and enamies to control difficulty
var Game = function(numberOfGems, numberOfEnemies) {
    this.numberOfGems = numberOfGems;
    this.numberOfEnemies = numberOfEnemies;

    this.player = new Player();
    this.allEnemies = [];
    this._createEnemies();
    this.gems = [];
    this._createGems();
    this.gameOver = false;
    this.run = false;
};

// Reset the game so we can restart
Game.prototype.reset = function(){
    this.player.reset();
    this.allEnemies = [];
    this._createEnemies();
    this.gems = [];
    this._createGems();
    this.gameOver = false;
};

// Render all entities and game screens
Game.prototype.renderEntities = function(){
    this._renderScore();

    this.gems.forEach(function(gem) {
        gem.render();
    });

    this.allEnemies.forEach(function(enemy) {
        enemy.render();
    });

    this.player.render();

    if(this.gameOver){
        this._renderGameOver();
    }

    // Game just started, display instructions 
    if(!this.gameOver && !this.run){
        this._renderStartScreen();
    }
};

// This will write on board.
function writeText(text, x, y, size, align){
    if(align){
        ctx.textAlign = align;
    }
        
    ctx.font = size+'pt Impact';
    ctx.strokeStyle = 'black';
    ctx.font = size+'pt Impact';
    ctx.fillStyle = 'white';
    ctx.fillText(text, x, y);
    ctx.lineWidth = 1;
    ctx.strokeText(text, x, y);
}

// Clear top for score and stats and render them
Game.prototype._renderScore = function(){
    ctx.clearRect ( 0 , 0 , 505, 50 );
    writeText('SCORE: '+ this.player.points, 5, 40, 12, 'left');
};

// Render game over screen.
Game.prototype._renderGameOver = function(){
    writeText('GAME OVER', ctx.canvas.width / 2, ctx.canvas.height / 2, 36, 'center');
    writeText('SCORE: '+this.player.points, ctx.canvas.width / 2, ctx.canvas.height / 2 + 40, 20, 'center');
    writeText('PRESS ENTER TO START AGAIN', ctx.canvas.width / 2, ctx.canvas.height / 2 + 80, 20, 'center');
};

// Render main menu
Game.prototype._renderStartScreen = function(){
    writeText('2K FROGGER', ctx.canvas.width / 2, ctx.canvas.height / 2 - 90, 36, 'center');
    writeText('Get as much points as possible collecting gems', ctx.canvas.width / 2, ctx.canvas.height / 2 - 60, 15, 'center');
    writeText('but be carefull, cause evil bugs are on the hunt!', ctx.canvas.width / 2, ctx.canvas.height / 2 - 30, 15, 'center');
    writeText('Stay away from water cause you character can not swim.', ctx.canvas.width / 2, ctx.canvas.height / 2, 15, 'center');
    writeText('PLAY AS ', ctx.canvas.width / 2, ctx.canvas.height / 2+30, 15, 'center');
    writeText(this.player.name(), ctx.canvas.width / 2, ctx.canvas.height / 2 + 80, 36, 'center');
    writeText('(or you can select your character by pressing left or right)', ctx.canvas.width / 2, ctx.canvas.height / 2 + 130, 15, 'center');
    writeText('PRESS ENTER TO START', ctx.canvas.width / 2, ctx.canvas.height - 40, 20, 'center');
};

// Update all necessary entities
Game.prototype.updateEntities = function(dt){
    this.allEnemies.forEach(function(enemy) {
        enemy.update(dt);
    });
};

// Checks collisions between two objects
function hasCollision(object1, object2){
    return (object1.x === object2.x && object1.y === object2.y);
}

// Contorols all collisions in a game
Game.prototype.checkCollisions = function(){

    // Character may die when collide with enemy.
    var collision = false;
    for (var i = this.allEnemies.length - 1; i >= 0; i--) {
        var enemy = this.allEnemies[i];
        collision = hasCollision(this.player, enemy);
        if(collision){
            this.gameOver = true;
            this.run = false;
        }
    }

    // Character will die when in water.
    if(this.player.y === 0){
        this.gameOver = true;
        this.run = false;
    }

    // Character may collect points when collide with gem.
    var gemsToPreserved = [];
    var addGems = false;
    for (var j = this.gems.length - 1; j >= 0; j--) {
        var gem = this.gems[j];
        collision = hasCollision(this.player, gem);
        if(collision){
            this.player.points++;
            addGems = true;
        } else {
            gemsToPreserved.push(gem);
        }
    }

    // If necessary add gems so we have always the same number
    if(addGems){
        this.gems = gemsToPreserved;
        this._createGems();
    }
    
};

// Cteate enemies up to supplied number
Game.prototype._createEnemies = function(){
    for(var i = 0; i<this.numberOfEnemies; i++){
        this.allEnemies.push(new Enemy());
    }    
};

// Create gems with restriction to put only one for each selected tile.
// Gets gems array and fills that array up to number of gems taking care of unique gam possitions.
Game.prototype._createGems = function(){
    while(this.gems.length < this.numberOfGems){
        var newGem = new Gem(getRandomInt(0,4), getRandomInt(1,3));
        var theSame = false;

        for (var i = this.gems.length - 1; i >= 0; i--) {
            var oldGem = this.gems[i];
            if(oldGem.x === newGem.x && oldGem.y === newGem.y){
                theSame = true;
            }
        }

        if(!theSame){
            this.gems.push(newGem);
        }
    }
};

// Handle game input when in menus
Game.prototype.handleInput = function(keyPressed){
    if(this.run){
        //If game is running we only care about player handling Input
        this.player.handleInput(keyPressed);
    } else {
        if(!this.gameOver){
            if(keyPressed === 'right'){
                this.player.nextSkin();
            }

            if(keyPressed === 'left'){
                this.player.prevSkin();
            }

            if(keyPressed === 'enter'){
                this.run = true;   
            }
            Engine.run();
        } else {
            if(keyPressed === 'enter'){
                this.reset();
                Engine.run();    
            }
        }
    }
};

// Create new game!
var game = new Game(3, 5);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
// Handle game init and over behaviour.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
    };

    var keyPressed = allowedKeys[e.keyCode];
    game.handleInput(keyPressed);
    
});
