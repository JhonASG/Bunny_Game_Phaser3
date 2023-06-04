class MainScene extends Phaser.Scene {
    constructor() {
        super("gameScene");
    }
    preload () {
        this.load.image("gameTiles", "../img/tilemap.png");
        this.load.tilemapTiledJSON("tilemap", "../img/tilemap_bunnygame.json");
        this.load.spritesheet("cars1", "../img/cars.png", {
            frameWidth: 140,
            frameHeight: 70
        });
        this.load.spritesheet("cars2", "../img/cars2.png", {
            frameWidth: 150,
            frameHeight: 90
        });
        this.load.spritesheet("bigvehicles", "../img/bigvehicles.png", {
            frameWidth: 250,
            frameHeight: 100
        });
        this.load.spritesheet("motorcycles", "../img/motorcycle.png", {
            frameWidth: 158,
            frameHeight: 62.5
        });
        this.load.spritesheet("rabbit", "../img/rabbits.png", {
            frameWidth: 40,
            frameHeight: 40
        });
    }
    create () {
        const map = this.add.tilemap("tilemap");
        const tileset = map.add
    }
    update () {}
}
class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    preload () {}
    create () {}
    update () {}
}
class Level extends Phaser.Scene {
    constructor() {
        super("levelScene");
    }
    preload () {}
    create () {}
    update () {}
}
class Mode extends Phaser.Scene {
    constructor() {
        super("modeScene");
    }
    preload () {}
    create () {}
    update () {}
}
class Controls extends Phaser.Scene {
    constructor() {
        super("controlsScene");
    }
    preload () {}
    create () {}
    update () {}
}
class EndGame extends Phaser.Scene {
    constructor() {
        super("endScene");
    }
    preload () {}
    create () {}
    update () {}
}
const config = {
    type: Phaser.AUTO,
    width: 768,
    height: 672,
    scene: [
        MainScene,
        Menu,
        Level,
        Mode,
        Controls,
        EndGame,
    ],
    scale: {
        mode: Phaser.Scale.FIT
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 300 }
        }
    }
}
new Phaser.Game(config);