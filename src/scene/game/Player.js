test.scene.Player = function (platform, timer, camera, powerups, game) {
    //--------------------------------------------------------------------------
    // Super call
    //--------------------------------------------------------------------------

    /**
     * Calls the constructor method of the super class.
    */
    this.timers = timer;
    this.platform = platform;
    this.cameras = camera;
    this.powerup = powerups;
    this.gameScene = game;
    
    this.steps = 0;

    rune.display.Sprite.call(this, 187, 20, 32, 32, "testpirate");
    this.m_initPlayer();
};

test.scene.Player.prototype = Object.create(rune.display.Sprite.prototype);
test.scene.Player.prototype.constructor = test.scene.Player;


// Initiation of the player properties, anmiations and sound-effects
test.scene.Player.prototype.m_initPlayer = function () {
    rune.display.Sprite.prototype.init.call(this);
    this.animation.create("idle", [0, 1], 4, true);
    this.animation.create("jumpstate", [2, 3], 2, true);
    this.animation.create("jump-right", [4], 4, true);
    this.animation.create("jump-left", [5], 4, true);
    this.animation.create("pirate-in-water", [6], 4, true);
    this.hitbox.set(0, 24, 32, 10);




    this.jumpSound = this.application.sounds.sound.get('pirate-jump-sound', false);
    this.coinCollect = this.application.sounds.sound.get('coin-pickup-sound', false);
    this.waterSound = this.application.sounds.sound.get('pirate-in-water-sound', false);

    this.status = "alive";
    this.yCoord = 0;
    this.xCoord = 0;
    this.movingDown = false;
    this.movingSide = false;
    this.movingLeft = false;
    this.movingRight = false;
    this.movingDownLeft = false;
    this.movingDownRight = false;
    this.jumpState = false;
    this.jumpRight = false;
    this.jumpLeft = false;
    this.jumpDownLeft = false;
    this.jumpDownRight = false;
};

test.scene.Player.prototype.dispose = function () {
    rune.display.Sprite.prototype.dispose.call(this);
};


test.scene.Player.prototype.update = function (step) {
    rune.display.Sprite.prototype.update.call(this, step);
    if (this.status == "alive") {
        this.m_updateKeyboard();
        this.m_updateMoving();
    }

    // Updates the duration of the timer, changes the platforms "sinking" speed
    var updateDuration; 
    if (this.gameScene.points < 100) {
        updateDuration = 4000;
    }
    if (this.gameScene.points > 100) {
        updateDuration = 3000; 
    }
    if (this.gameScene.points > 200) {
        updateDuration = 2000;        
    }
    if (this.gameScene.points > 250) {
        updateDuration = 1000;
    }


    // Checks whether the player is on a platform or not. Starts sinking timer if player is
    var state;
    this.platform.forEachMember(function (plats) {
        if (this.hitTestObject(plats)) {
            state = "ON BOARD";
                plats.animation.gotoAndPlay("sinking");
                this.timers.create({ 
                    onComplete: function () {
                        this.platform.removeMember(plats)
                    },
                    duration: updateDuration,
                    repeat: 0,
                    scope: this,
                }
                );  
        }
    },this);

    // Checks player hit on powerup
    this.powerup.forEachMember(function (power) {
        if (this.hitTestObject(power)) {
            this.steps++;
            this.gameScene.points += 20;
            this.coinCollect.play();
            power.dispose();
        }
    },this);

    // If-statement for when player is in water. Game over code
    if (state != "ON BOARD") {
        this.status = "dead";
        this.application.sounds.master.clear();
        this.animation.gotoAndPlay("pirate-in-water");
        this.waterSound.play();
        this.timers.create({
            onComplete: function () {
                this.dispose();
                this.application.scenes.load([new test.scene.GameOver(this.gameScene.points)]);
            },
            duration: 1500,
            repeat: 0,
            scope: this,
        }
        );
    }
};

test.scene.Player.prototype.m_updateKeyboard = function () {
    // Changing animations on player 
    switch (true) {
        case this.jumpState:
          this.animation.gotoAndPlay("jumpstate");
          break;
        case this.jumpRight:
          this.animation.gotoAndPlay("jump-right");
          break;
        case this.jumpLeft:
          this.animation.gotoAndPlay("jump-left");
          break;
        case this.jumpDownLeft:
          this.animation.gotoAndPlay("jump-left");
          break;
        case this.jumpDownRight:
          this.animation.gotoAndPlay("jump-left");
          break;
        default:
          this.animation.gotoAndPlay("idle");
      }
    
    if (this.gamepads.get(0).justPressed(1) || this.keyboard.justPressed("c")) {
        this.m_delayTimer();
        this.movingDownRight = true;
        this.steps++;
        this.jumpSound.play();
    }
    
    else if (this.gamepads.get(0).justPressed(2) || this.keyboard.justPressed("z")) {
        this.m_delayTimer();
        this.movingDownLeft = true;
        this.steps++;
        this.jumpSound.play();

    }
    else if (this.gamepads.get(0).justPressed(13) || this.keyboard.justPressed("s")) {
        this.m_delayTimer();
        this.movingDown = true;
        this.steps++;
        this.jumpSound.play();

    }
    else if (this.gamepads.get(0).justPressed(15) || this.keyboard.justPressed("d")) {
        this.m_delayTimer();
        this.movingRight = true;
        this.jumpSound.play();

    }
    else if (this.gamepads.get(0).justPressed(14) || this.keyboard.justPressed("a")) {
        this.m_delayTimer();
        this.movingLeft = true;
        this.jumpSound.play();

    }
}

test.scene.Player.prototype.m_updateMoving = function () {
    // The movement calculations to create a delay in the animations of the player. 
    // Counts up the moving coordinate to make a smoother animation. 
    // Addition of the y coordinate until it has reached its maximum.
        if (this.movingDown) {
        if (this.yCoord < 32) {
            this.jumpState = true;
            this.y += 4;
            this.yCoord += 4;
            this.cameras.y += -4;
            this.cameras.height += 4;
            
        } else {
            this.jumpState = false;
            this.movingDown = false;
            this.yCoord = 0;
        }
    }
    
    else if (this.movingRight) {
        if (this.yCoord < 60) {
            this.jumpRight = true;
            this.x += 7.5;
            this.yCoord += 7.5;
        } else {
            this.jumpRight = false;
            this.movingRight = false;
            this.yCoord = 0;
        }
    }

    else if (this.movingLeft) {
        if (this.yCoord < 60) {
            this.jumpLeft = true;
            this.x -= 7.5;
            this.yCoord += 7.5;
        } else {
            this.jumpLeft = false;
            this.movingLeft = false;
            this.yCoord = 0;
        }
    }

    else if (this.movingDownLeft) {
        if (this.yCoord < 32) {
            this.jumpDownLeft = true;
            this.y += 4;
            this.yCoord += 4;
            this.cameras.y += -4;
            this.cameras.height += 4;
        } else {
            this.jumpDownLeft = false;
            this.movingDownLeft = false;
            this.yCoord = 0;
        }
        if (this.xCoord < 60) {
            this.x += -7.5;
            this.xCoord += 7.5;
        } else {
            this.jumpDownLeft = false;
            this.movingDownLeft = false;
            this.xCoord = 0;
        }
    }

    
    else if (this.movingDownRight) {
        if (this.yCoord < 32) {
            this.jumpDownRight = true;
            
            this.y += 4;
            this.yCoord += 4;
            this.cameras.y += -4;
            this.cameras.height += 4;
        } else {
            this.jumpDownRight = false;
            this.movingDownRight = false;
            this.yCoord = 0;
        }
        
        if (this.xCoord < 60) {
            this.x += 7.5;
            this.xCoord += 7.5;
            
        }else {
            this.jumpDownRight = false;
            this.movingDownRight = false;
            this.xCoord = 0;
        }


    }
}

// Timer for when player is in water. Disables all movement with gamepad and keyboard
test.scene.Player.prototype.m_delayTimer = function () {
    this.timers.create({
        onStart: function () {
            this.gamepads.enable = false;
            this.keyboard.enabled = false;
        },
        onComplete: function () {
            this.gamepads.enable = true;
            this.keyboard.enabled = true;
        },
        duration: 350,
        repeat: 0,
        scope: this,
    }
    );
}


