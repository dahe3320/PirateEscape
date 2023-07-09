test.scene.Powerups = function(x, y, platform) {
    //--------------------------------------------------------------------------
    // Super call
    //--------------------------------------------------------------------------

    /**
     * Calls the constructor method of the super class.
    */
   this.platforms = platform;
   rune.display.Sprite.call(this, x, y, 32, 32, "goldpile-texture");
   this.m_initPowerups(x,y);
};

test.scene.Powerups.prototype = Object.create(rune.display.Sprite.prototype);
test.scene.Powerups.prototype.constructor = test.scene.Powerups;


// The properties of the class Enemy
test.scene.Powerups.prototype.m_initPowerups = function() {
    rune.display.Sprite.prototype.init.call(this);
    
    this.animation.create("idle", [0, 1, 2], 2, true);
    this.hitbox.set(0 , 32 / 2 , 16 , 16);
 
};



test.scene.Powerups.prototype.dispose = function() {
    rune.display.Sprite.prototype.dispose.call(this);
};


test.scene.Powerups.prototype.update = function(step) {
    rune.display.Sprite.prototype.update.call(this, step);
    // Checks the status of the powerup, whether a shark have destroyed a specific platform with a powerup on it, then it should disappear
    var state;
    this.platforms.forEachMember(function (platform) {
        if (this.hitTestObject(platform)) {
            state = "ON";
        }
    },this);
    // Disposes the powerup if its platform is destroyed
    if (state != "ON") {
        this.dispose();
    }
}