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

        this.setData('targetX', -1);
        this.setData('targetY', -1);
        this.setData('targetAngle', -1);
        this.setData('speed', 50);
    }


    setTargetDest(destX, destY) {
        this.setData('targetX', destX);
        this.setData('targetY', destY);

        var distX = this.getData('targetX') - this.x;
        var distY = this.getData('targetY') - this.y;
        var angle = Math.atan2(distY, distX);

        this.body.setVelocity(this.getData('speed') * Math.cos(angle), this.getData('speed') * Math.sin(angle));

    }

    update() {
        
        // Check if destination reached
        while ((Math.abs(this.getData('targetX') - this.x) < 10) && (Math.abs(this.getData('targetY') - this.y) < 10)) {
            this.body.setVelocity(0, 0);
            this.setData('targetX', -1);
            this.setData('targetY', -1);
        }
    }
}