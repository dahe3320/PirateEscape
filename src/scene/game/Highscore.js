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
test.scene.Highscore = function() {
    this.menubackground = null;
    this.menu = null;
    this.highscoreList = null;
    this.placementNames = ["Best Player", "Second Best Player", "Third Best Player", "Fourth Best Player", "Fifth Best Player"];
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

test.scene.Highscore.prototype = Object.create(rune.scene.Scene.prototype);
test.scene.Highscore.prototype.constructor = test.scene.Highscore;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

/**
 * This method is automatically executed once after the scene is instantiated. 
 * The method is used to create objects to be used within the scene.
 *
 * @returns {undefined}
 */
test.scene.Highscore.prototype.init = function() {
    rune.scene.Scene.prototype.init.call(this);


    
    this.menubackground = new rune.display.Graphic(
        0,
        0,
        400,
        225,
        "background-secondary-texture"
    );
    
    this.ship = new rune.display.Sprite(100, 120, 32, 32, "pirateship");
    this.stage.addChild(this.menubackground);
    this.select_sound = this.application.sounds.sound.get('selection-sound', false);

    this.m_initHighscore();
};

/**
 * This method is automatically executed once per "tick". The method is used for 
 * calculations such as application logic.
 *
 * @param {number} step Fixed time step.
 *
 * @returns {undefined}
 */
test.scene.Highscore.prototype.update = function(step) {
    rune.scene.Scene.prototype.update.call(this, step);
    if (this.gamepads.get(0).justPressed(0) || this.keyboard.justPressed("SPACE")) {
        this.select_sound.play();
        this.application.scenes.load([new test.scene.Meny()]);
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
test.scene.Highscore.prototype.dispose = function() {
    rune.scene.Scene.prototype.dispose.call(this);
};

// Method for generating the highscore and writing out the top five best scores 
test.scene.Highscore.prototype.m_initHighscore = function() {
    this.highscoreList = new rune.ui.VTList();
    for (var i = 0; i < 5; i++) {
        var placement = this.application.highscores.get(i, 0);
        var text = (i + 1) + ". " + this.placementNames[i] + " - " + placement.score;
        this.highscoreList.add(text.toString());
    }
    this.highscoreList.align = "LEFT";
    this.highscoreList.center = this.application.screen.center;
    this.stage.addChild(this.highscoreList);
    this.menu = new rune.ui.VTMenu();
    this.menu.add("PRESS A TO RETURN TO MAIN MENU");

    
    this.menu.center = this.application.screen.center;
    this.menu.y = 200;


    this.stage.addChild(this.menu);

};
