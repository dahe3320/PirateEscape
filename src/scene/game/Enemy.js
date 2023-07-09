test.scene.Enemy = function(x, y,platform) {
    //--------------------------------------------------------------------------
    // Super call
    //--------------------------------------------------------------------------
    
    /**
     * Calls the constructor method of the super class.
    */
   this.platform = platform;
   
   // controles the parameter of x and gives the object a x-coordinate that is generated
   if (x == "right") {
       x = 400;
       
    } else {
        x = -20;
    }
    rune.display.Sprite.call(this, x, y, 32, 32, "shark");
    this.hit_sound = this.application.sounds.sound.get('shark-hit', false);
    this.m_initEnemy(x,y);
};

test.scene.Enemy.prototype = Object.create(rune.display.Sprite.prototype);
test.scene.Enemy.prototype.constructor = test.scene.Enemy;


// The properties of the class Enemy
test.scene.Enemy.prototype.m_initEnemy = function(x, y) {
    rune.display.Sprite.prototype.init.call(this);
    this.animation.create("idle", [0, 1, 2], 2, true);
    this.hitbox.set(0, this.height / 2 - 5, 32, 10);

    // If-statements that checks the spawnpoints and giving them animation and velocity
    if (x == 400) {
        this.velocity.x = -1;
        this.animation.gotoAndPlay("idle");

    } else {
        this.flippedX = true;
        this.velocity.x = 1;
        this.animation.gotoAndPlay("idle");

    }   
    
};



test.scene.Enemy.prototype.dispose = function() {
    rune.display.Sprite.prototype.dispose.call(this);
};


test.scene.Enemy.prototype.update = function(step) {
    rune.display.Sprite.prototype.update.call(this, step);
    
    // Checks platform hit of the object, if so dispose this and the platform
    this.platform.forEachMember(function (plats) {
        if (this.hitTestObject(plats)) {
            this.dispose();
            plats.dispose();
            this.hit_sound.play();
       } 
    },this);
}