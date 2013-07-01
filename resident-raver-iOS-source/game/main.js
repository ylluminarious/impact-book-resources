ig.module( 
	'game.main' 
)
.requires(
    'impact.game',
    'game.levels.dorm1',
    'game.levels.dorm2',
    'impact.font',
    // require all ios plugins for compatability
    'plugins.ios.ios'
)

.defines(function(){

MyGame = ig.Game.extend({
    gravity: 300,
    instructText: new ig.Font( 'media/04b03.font.png' ),
    statText: new ig.Font( 'media/04b03.font.png' ),
    showStats: false,
    statMatte: new ig.Image('media/stat-matte.png'),
    levelTimer: new ig.Timer(),
    levelExit: null,
    stats: {time: 0, kills: 0, deaths: 0},
    lives: 3,
    lifeSprite: new ig.Image('media/life-sprite.png'),
    // button images
    buttons: new ig.Image( 'media/buttons.png' ),

	init: function() {
        this.loadLevel( LevelDorm1 );
        ig.music.add( 'media/sounds/theme.*' );
        ig.music.volume = 0.5;
        ig.music.play();
	},
    loadLevel: function( data ) {
        this.stats = {time: 0, kills: 0, deaths: 0};
    	this.parent(data);                        
        for( var i = 0; i < this.backgroundMaps.length; i++ ) {
            this.backgroundMaps[i].chunkSize = 256;
            this.backgroundMaps[i].preRender = true;
        }
        this.levelTimer.reset();
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
        if(!this.showStats){
        	this.parent();
        }else{
            if(ig.input.state('continue')){
                this.showStats = false;
                this.levelExit.nextLevel();
                this.parent();
            }
        }
    },
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
        if(this.instructText){
            var x = ig.system.width/2,
            y = ig.system.height - 10;
            this.instructText.draw( 'Use the touch controls to play the game.', x, y, ig.Font.ALIGN.CENTER );
        }
        if(this.showStats){
            this.statMatte.draw(0,0);
            var x = ig.system.width/2;
            var y = ig.system.height/2 - 20;
            this. statText.draw('Level Complete', x, y, ig.Font.ALIGN.CENTER);
            this. statText.draw('Time: '+this.stats.time, x, y+30, ig.Font.ALIGN.CENTER);
            this. statText.draw('Kills: '+this.stats.kills, x, y+40, ig.Font.ALIGN.CENTER);
            this. statText.draw('Deaths: '+this.stats.deaths, x, y+50, ig.Font.ALIGN.CENTER);
            this. statText.draw('Press SpaceBar to continue.', x, ig.system.height - 10, ig.Font.ALIGN.CENTER);
        }
        this.statText.draw("Lives", 5,5);
        for(var i=0; i < this.lives; i++)
            this.lifeSprite.draw(((this.lifeSprite.width + 2) * i)+5, 15);
        
        // Draw buttons
        this.buttons.drawTile( 0, 110, 0, 80, 48, false, false );
        this.buttons.drawTile( ig.system.width-80, 110, 1, 80, 48, false, false );
        this.buttons.drawTile( ig.system.width-40, 0, 4, 40, 48, false, false );
	},
    toggleStats: function(levelExit){
        this.showStats = true;
        this.stats.time = Math.round(this.levelTimer.delta());
        this.levelExit = levelExit;
    },
    gameOver: function(){
        ig.finalStats = ig.game.stats;
        ig.system.setGame(GameOverScreen);
    }
});

StartScreen = ig.Game.extend({
    instructText: new ig.Font('media/04b03.font.png'),
    background: new ig.Image('media/screen-bg.png'),
    mainCharacter: new ig.Image('media/screen-main-character.png'),
    title: new ig.Image('media/game-title.png'),
    init: function() {
        
         // Bind keys
         if( ios ) {
             // When running on ios we have to specify the buttons by
             // defining an area: (x, y, width, height, action)
             // Note that these are unscaled pixel coordinates!
             ig.input.bindTouchArea( 0, 224, 80, 96, 'left' );
             ig.input.bindTouchArea( 80, 224, 80, 96, 'right' );
             ig.input.bindTouchArea( 320, 224, 80, 96, 'shoot' );
             ig.input.bindTouchArea( 400, 224, 80, 96, 'jump' );
             ig.input.bindTouchArea( 400, 0, 80, 96, 'switch' );
             ig.input.bindTouchArea( 0, 0, 320, 240, 'continue' );
         }
         else {
             ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
             ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
             ig.input.bind( ig.KEY.X, 'jump' );
             ig.input.bind( ig.KEY.C, 'shoot' );
             ig.input.bind( ig.KEY.TAB, 'switch' );
             ig.input.bind( ig.KEY.SPACE, 'continue');
         }
    },
    update: function() {
        if(ig.input.pressed ('continue')){
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
        this.instructText.draw( 'Press Anywhere To Start', x+55, y, ig.Font.ALIGN.CENTER );
    }
});

GameOverScreen = ig.Game.extend({
    instructText: new ig.Font( 'media/04b03.font.png' ),
    background: new ig.Image('media/screen-bg.png'),
    gameOver: new ig.Image('media/game-over.png'),
    stats: {},
    init: function() {
        this.stats = ig.finalStats;
    },
    update: function() {
        if(ig.input.pressed('continue')){
            ig.system.setGame(StartScreen)
        }
        this.parent();
    },
    draw: function() {
        this.parent();
        this.background.draw(0,0);
        var x = ig.system.width/2;
        var y = ig.system.height/2 - 20;
        this.gameOver.draw(x - (this.gameOver.width * .5), y - 30);
        var score = (this.stats.kills * 100) - (this.stats.deaths * 50);
        this.instructText.draw('Total Kills: '+this.stats.kills, x, y+30, ig.Font.ALIGN.CENTER);
        this.instructText.draw('Total Deaths: '+this.stats.deaths, x, y+40, ig.Font.ALIGN.CENTER);
        this.instructText.draw('Score: '+score, x, y+50, ig.Font.ALIGN.CENTER);
        this.instructText.draw('Press SpaceBar To Continue.', x, ig.system.height - 10, ig.Font.ALIGN.CENTER);
    }
});

if( ios ) {
    ig.Sound.use = [ig.Sound.FORMAT.CAF];
}

// Start the Game with 60fps, a resolution of 240x160, scaled
// up by a factor of 2
ig.main( '#canvas', StartScreen, 60, 240, 160, 2 );
});
