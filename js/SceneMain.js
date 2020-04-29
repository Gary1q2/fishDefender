class SceneMain extends Phaser.Scene {
    constructor() {
        super({ key: 'SceneMain' });
    }

    preload() {
        this.load.spritesheet('spr_player', 'img/player.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.image('spr_diver', 'img/diver.png');
        this.load.image('spr_chest', 'img/chest.png');
        this.load.image('spr_background', 'img/background.png');
        this.load.image('spr_ground', 'img/ground.png');
    }

    create() {

        // Creating animations
        this.anims.create({
            key: 'spr_player',
            frames: this.anims.generateFrameNumbers('spr_player'),
            frameRate: 2,
            repeat: -1
        });



        // Groups for entities
        this.divers = this.add.group();

        this.background = this.add.sprite(this.game.config.width/2, this.game.config.height/2, 'spr_background');

        this.ground = this.physics.add.staticGroup();
        this.ground.create(this.game.config.width/2, this.game.config.height-25, 'spr_ground');

        this.chest = this.add.sprite(this.game.config.width/2, this.game.config.height-55, 'spr_chest');
        this.player = new Player(this, this.game.config.width/2, this.game.config.height/2, 'spr_player');




        // Adding diver and ground collisions
        this.physics.add.collider(this.divers, this.ground);



        // Timer that spawns divers
        this.time.addEvent({
            delay: 1000,
            callback: function() {
                var spawnBuffer = 20;
                var diver = new Diver(this, (Math.random() <= 0.5) ? spawnBuffer : this.game.config.width-spawnBuffer, 0, 'spr_diver');
                this.divers.add(diver);
            },
            callbackScope: this,
            loop: true
        });




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



    }

    update() {
        this.player.update();

    }
}