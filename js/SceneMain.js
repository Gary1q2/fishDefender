class SceneMain extends Phaser.Scene {
    constructor() {
        super({ key: 'SceneMain' });
    }

    preload() {
        this.load.image('spr_player', 'img/player.png');
        this.load.image('spr_diver', 'img/diver.png');
        this.load.image('spr_chest', 'img/chest.png');
        this.load.image('spr_background', 'img/background.png');
        this.load.image('spr_ground', 'img/ground.png');
    }

    create() {

        this.background = this.add.sprite(this.game.config.width/2, this.game.config.height/2, 'spr_background');

        this.ground = this.physics.add.staticGroup();
        this.ground.create(this.game.config.width/2, this.game.config.height-25, 'spr_ground');

        this.chest = this.add.sprite(this.game.config.width/2, this.game.config.height-55, 'spr_chest');
        this.player = new Player(this, this.game.config.width/2, this.game.config.height/2, 'spr_player');


        // Mouse inputs
        this.input.on('pointerdown', function(pointer) {
            console.log('down');
            this.player.moveTo(Math.round(pointer.x), Math.round(pointer.y));
        }, this);
        this.input.on('pointerup', function(pointer) {
            console.log('up');
        }, this);

        // Display FPS
        this.fps = this.add.text(5, 5, this.game.loop.actualFps);

        // Groups for entities
        this.divers = this.add.group();


        // Timer that spawns divers
        this.time.addEvent({
            delay: 1000,
            callback: function() {
                var spawnBuffer = 20;
                var diver = new Diver(this, (Math.random() <= 0.5) ? spawnBuffer : this.game.config.width-spawnBuffer, 0, 'spr_diver');
                this.divers.add(diver);

                console.log(this.divers);
            },
            callbackScope: this,
            loop: true
        });


        this.physics.add.collider(this.divers, this.ground);

    }

    update() {
        this.player.update();

    }
}