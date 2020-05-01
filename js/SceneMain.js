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
        this.load.image('spr_plunderNum', 'img/plunderNum.png');

        this.load.audio('snd_bite', 'sound/bite.mp3');
        this.load.audio('snd_diverDie', 'sound/diverDie.mp3');
        this.load.audio('snd_plunder', 'sound/plunder.mp3');
    }

    create() {

        //this.game.oncontextmenu = function(e) {
        //    e.preventDefault();
        //}

        this.sfx = {
            bite: this.sound.add('snd_bite'),
            die: this.sound.add('snd_diverDie'),
            plunder: this.sound.add('snd_plunder')
        }

        // Creating animations
        this.anims.create({
            key: 'spr_playerIdle',
            frames: this.anims.generateFrameNumbers('spr_player', {start:0, end:1}),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: 'spr_playerSwim',
            frames: this.anims.generateFrameNumbers('spr_player', {start:2, end:3}),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'spr_playerBite',
            frames: this.anims.generateFrameNumbers('spr_player', {start:4, end:5}),
            frameRate: 3
        });

        this.anims.create({
            key: 'spr_diverIdle',
            frames: [{key: 'spr_diver', frame: 0}],
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'spr_diverWalk',
            frames: this.anims.generateFrameNumbers('spr_diver', {start:0, end:1}),
            frameRate: 3,
            repeat: -1
        });
        this.anims.create({
            key: 'spr_diverHurt',
            frames: [{key: 'spr_diver', frame: 2}],
            frameRate: 2
        });
        this.anims.create({
            key: 'spr_diverPlunder',
            frames: [{key: 'spr_diver', frame: 3}],
            frameRate: 5
        });
        this.anims.create({
            key: 'spr_diverDie',
            frames: this.anims.generateFrameNumbers('spr_diver', {start:4, end:8}),
            frameRate: 10
        });




        // Groups for entities
        this.divers = this.add.group();
        this.plunderNums = this.add.group();


        this.background = this.add.sprite(this.game.config.width/2, this.game.config.height/2, 'spr_background');

        this.ground = this.physics.add.staticGroup();
        this.ground.create(this.game.config.width/2, this.game.config.height-25, 'spr_ground');

        this.chest = new Chest(this, this.game.config.width/2, this.game.config.height-55, 'spr_chest');
        this.player = new Player(this, this.game.config.width/2, this.game.config.height/2, 'spr_player');


        // Adding diver and ground collisions
        this.physics.add.collider(this.divers, this.ground, function(diver, ground) {
            if (diver.moving == false) {
                diver.startMoving();
            }
        });

        // Player eatting divers
        this.physics.add.overlap(this.player, this.divers, function(player, diver) {
            if (!player.canBite && !player.bitten && !diver.dead) {
                player.eatDiver(diver);
            }
        });

        // Diver reaching chest
        this.physics.add.overlap(this.divers, this.chest, function(diver, chest) {
            if (diver.moving == true) {
                diver.stopMoving();
            }
            if (diver.plundering == false && diver.plunderTimer == 0) {
                diver.plunder(chest);
            }
        });


        // Mouse inputs
        this.input.on('pointerup', function(pointer) {
            console.log('up');
            this.player.stopMove();
        }, this);



        // Display FPS
        this.fps = this.add.text(5, 5, -1);

        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);

        this.testNum = 0;
        this.test = this.add.text(50, 50, -1);

        this.spawnDiverTimer = 60;
    }

    update() {

        // Timer to spawn divers
        if (this.spawnDiverTimer > 0) {
            this.spawnDiverTimer--;
            if (this.spawnDiverTimer == 0) {
                var spawnBuffer = 20;
                var diver = new Diver(this, (Math.random() <= 0.5) ? spawnBuffer : this.game.config.width-spawnBuffer, 100, 'spr_diver');
                this.divers.add(diver);  

                this.spawnDiverTimer = (2*60 + Math.round(4*60 * Math.random()));           
            }
        }




        // Update entities
        this.player.update();
        this.chest.update();
        for (var i = 0; i < this.divers.getChildren().length; i++) {
            this.divers.getChildren()[i].update();
        }
        for (var i = 0; i < this.plunderNums.getChildren().length; i++) {
            this.plunderNums.getChildren()[i].update();
        }


        // ========================
        // Detecting input
        // ========================

        // Clicking to move
        var mouse = this.input.activePointer
        if (mouse.isDown) {
            this.player.moveTo(Math.round(mouse.x), Math.round(mouse.y));
        }

        // Pressing Q to bite
        if (this.keyQ.isDown) {
            console.log("pressed Q");
            if (this.player.canBite) {
                this.player.bite();  
            }
        }





        // Update text
        this.test.setText(this.testNum++);
        this.fps.setText(Math.round(this.game.loop.actualFps));
    }
}