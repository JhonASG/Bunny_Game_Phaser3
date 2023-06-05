import { AnimationsPlayer } from "./animations/animsPlayer.js";
import { drawPlayers } from "./config/configDrawObjs.js";
import { Movement } from "./controller/movementPlayer.js";
import { drawingObjs } from "./drawer/drawObjs.js";

let rabbit = [];
let playerQuantity = 1;
let goUpP1 = false;
let goDownP1 = false;
let stateAddMovement = true;
let stateAddMovementDown = true;

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
        const tileset = map.addTilesetImage("Tilemap", "gameTiles");
        
        map.createLayer("Grass", tileset);
        map.createLayer("YellowLines", tileset);
        map.createLayer("GrayZone", tileset);
        map.createLayer("WhiteLines", tileset);

        const playerGame = new drawingObjs(
            drawPlayers,
            map
        )
        rabbit = playerGame.createPlayer(this.physics, playerQuantity);
        rabbit[0].score = 0;

        const animsRabbit = new AnimationsPlayer(
            ["Up", "Down"],
            "rabbit",
            this.anims,
            [
                [24, 31],
                [8, 15]
            ],
            10,
            0
        )
        animsRabbit.CreateAnimationsPlayer();
    }
    update () {
        let cursors = this.input.keyboard.createCursorKeys();
        const movementPlayer = new Movement(
            rabbit[0],
            cursors.up,
            cursors.down,
            ["Up", "Down"],
            goUpP1,
            goDownP1
        )
        
        if (cursors.up.isDown) {
            if (stateAddMovement)
            {
                stateAddMovement = false;
                movementPlayer.AddMovementPlayer();
            }
        } else if (cursors.down.isDown) {
            if (stateAddMovementDown)
            {
                stateAddMovementDown = false;
                movementPlayer.AddMovementPlayer();
            }
        }

        if (cursors.up.isUp) {
            stateAddMovement = true;
        }
        if (cursors.down.isUp) {
            stateAddMovementDown = true;
        }
    }
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
    }
}
new Phaser.Game(config);