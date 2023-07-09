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
test.scene.Meny = function() {
    this.menu = null;
    this.menubackground = null;
    this.maintext = null;
    this.credits_text = null;
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

test.scene.Meny.prototype = Object.create(rune.scene.Scene.prototype);
test.scene.Meny.prototype.constructor = test.scene.Meny;

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
test.scene.Meny.prototype.init = function() {
    rune.scene.Scene.prototype.init.call(this);


    // Menu background
    this.menubackground = new rune.display.Graphic(
        0,
        0,
        400,
        225,
        "pirate-escape-menubackground"
    );
    
    this.ship = new rune.display.Sprite(100, 120, 32, 32, "pirateship");
    this.ship.animation.create("sailing", [0,1,2], 1, true);
    this.ship.animation.gotoAndPlay("sailing");
    
    this.stage.addChild(this.menubackground);
    this.stage.addChild(this.ship);

    // Pirate Escape menu text
    this.menutext = new rune.display.Sprite(
        100,
        20,
        188,
        50,
        "pirateescape-text"
    );
    this.menutext.animation.create("idle", [0, 1, 2, 1], 4, true);
    this.menutext.animation.gotoAndPlay("idle");

    this.credits_text = new rune.text.BitmapField("Music by: Kevin McLeod");
    this.credits_text.x = 5;
    this.credits_text.y = 215;
    this.credits_text.width = 300;
    
    this.stage.addChild(this.menutext);
    this.stage.addChild(this.credits_text);


    this.menu_music = this.application.sounds.master.get('pirate-escape-maintheme', true);
    this.navigate_sound = this.application.sounds.sound.get('navigate-sound', false);
    this.select_sound = this.application.sounds.sound.get('selection-sound', false);
    this.menu_music.play();
    this.menu_music.loop = true;
    this.menu_music.volume = .9;
    this.navigate_sound.volume = .5;
    this.m_initMenu();
};

/**
 * This method is automatically executed once per "tick". The method is used for 
 * calculations such as application logic.
 *
 * @param {number} step Fixed time step.
 *
 * @returns {undefined}
 */


test.scene.Meny.prototype.update = function(step) {
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
test.scene.Meny.prototype.dispose = function() {
    rune.scene.Scene.prototype.dispose.call(this);
};

// Initiation of the menu elements
test.scene.Meny.prototype.m_initMenu = function() {
    this.menu = new rune.ui.VTMenu();
    this.menu.onSelect(this.m_menuOnSelect, this);
    this.menu.add("START");
    this.menu.add("HOW TO PLAY");
    this.menu.add("HIGHSCORE");
    
    this.menu.center = this.application.screen.center;

    this.stage.addChild(this.menu);

};

// Inputs for gamepad
test.scene.Meny.prototype.m_menuOnSelect = function(elem) {
    switch (elem.text) {
        case "START":
            this.application.scenes.load([new test.scene.Game()]);
            break;
        case "HOW TO PLAY":
            this.application.scenes.load([new test.scene.HowToPlay()]);
            break;
        case "HIGHSCORE":
            this.application.scenes.load([new test.scene.Highscore()]);
            break;
    
        
    }
}