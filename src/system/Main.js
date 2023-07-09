//------------------------------------------------------------------------------
// Constructor scope
//------------------------------------------------------------------------------

/**
 * Creates a new instance of the Main class.
 *
 * @constructor
 * 
 * @class
 * @classdesc
 * 
 * Entry point class.
 */
test.system.Main = function() {

    //--------------------------------------------------------------------------
    // Super call
    //--------------------------------------------------------------------------
    
    /**
     * Extend (Rune) Application.
     */
    rune.system.Application.call(this, {
        developer: "se.lnu",
        app: "test",
        build: "0.0.0",
        scene: test.scene.Meny,
        resources: test.data.Requests,
        useGamepads:true,
        useKeyboard:true,
        framerate: 30,
        debug: false
    });
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

test.system.Main.prototype = Object.create(rune.system.Application.prototype);
test.system.Main.prototype.constructor = test.system.Main;