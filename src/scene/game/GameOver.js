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
test.scene.GameOver = function(score) {
    this.menu = null;
    this.gameScore = score; 
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

test.scene.GameOver.prototype = Object.create(rune.scene.Scene.prototype);
test.scene.GameOver.prototype.constructor = test.scene.GameOver;

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
test.scene.GameOver.prototype.init = function() {
    rune.scene.Scene.prototype.init.call(this);
    this.gamepads.enable = true;
    this.keyboard.enabled = true;
    this.background = new rune.display.Graphic(
        0,
        0,
        400,
        225,
        "game-over-background"
    );
    
    this.ship = new rune.display.Sprite(290, 125, 32, 32, "pirateship");
    this.ship.animation.create("sailing", [0,1,2], 1, true);
    this.ship.animation.gotoAndPlay("sailing");
    this.stage.addChild(this.background);
    this.stage.addChild(this.ship)
    
    var text = new rune.text.BitmapField("GAME OVER ! You got " + this.gameScore + " points!");
    text.autoSize = true;
    text.x = this.application.screen.centerX - text.width / 2;
    text.y = 20;

    this.stage.addChild(text);

    this.navigate_sound = this.application.sounds.sound.get('navigate-sound', false);
    this.select_sound = this.application.sounds.sound.get('selection-sound', false);
    // Checks if the highscore is places on the table of the highscore or not
    if (this.application.highscores.test(this.gameScore, 0) != -1) {
        this.application.highscores.send(this.gameScore, "DH", 0);
    }

    this.m_initMenu();
};

// Initiation of the menu elements
test.scene.GameOver.prototype.m_initMenu = function() {
    this.menu = new rune.ui.VTMenu();
    this.menu.onSelect(this.m_menuOnSelect, this);
    this.menu.add("PLAY AGAIN");
    this.menu.add("HOW TO PLAY");
    this.menu.add("HIGHSCORE");
    this.menu.add("BACK TO MENU");
    
    this.menu.center = this.application.screen.center;

    this.stage.addChild(this.menu);
    

};

/**
 * This method is automatically executed once per "tick". The method is used for 
 * calculations such as application logic.
 *
 * @param {number} step Fixed time step.
 *
 * @returns {undefined}
*/

// Inputs for gamepad
test.scene.GameOver.prototype.update = function(step) {
    rune.scene.Scene.prototype.update.call(this, step);
    if (this.gamepads.get(0).justPressed(0) || this.keyboard.justPressed("SPACE")) {
        this.select_sound.play();
        this.menu.select();
    }
    if (this.gamepads.get(0).justPressed(13) || this.keyboard.justPressed("s")) {
        this.navigate_sound.play();
        this.menu.down();
    }
    if (this.gamepads.get(0).justPressed(12) || this.keyboard.justPressed("w")) {
        this.navigate_sound.play();
        this.menu.up();
    }
};

/**
 * This method is automatically called once just before the scene ends. Use 
 * the method to reset references and remove objects that no longer need to 
 * exist when the scene is destroyed. The process is performed in order to 
 * avoid memory leaks.
 *
 * @returns {undefined}
 */
test.scene.GameOver.prototype.dispose = function() {
    rune.scene.Scene.prototype.dispose.call(this);
};

// Switch case for the actions of the menu options
test.scene.GameOver.prototype.m_menuOnSelect = function(elem) {
    switch (elem.text) {
        case "PLAY AGAIN":
            this.application.scenes.load([new test.scene.Game()]);
            break;
        case "HOW TO PLAY":
            this.application.scenes.load([new test.scene.HowToPlay()]);
            break;
        case "HIGHSCORE":
            this.application.scenes.load([new test.scene.Highscore()]);
            break;
        case "BACK TO MENU":
            this.application.scenes.load([new test.scene.Meny()]);
            break;
    
        
    }
};