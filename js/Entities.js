class Entity extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key, type) {
        super(scene, x, y, key);

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this, 0)
    }
}


class Diver extends Entity {
    constructor(scene, x, y, key) {
        super(scene, x, y, key, 'diver');

        this.play('spr_diverIdle');
        this.body.setGravityY(20);

        this.speed = 0.25 * 60;

        this.dead = false;

        this.moving = false;
    }


    die() {
        this.dead = true;
        this.body.setVelocityX(0);
        this.play('spr_diverDie');
        this.scene.sfx.die.play();
        this.once('animationcomplete', function() {
            this.destroy();
        });   
    }

    // Start moving diver
    startMoving() {
        this.moving = true;

        if (this.x < this.scene.game.config.width/2) {
            this.body.setVelocityX(this.speed);
        } else {
            this.body.setVelocityX(-this.speed);
            this.flipX = true;
        }
    }
}



class BiteCollision extends Entity {
    constructor(scene, x, y, key, player) {
        super(scene, x, y, key);
        this.owner = player;

    }

    update() {
        this.x = player.x;
        this.y = player.y;
    }
}


class Player extends Entity {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);

        this.targetX = -1;
        this.targetY = -1;
        this.speed = 60;

        this.stopBuffer = 1;


        this.canBite = true;
        this.bitten = false;

        this.play('spr_playerIdle');
    }

    // Player ate a diver
    eatDiver(diver) {
        this.bitten = true;
        diver.die();
    }

    // Make fish bite
    bite() {
        if (this.canBite) {
            this.canBite = false;
            this.play('spr_playerBite');
            this.scene.sfx.bite.play();

            this.once('animationcomplete', function() {
                this.canBite = true;
                this.bitten = false;
                this.play('spr_playerIdle');
            });       
        }
    }


    // Stop player moving
    stopMove() {
        this.targetX = -1;
        this.targetY = -1;
        this.body.setVelocity(0, 0);
    }


    // Move to target destination
    moveTo(destX, destY) {
        this.targetX = destX;
        this.targetY = destY;

        // Point fish in the right direction
        /*if (destX <= this.x) {
            this.flipX = true;
        } else {
            this.flipX = false;
        }*/

        // Make fish move to destination
        var distX = this.targetX - this.x;
        var distY = this.targetY - this.y;
        var angle = Math.atan2(distY, distX);
        this.body.setVelocity(this.speed * Math.cos(angle), this.speed * Math.sin(angle));
        this.angle = Phaser.Math.Angle.Between(this.x, this.y, this.targetX, this.targetY) * 180/Math.PI;
    }

    update() {
        
        // Stop fish once it reaches destination
        //while ((Math.abs(this.targetX - this.x) < this.stopBuffer) && (Math.abs(this.targetY - this.y) < this.stopBuffer)) {
        //    this.targetX = -1;
        //    this.targetY = -1;
        //    this.body.setVelocity(0, 0);
        //}
    }
}