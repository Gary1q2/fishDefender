var config = {
    type: Phaser.WEBGL,
    width: 400,
    height: 200,
    backgroundColour: 'black',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 }
        }
    },
    scene: [
        SceneMain
    ],
    zoom: 4,
    pixelArt: true,
    roundPixels: true
};

var game = new Phaser.Game(config);