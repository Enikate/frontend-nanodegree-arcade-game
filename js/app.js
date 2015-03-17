/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Basic settings for the game.
var numberOfEnemies = 5;
var numberOfGems = 3;
var imageOffsetX = 101;
var imageOffsetY = 73;

var skins = new Array();
skins.push({name : "The boy", skin: 'images/char-boy.png'});
skins.push({name : "The cat girl", skin: 'images/char-cat-girl.png'});
skins.push({name : "The horn girl", skin: 'images/char-horn-girl.png'});
skins.push({name : "The pink girl", skin: 'images/char-pink-girl.png'});
skins.push({name : "The princess", skin: 'images/char-princess-girl.png'});

var gemTypes = new Array();
gemTypes.push('images/Gem Blue.png');
gemTypes.push('images/Gem Green.png');
gemTypes.push('images/Gem Orange.png');

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
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.x = 2;
    this.y = 5;
    this.points = 0;
    this.skinType = 0;
};

// Draw the player
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(skins[this.skinType].skin), this.x*imageOffsetX, this.y*imageOffsetY);  
};

// Update the player's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {
    // Not necessary for a player.
};

Player.prototype.reset = function() {
    this.x = 2;
    this.y = 5;
    this.points = 0;
}

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
    if(keyPressed === 'up' && this.y > 1){
        this.y--;
    }

    // Move down
    if(keyPressed === 'down' && this.y < 5){
        this.y++;
    }
}

// Get player name according to the skin selected.
Player.prototype.name = function(){
    return skins[this.skinType].name;
}

Player.prototype.nextSkin = function(){
    if(player.skinType < skins.length - 1){
        player.skinType++;
    }
}

Player.prototype.prevSkin = function(){
    if(player.skinType > 0){
        player.skinType--;
    }
}

//Gems player collects
var Gem = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our gems, this uses
    // a helper we've provided to easily load images
    this.sprite = gemTypes[getRandomInt(0,2)];
    // Random row.
    this.x = x;
    // Random lane.
    this.y = y;
}

// Draw the player
Gem.prototype.render = function() {
    // Offset slightly changed by scaling.
    ctx.drawImage(Resources.get(this.sprite), this.x*imageOffsetX, this.y*(imageOffsetY+7), 101, 140);
};

// Update the player's position, required method for game
// Parameter: dt, a time delta between ticks
Gem.prototype.update = function(dt) {
    // Empty, gems do not need to be updated.
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();
var allEnemies = createEnemies(numberOfEnemies);
var gems = createGems(numberOfGems);

// Cteate enemies up to supplied number
function createEnemies(numberOfEnemies){
    var enemies = new Array();
    // Add enemies.
    for(var i = 0; i<numberOfEnemies; i++){
        enemies.push(new Enemy());
    }    
    return enemies;
}

// Create gems with restriction to put only one for each selected tile.
function createGems(numberOfGems){
    var gems = new Array();
    while(gems.length < numberOfGems){
        var newGem = new Gem(getRandomInt(0,4), getRandomInt(1,3))
        var theSame = false;
        gems.forEach(function(oldGem) {
            if(oldGem.x === newGem.x && oldGem.y === newGem.y){
                theSame = true;
            }
        });

        if(!theSame){
            gems.push(newGem);
        }
    }

    return gems;
}

// Handle game input when in menus
function handleGameInput(keyPressed){
        if(!Engine.isGameOver()){
            console.log(keyPressed);
            if(keyPressed === 'right'){
                player.nextSkin();
            }

            if(keyPressed === 'left'){
                player.prevSkin();
            }

            Engine.init();

            if(keyPressed === 'enter'){
                Engine.runGame();    
            };
        } else {
            if(keyPressed === 'enter'){
                Engine.init();    
            };
        }
}

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

    var keyPressed = allowedKeys[e.keyCode]



    if(Engine.isGameRunning()){
        //If game is running we only care about player handling Input
        player.handleInput(keyPressed);
    } else {
        //If game is not running we are about game handling Input
        handleGameInput(keyPressed);
    }
});
