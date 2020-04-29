class SceneMain extends Phaser.Scene {
    constructor() {
        super({ key: "SceneMain" });
    }

    preload() {
        this.load.image("spr_player", "img/player.png");
        this.load.image("spr_diver", "img/diver.png");
        this.load.image("spr_chest", "img/chest.png");
    }

    create() {
        this.player = new Player(this, this.game.config.width/2, this.game.config.height/2, "spr_player");
    }

    update() {

    }
}