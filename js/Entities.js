class Entity extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key, type) {
        super(scene, x, y, key);

        this.scene = scene;
        this.scene.add.existing(this);
    }
}

class Player extends Entity {
    constructor(scene, x, y, key) {
        super(scene, x, y, key, 'player');

        this.setData('targetX', -1);
        this.setData('targetY', -1);
        this.setData('targetAngle', -1);
        this.setData('speed', 1);
    }

    setTargetDest(destX, destY) {
        this.setData('targetX', destX);
        this.setData('targetY', destY);

        let yDist = Math.abs(this.getData('targetY') - this.y);
        let xDist = Math.abs(this.getData('targetX') - this.x);
        let targetAngle = Math.atan(yDist/xDist);
        this.setData('targetAngle', targetAngle);


        console.log("target angle = " + this.getData('targetAngle'));
        console.log('set target @' + destX+','+destY);
        console.log("x moving = " + this.getData('speed') * Math.cos(targetAngle));
        console.log("y moving = " + this.getData('speed') * Math.sin(targetAngle));
    }


    move() {
        let xMove = this.getData('speed') * Math.cos(this.getData('targetAngle'))
        let yMove = this.getData('speed') * Math.sin(this.getData('targetAngle'))

        // Move to destination
        if (this.getData('targetX') != -1 && this.getData('targetY') != -1) {

            // Move x position
            if (Math.abs(this.getData('targetX') - this.x) > xMove) {
                if (this.x < this.getData('targetX')) {
                    this.x += xMove;
                } else if (this.x > this.getData('targetX')) {
                    this.x -= xMove;
                }
            } else {
                this.x = this.getData('targetX');
            }

            // Move y position
            if (Math.abs(this.getData('targetY') - this.y) > yMove) {
                if (this.y < this.getData('targetY')) {
                    this.y += yMove;
                } else if (this.y > this.getData('targetY')) {
                    this.y -= yMove;
                }
            } else {
                this.y = this.getData('targetY');
            }

        // Reached destination
        } else {
            this.setData('targetX', -1);
            this.setData('targetY', -1);
        }
    }



    update() {

        this.move();
        
    }
}