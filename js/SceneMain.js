class SceneMain extends Phaser.Scene {
    constructor() {
        super({ key: 'SceneMain' });
    }

    preload() {
        this.load.spritesheet('spr_player', 'img/player.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet('spr_diver', 'img/diver.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.image('spr_chest', 'img/chest.png');
        this.load.image('spr_background', 'img/background.png');
        this.load.image('spr_ground', 'img/ground.png');

        this.load.audio('snd_bite', 'sound/bite.mp3');
    }

    create() {

        this.sfx = {
            bite: this.sound.add('snd_bite')
        }

        // Creating animations
        this.anims.create({
            key: 'spr_playerIdle',
            frames: this.anims.generateFrameNumbers('spr_player', {start:0, end:1}),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: 'spr_playerBite',
            frames: this.anims.generateFrameNumbers('spr_player', {start:2, end:3}),
            frameRate: 3
        });
        this.anims.create({
            key: 'spr_diverIdle',
            frames: [{key: 'spr_diver', frame: 0}],
            frameRate: 5
        });
        this.anims.create({
            key: 'spr_diverDie',
            frames: this.anims.generateFrameNumbers('spr_diver', {start:1, end:5}),
            frameRate: 3
        });




        // Groups for entities
        this.divers = this.add.group();

        this.background = this.add.sprite(this.game.config.width/2, this.game.config.height/2, 'spr_background');

        this.ground = this.physics.add.staticGroup();
        this.ground.create(this.game.config.width/2, this.game.config.height-25, 'spr_ground');

        this.chest = this.add.sprite(this.game.config.width/2, this.game.config.height-55, 'spr_chest');
        this.player = new Player(this, this.game.config.width/2, this.game.config.height/2, 'spr_player');


        // Adding diver and ground collisions
        this.physics.add.collider(this.divers, this.ground, function(diver, ground) {
            diver.startMoving();
        });

        // Player eatting divers
        this.physics.add.overlap(this.player, this.divers, function(player, diver) {
            if (!player.canBite && !player.bitten) {
                player.eatDiver(diver);
            }
        });



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
        this.input.on('pointerup', function(pointer) {
            console.log('up');
            this.player.stopMove();
        }, this);



        // Display FPS
        this.fps = this.add.text(5, 5, this.game.loop.actualFps);

        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);

    }

    update() {
        this.player.update();

        // Detect mouse click
        var mouse = this.input.activePointer
        if (mouse.isDown) {
            this.player.moveTo(Math.round(mouse.x), Math.round(mouse.y));
        }

        // Detect Q key pressed
        if (this.keyQ.isDown) {
            console.log("pressed Q");
            this.player.bite();
        }
    }
}