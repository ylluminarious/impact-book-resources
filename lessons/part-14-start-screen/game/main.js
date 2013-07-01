ig.module( 
	'game.main' 
)
.requires(
    'impact.game',
    'game.levels.dorm1',
    'game.levels.dorm2',
    'impact.font'
)

.defines(function(){

MyGame = ig.Game.extend({
    gravity: 300,
    instructText: new ig.Font( 'media/04b03.font.png' ),
	init: function() {
        this.loadLevel( LevelDorm1 );
        // Bind keys
        ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
        ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
        ig.input.bind( ig.KEY.X, 'jump' );
        ig.input.bind( ig.KEY.C, 'shoot' );
        ig.input.bind( ig.KEY.TAB, 'switch' );
        ig.music.add( 'media/sounds/theme.*' );
        ig.music.volume = 0.5;
        ig.music.play();
	},
    update: function() {
    	// screen follows the player
    	var player = this.getEntitiesByType( EntityPlayer )[0];
    	if( player ) {
    		this.screen.x = player.pos.x - ig.system.width/2;
    		this.screen.y = player.pos.y - ig.system.height/2;
            if(player.accel.x > 0 && this.instructText)
                this.instructText = null;
    	}
    	// Update all entities and BackgroundMaps
    	this.parent();
    },
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
        if(this.instructText){
            var x = ig.system.width/2,
            y = ig.system.height - 10;
            this.instructText.draw( 'Left/Right Moves, X Jumps, C Fires & Tab Switches Weapons.', x, y, ig.Font.ALIGN.CENTER );
        }
	}
});

StartScreen = ig.Game.extend({
    instructText: new ig.Font( 'media/04b03.font.png' ),
    background: new ig.Image('media/screen-bg.png'),
    mainCharacter: new ig.Image('media/screen-main-character.png'),
    title: new ig.Image('media/game-title.png'),
    init: function() {
        ig.input.bind( ig.KEY.SPACE, 'start');
    },
    update: function() {
        if(ig.input.pressed ('start')){
            ig.system.setGame(MyGame)
        }
        this.parent();
    },
    draw: function() {
        this.parent();
        this.background.draw(0,0);
        this.mainCharacter.draw(0,0);
        this.title.draw(ig.system.width - this.title.width, 0);
        var x = ig.system.width/2,
        y = ig.system.height - 10;
        this.instructText.draw( 'Press Spacebar To Start', x+40, y, ig.Font.ALIGN.CENTER );
    }
});

if( ig.ua.mobile ) {
    // Disable sound for all mobile devices
    ig.Sound.enabled = false;
}

// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', StartScreen, 60, 320, 240, 2 );

});
