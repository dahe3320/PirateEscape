//------------------------------------------------------------------------------
// Constructor scope
//------------------------------------------------------------------------------

/**
 * Creates a new object.
 *
 * @constructor
 * @extends rune.scene.Scene
 *
 * @class
 * @classdesc
 * 
 * Game scene.
 */
test.scene.Game = function () {
    this.background_music = null;
    this.background = null;
    this.player = null;
    this.enemy = null;
    this.powerup = null;
    this.platforms = [];
    this.backgroundY = 720;
    this.enemyGroup = null;
    this.enemies = [];
    this.platformGroup = null;
    this.powerupGroup = null;
    this.powerups = [];
    this.cameramove = 0;
    this.points = 0;
    this.spawnTimer = null;
    this.updateDuration = null;
    this.countScore = null;


    //--------------------------------------------------------------------------
    // Super call
    //--------------------------------------------------------------------------

    /**
     * Calls the constructor method of the super class.
    */
   rune.scene.Scene.call(this);
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

test.scene.Game.prototype = Object.create(rune.scene.Scene.prototype);
test.scene.Game.prototype.constructor = test.scene.Game;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

/**
 * This method is automatically executed once after the scene is instantiated. 
 * The method is used to create objects to be used within the scene.
*
* @returns {undefined}
*/
test.scene.Game.prototype.init = function () {
    rune.scene.Scene.prototype.init.call(this);
    this.application.sounds.master.clear();
    this.background_music = this.application.sounds.master.get('in-game-music', true);
    this.background_music.play();
    this.background_music.volume = .2;
    this.background_music.loop = true;
    this.platformGroup = this.groups.create(this.stage);
    this.powerupGroup = this.groups.create(this.stage);
    this.enemyGroup = this.groups.create(this.stage);
    this.m_initBackground();
    this.m_initPlatforms();
    this.m_initSpawnPlayer();
    this.m_initTimer();
    this.m_initCounterScore();
};

/**
 * This method is automatically executed once per "tick". The method is used for 
 * calculations such as application logic.
*
* @param {number} step Fixed time step.
 *
 * @returns {undefined}
 */
test.scene.Game.prototype.update = function (step) {
    rune.scene.Scene.prototype.update.call(this, step);
    // Updates camera position with each step forward that player takes
    if (this.cameramove < this.player.steps) { 
        this.background.height += 32;
        this.cameramove = this.player.steps;
        var newRow = this.background.height -32;
        this.points++;
        this.platformRows.push(newRow);
        this.m_addRowOfPlatforms(newRow);
    } 
    // Negative for-loop to avoid length problem of the array / displayGroup.
    // Removes objects from scene when not in camera-sight
    for (var i = this.platforms.length - 1; i >= 0; i--) {
        var platform = this.platforms[i];
        if (Math.abs(this.cameras.getCameraAt(0).y) > platform.y + 32) {
            this.platformGroup.removeMember(platform);
            this.platforms.splice(i, 1);
            for (var j = 0; j < this.platformRows.length; j++) {
                if (this.platformRows[j] == platform.y) {
                    this.platformRows.splice(j, 1);
                }
            }
        }
        
    }
    // Negative for-loop to avoid length problem of the array / displayGroup.
    // Removes objects from scene when not in camera-sight
    for (var s = this.enemies.length - 1; s >= 0; s--) {
        var shark = this.enemies[s];
        if (Math.abs(this.cameras.getCameraAt(0).y) > shark.y) {
            this.enemyGroup.removeMember(shark);
            this.enemies.splice(s, 1);
            //shark.dispose();
        }
    }
    // Negative for-loop to avoid length problem of the array / displayGroup.
    // Removes objects from scene when not in camera-sight
    for (var k = this.powerups.length - 1; k >= 0; k--) {
        var powerup = this.powerups[k];
        if (Math.abs(this.cameras.getCameraAt(0).y) > powerup.y) {
            this.powerupGroup.removeMember(powerup);
            this.powerups.splice(k, 1);
        }

    }
    // Updates spawn-timer of the enemies when the score is at a certain point.
    if (this.points > 100 && this.points < 200) {
        this.updateDuration = 1500; 
        this.spawnTimer.duration = this.updateDuration;
    }
    else if (this.points > 200 && this.points < 250) {
        this.updateDuration = 1000;
        this.spawnTimer.duration = this.updateDuration;
    }
    else if (this.points > 250) {
        this.updateDuration = 500;
        this.spawnTimer.duration = this.updateDuration;
    }
    else {
        this.updateDuration = 2500;
        this.spawnTimer.duration = this.updateDuration;
    }    
    this.countScore.y = this.player.y + 20; 
    this.countScore.text = "Score: " + this.points;    
};

/**
 * This method is automatically called once just before the scene ends. Use 
 * the method to reset references and remove objects that no longer need to 
 * exist when the scene is destroyed. The process is performed in order to 
 * avoid memory leaks.
*
* @returns {undefined}
*/
test.scene.Game.prototype.dispose = function () {
    rune.scene.Scene.prototype.dispose.call(this);
};




// Method for generating platforms in the start of the game
// Generating a grid of platforms (3*5) and removes two randomized platforms to create a random pattern of platforms
test.scene.Game.prototype.m_initPlatforms = function() {
        this.platformRows = []; // Array used for spawnpoints of the enemies 
        for (var col = 0; col < 3; col++) {
            var xStart = 80 + col * 60; // Start coordinate of x
            var xEnd = xStart + 30;  // End coordinate of x
            for (var row = 0; row < 5; row++) { 
                var x = Math.floor((xEnd - xStart + 1) + xStart); 
                var y = 60 + row * 32;
                var platform = new test.scene.Platform(x, y);
                this.platformGroup.addMember(platform);
                this.platforms.push(platform);
                this.stage.addChild(platform);
                this.platformRows.push(y); // y-coordinate used for enemy class spawnpoint
            }
        }
        // For-loop that removes two random platforms
        for (var j = 0; j < 2; j++) {
            var randomIndex = Math.floor(Math.random() * this.platforms.length); 
            this.platforms[randomIndex].dispose();
            this.platforms.splice(randomIndex, 1);
        }

};
// Method to generate new row of platform when the player takes a step forward
// Generates a row where one randomize platform is removed to create a pattern in the scene
test.scene.Game.prototype.m_addRowOfPlatforms = function(y) {
    var removeIndex = Math.floor(Math.random() * 3);
    for (var col = 0; col < 3; col++) {
        if (col !== removeIndex) {
            var xStart = 80 + col * 60;
            var xEnd = xStart + 30;
            var x = Math.floor((xEnd - xStart + 1) + xStart);
            var platform = new test.scene.Platform(x, y, this.points);
            this.platformGroup.addMember(platform);
            this.platforms.push(platform);
            this.stage.addChild(platform);
            this.m_initSpawnPowerups(platform); 
        }
    }
    this.stage.swapChildren(platform, this.player);    
};


/**
 * This method is automatically executed once after the scene is instantiated. 
 * The method is used to create objects to be used within the scene.
*
* @returns {undefined}
*/ 
// Method for the Player class
test.scene.Game.prototype.m_initSpawnPlayer = function () {
    this.player = new test.scene.Player(this.platformGroup, this.timers, this.cameras.getCameraAt(0), this.powerupGroup, this);
    this.stage.addChild(this.player);
};

// Method for the Enemy class
// Uses the platformRows (containing a y-coordinate) to spawn the enemy on specific coordinate
test.scene.Game.prototype.m_initSpawnEnemies = function () {
    var row = Math.floor(Math.random() * this.platformRows.length);
    var y = this.platformRows[row];
    var side = Math.random() < 0.5 ? "left" : "right"; // Decides whether the enemy should spawn on right or left side
    var enemy = new test.scene.Enemy(side,y,this.platformGroup);
    this.stage.addChild(enemy);
    this.enemyGroup.addMember(enemy);
    this.enemies.push(enemy);
};

// Method for the background and start platform
test.scene.Game.prototype.m_initBackground = function () {
    this.background = new rune.display.DisplayObject(0, 0, 1200, 225);
    this.rect = new rune.display.Sprite(171, 30, 64, 32, "sandpile-texture");
    this.background.backgroundColor = "#00eaff";
    this.background.hitbox.set(0, 0, 50, 300);
    
    this.stage.addChild(this.background);
    this.platformGroup.addMember(this.rect);
    
    this.stage.addChild(this.rect); 
    this.rect.animation.create("sinking", [2, 3, 4, 5, 6, 7], 2, false);
    this.rect.animation.gotoAndPlay("sinking");
};

// Timer for the spawn of the enemy
// Differs depending on the state of the game with "this.updateDuration"
// Calls the Enemy class on tick
test.scene.Game.prototype.m_initTimer = function () {
    this.spawnTimer = this.timers.create({
    onTick: this.m_initSpawnEnemies,
    duration: this.updateDuration,
    repeat: Infinity,
    scope: this,
}
);
};

// Method for powerups
// Uses platform to spawn the coordinates of the given powerup 
test.scene.Game.prototype.m_initSpawnPowerups = function (platform) {
    var x = platform.x + (platform.width - 32) / 2;
    var y = platform.y + (platform.height - 32) / 2;
        // Timer that is used to decide whether the powerup should spawn or not
        // Creates a powerup if the player has a total amount of steps and giving it a 30% chance of spawning
        this.timers.create({
            onTick: function () {
                if ((this.cameramove % 5 === 0) && Math.random() < 0.3) {
                var powerup = new test.scene.Powerups(x,y,this.platformGroup);
                this.stage.addChild(powerup);
                this.powerupGroup.addMember(powerup);
                this.powerups.push(powerup);
            }
            },
            repeat: 0,
            scope: this,
        }
        );
};

// Method for the count of the score
// Updates the score text on the scene with the cameramovement
test.scene.Game.prototype.m_initCounterScore = function () {
    this.countScore = new rune.text.BitmapField("Score: " + this.points);
    this.countScore.x = this.cameras.getCameraAt(0).viewport.x;
    this.countScore.y = this.player.y;
    this.stage.addChild(this.countScore);
};

