class SceneGameOver extends Phaser.Scene {
    constructor() {
        super({ key: 'SceneGameOver' });
    }

    preload() {

    }

    create() {
        this.text = this.add.text(100, 100, "YOU LOST YOUR HOME :(");
    }

    update() {

    }

}