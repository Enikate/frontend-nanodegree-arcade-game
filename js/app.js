/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    // Random delay.
    this.x = -1 * getRandomInt(1,4);
    // Random lane.
    this.y = 1 + getRandomInt(0,2);
    // Random speed.
    this.speed = getRandomInt(1,4);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // Move bug right until it`s gone;
    this.speed -= 4*dt;

    if(this.speed < 0){
        this.x += 1;
        this.speed = Math.floor((Math.random() * 4) + 1);
    }

    // If it went off reset it.
    if(this.x > 5){
        this.x = -1 * getRandomInt(1,4);
        this.y = 1 + getRandomInt(0,2);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x*101, this.y * 73);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-cat-girl.png';
    this.x = 2;
    this.y = 5;
    this.points = 0;
};

// Draw the player
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 73);  
};

// Update the player's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Move player according to key pressed.
Player.prototype.handleInput = function(keyPressed) {
    if(keyPressed === 'left' && this.x > 0){
        this.x--;
    }

    if(keyPressed === 'right' && this.x < 4 ){
        this.x++;
    }

    if(keyPressed === 'up' && this.y > 1){
        this.y--;
    }

    if(keyPressed === 'down' && this.y < 5){
        this.y++;
    }
}

//Gems our player must get
var Gem = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/Gem Blue.png';
    // Random row.
    this.x = x;
    // Random lane.
    this.y = y;
}

// Draw the player
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * (73+7), 101, 140);
};

// Update the player's position, required method for game
// Parameter: dt, a time delta between ticks
Gem.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();
var allEnemies = new Array();

for(var i = 0; i<5; i++){
    allEnemies.push(new Enemy());
}

var gems = new Array();
while(gems.length < 3){
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

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
