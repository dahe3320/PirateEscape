test.scene.Platform = function(x,y,points) {
    this.points = points;
    this.frames = null;
    //--------------------------------------------------------------------------
    // Super call
    //--------------------------------------------------------------------------
    
    /**
     * Calls the constructor method of the super class.
    */
   rune.display.Sprite.call(this, x, y, 64, 32, "sandpile-texture");
   this.m_initPlatform();
};

test.scene.Platform.prototype = Object.create(rune.display.Sprite.prototype);
test.scene.Platform.prototype.constructor = test.scene.Platform;


// The properties of the class Enemy
test.scene.Platform.prototype.m_initPlatform = function() {
    rune.display.Sprite.prototype.init.call(this);
    
    // Updating the frames per second on the sinking animation of the platforms, depending on the amount of points achieved
    if (this.points < 100) {
        this.frames = 1;
    }
    if (this.points > 100) {
        this.frames =  2;
    }
    if (this.points > 200) {
        this.frames = 3;        
    }
    if (this.points > 250) {
        this.frames = 6;
    }
    this.animation.create("idle", [0, 1], 2, true);
    this.animation.create("sinking", [2, 3, 4, 5, 6, 7], this.frames, false);

};

test.scene.Platform.prototype.dispose = function() {
    rune.display.Sprite.prototype.dispose.call(this);
};





