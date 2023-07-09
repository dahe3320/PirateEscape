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
test.scene.HowToPlay = function() {
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

test.scene.HowToPlay.prototype = Object.create(rune.scene.Scene.prototype);
test.scene.HowToPlay.prototype.constructor = test.scene.HowToPlay;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

/**
 * This method is automatically executed once after the scene is instantiated. 
 * The method is used to create objects to be used within the scene.
 *
 * @returns {undefined}
 */

// Initiation of the background elements
test.scene.HowToPlay.prototype.init = function() {
    rune.scene.Scene.prototype.init.call(this);
    this.background = new rune.display.Graphic(
        0,
        0,
        400,
        225,
        "background-secondary-texture"
    );
    this.stage.addChild(this.background);
    

    
    var text = new rune.text.BitmapField("Instrductions / How to play");
    text.autoSize = true;
    text.x = this.application.screen.centerX - text.width / 2;
    text.y = 20;
    
    var returnText = new rune.text.BitmapField("PRESS A TO RETURN TO MENU");
    returnText.autoSize = true;
    returnText.x = this.application.screen.centerX - returnText.width / 2;
    returnText.y = 215;

    this.stage.addChild(text);

    this.stage.addChild(returnText);

    this.select_sound = this.application.sounds.sound.get('selection-sound', false);
    
    this.controllerdown = new rune.display.Sprite(
        45,
        40,
        128,
        48,
        "how-to-play-mapping"
    );
    this.controllerright = new rune.display.Sprite(
        175,
        40,
        128,
        48,
        "how-to-play-mapping"
    );
    this.controllerleft = new rune.display.Sprite(
        45,
        100,
        128,
        48,
        "how-to-play-mapping"
    );
    this.controllerrightdown = new rune.display.Sprite(
        175,
        100,
        128,
        48,
        "how-to-play-mapping"
    );
    this.controllerleftdown = new rune.display.Sprite(
        45,
        160,
        128,
        48,
        "how-to-play-mapping"
    );

    this.powerup_graphic = new rune.display.Graphic(
        200,
        150,
        32,
        32,
        "goldpile-texture"
    );

    this.enemy_graphic = new rune.display.Graphic(
        300,
        150,
        32,
        32,
        "shark"
    );

    var powerupText = new rune.text.BitmapField("+20 points");
    powerupText.x = 190;
    powerupText.y = 190;

    var enemyText = new rune.text.BitmapField("Avoid the sharks!");
    enemyText.x = 270;
    enemyText.y = 190;


    this.controllerdown.animation.create("idle", [0, 1], 2, true);
    this.controllerleft.animation.create("idle", [0, 2], 2, true);
    this.controllerright.animation.create("idle", [0, 3], 2, true);
    this.controllerleftdown.animation.create("idle", [0, 4], 2, true);
    this.controllerrightdown.animation.create("idle", [0, 5], 2, true);
    this.controllerdown.animation.gotoAndPlay("idle");
    this.controllerleft.animation.gotoAndPlay("idle");
    this.controllerright.animation.gotoAndPlay("idle");
    this.controllerrightdown.animation.gotoAndPlay("idle");
    this.controllerleftdown.animation.gotoAndPlay("idle");
    this.stage.addChild(this.controllerdown);
    this.stage.addChild(this.controllerleft);
    this.stage.addChild(this.controllerright);
    this.stage.addChild(this.controllerrightdown);
    this.stage.addChild(this.controllerleftdown);
    this.stage.addChild(this.powerup_graphic);
    this.stage.addChild(this.enemy_graphic);
    this.stage.addChild(powerupText);
    this.stage.addChild(enemyText);
    
};

/**
 * This method is automatically executed once per "tick". The method is used for 
 * calculations such as application logic.
 *
 * @param {number} step Fixed time step.
 *
 * @returns {undefined}
 */

// Input for gamepads
test.scene.HowToPlay.prototype.update = function(step) {
    rune.scene.Scene.prototype.update.call(this, step);
if (this.gamepads.get(0).justPressed(0) || this.keyboard.justPressed("SPACE")) {
    this.select_sound.play();
    this.application.scenes.load([new test.scene.Meny()]);
}
};
