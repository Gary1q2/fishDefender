class SceneMain extends Phaser.Scene {
    constructor() {
        super({ key: 'SceneMain' });
    }

    preload() {
        this.load.image('spr_player', 'img/player.png');
        this.load.image('spr_diver', 'img/diver.png');
        this.load.image('spr_chest', 'img/chest.png');
        this.load.image('spr_background', 'img/background.png');
    }

    create() {

        this.background = this.add.sprite(this.game.config.width/2, this.game.config.height/2, 'spr_background');

        this.player = new Player(this, this.game.config.width/2, this.game.config.height/2, 'spr_player');


        // Mouse inputs
        this.input.on('pointerdown', function(pointer) {
            console.log('down');
            this.player.setTargetDest(Math.round(pointer.x), Math.round(pointer.y));

        }, this);
        this.input.on('pointerup', function(pointer) {
            console.log('up');
        }, this);



        // Display FPS
        this.fps = this.add.text(5, 5, this.game.loop.actualFps);
    }

    update() {
        this.player.update();

    }
}