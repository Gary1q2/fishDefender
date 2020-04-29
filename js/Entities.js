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

        this.body.setGravityY(20);


    }
}





class Player extends Entity {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);

        this.targetX = -1;
        this.targetY = -1;
        this.speed = 60;

        this.stopBuffer = 1;

        this.play('spr_player');
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
        console.log("angle = " + this.angle);
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