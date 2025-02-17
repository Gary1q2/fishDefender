class Entity extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key, type) {
        super(scene, x, y, key);

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this, 0)
    }
}

class PlunderNum extends Entity {
    constructor(scene, x, y, key, text) {
        super(scene, x, y, key);

        this.liveTimer = 100;
        this.body.setVelocityY(-50);
    }

    update() {
        this.liveTimer--;
        if (this.liveTimer <= 0) {
            this.destroy();
        }
    }
}


class Chest extends Entity {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);
        this.money = 100;

        this.displayMoney = this.scene.add.text(this.x, this.y-20, this.money);
    }

    update() {

        this.displayMoney.setText(this.money);

        if (this.money <= 0) {
            this.scene.scene.start("SceneGameOver");
            this.destroy();
        }
    }

}

class Diver extends Entity {
    constructor(scene, x, y, key) {
        super(scene, x, y, key, 'diver');

        this.play('spr_diverIdle');
        this.body.setGravityY(70);

        this.speed = 0.25 * 60;

        this.dead = false;

        this.moving = false;

        this.hp = 20;


        this.plundering = false;

        this.plunderTimer = 0;
        this.plunderTime = 60;

        this.plunderValue = 2;
    }

    // Diving taking the chest money
    plunder(chest) {
        this.plundering = true;
        this.plunderTimer = this.plunderTime;
        chest.money -= this.plunderValue;
        this.scene.sfx.plunder.play();
        this.play('spr_diverPlunder');

        this.scene.plunderNums.add(new PlunderNum(this.scene, this.x, this.y, "spr_plunderNum"));

        this.once('animationcomplete', function() {
            if (this.moving == false) {
                this.play('spr_diverIdle');
            } else {
                this.play('spr_diverWalk');
            }
        });   
    }

    // Take damage
    takeDmg(dmg) {
        this.hp -= dmg;

        this.play('spr_diverHurt');
        this.once('animationcomplete', function() {
            if (this.moving == false) {
                this.play('spr_diverIdle');
            } else {
                this.play('spr_diverWalk');
            }
        });  
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

        this.play('spr_diverWalk');
        if (this.x < this.scene.game.config.width/2) {
            this.body.setVelocityX(this.speed);
        } else {
            this.body.setVelocityX(-this.speed);
            this.flipX = true;
        }
    }

    // Stop moving
    stopMoving() {
        this.moving = false;
        this.body.setVelocityX(0);
        this.play('spr_diverIdle');
    }

    update() {
        if (this.dead == false && this.hp <= 0) {
            this.die();
        }

        if (this.plunderTimer > 0) {
            this.plunderTimer--;
            if (this.plunderTimer == 0) {
                this.plundering = false;
            }
        }
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
        diver.takeDmg(5);
    }

    // Make fish bite
    bite() {
        this.canBite = false;
        this.play('spr_playerBite');
        this.scene.sfx.bite.play();

        this.once('animationcomplete', function() {
            this.canBite = true;
            this.bitten = false;
            this.play('spr_playerIdle');
        });       
    }


    // Stop player moving
    stopMove() {
        this.targetX = -1;
        this.targetY = -1;
        this.body.setVelocity(0, 0);
        this.play('spr_playerIdle');
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

        console.log(this);
        console.log(this.anims.currentAnim);
        if (this.anims.currentAnim.key != 'spr_playerSwim' && this.anims.currentAnim.key != 'spr_playerBite') {
            this.play('spr_playerSwim');
        }
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