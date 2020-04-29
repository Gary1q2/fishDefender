class Entity extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key, type) {
        super(scene, x, y, key);

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this, 0)
    }
}

class Player extends Entity {
    constructor(scene, x, y, key) {
        super(scene, x, y, key, 'player');

        this.targetX = -1;
        this.targetY = -1;
        this.targetAngle = -1;
        this.speed = 60;
    }

    // Move to target destination
    moveTo(destX, destY) {
        this.targetX = destX;
        this.targetY = destY;

        if (destX <= this.x) {
            this.flipX = true;
        } else {
            this.flipX = false;
        }


        var distX = this.targetX - this.x;
        var distY = this.targetY - this.y;
        var angle = Math.atan2(distY, distX);

        this.body.setVelocity(this.speed * Math.cos(angle), this.speed * Math.sin(angle));
    }

    update() {
        
        // Check if destination reached
        while ((Math.abs(this.targetX - this.x) < 2) && (Math.abs(this.targetY - this.y) < 2)) {
            this.targetX = -1;
            this.targetY = -1;
            this.body.setVelocity(0, 0);
        }
    }
}