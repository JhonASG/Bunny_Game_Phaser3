import { AnimationsPlayer } from "./animations/animsPlayer.js";
import { drawPlayers, drawCarrots } from "./config/configDrawObjs.js";
import { Movement } from "./controller/movementPlayer.js";
import { drawingObjs } from "./drawer/drawObjs.js";

let rabbit = [];
let carrots = [];
let groupsStars = 1;
let playerQuantity = 2;
let goUpP1 = false;
let goDownP1 = false;
let goUpP2 = false;
let goDownP2 = false;
let stateAddMovement = true;
let stateAddMovementDown = true;
let stateAddMovementP2 = true;
let stateAddMovementDownP2 = true;
let preTimeText = "";
let groupLeftVehicles = "";
let groupRightVehicles = "";
const arrayTypeVehicles = ["cars1", "cars2", "bigvehicles", "motorcycles"]; // Array contain types of vehicles
const arrayCurrentTypeVehicles = ["cars1", "cars2", "bigvehicles", "motorcycles"]; // Array contain current types of vehicles

class MainScene extends Phaser.Scene {
    constructor() {
        super("gameScene");
    }
    preload () {
        this.load.image("gameTiles", "../img/tilemap.png");
        this.load.image("carrot", "../img/carrot.png");
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
        );
        rabbit = playerGame.createPlayer(this.physics, playerQuantity);
        rabbit[0].score = 0;

        if ( playerQuantity == 2 ) {
            rabbit[1].score = 0;
        }

        const carrotsGame = new drawingObjs(
            drawCarrots,
            map
        );
        carrots = carrotsGame.createCarrots(this.physics, groupsStars);

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

        this.physics.add.overlap(rabbit[0], carrots, collectCarrots, null, this);

        function addScorePlayers (instance, player, bgRectangle, colorTxt, posRectX, posRectY, posTxtX, posTxtY, currentTime) {
            instance.add.rectangle(posRectX, posRectY, 100, 40, bgRectangle);

            if ( player == "" && currentTime != "" ) {
                instance.resultTXT = instance.add.text(posTxtX, posTxtY, preTimeText+currentTime, {
                    fontFamily: "font1",
                    fontSize: 24,
                    color: colorTxt
                });
            } else {
                instance.resultTXT = instance.add.text(posTxtX, posTxtY, player.score, {
                    fontFamily: "font1",
                    fontSize: 24,
                    color: colorTxt
                });
            }

            return instance.resultTXT;
        }

        const scorePlayer = addScorePlayers (this, rabbit[0], 0x0000ff, "white", 200, 625, 195, 615, "");
        
        function collectCarrots ( player, carrot ) {
            rabbit[0].score += 10;
            colliderCarrots(carrot, player, 200);
            scorePlayer.setText(rabbit[0].score);
        }

        if ( playerQuantity == 2 ) {
            this.physics.add.overlap(rabbit[1], carrots, collectCarrots2, null, this);
            const scorePlayer = addScorePlayers (this, rabbit[1], 0xff0000, "white", 500, 625, 495, 615, "");
    
            function collectCarrots2 ( player, carrot ) {
                rabbit[1].score += 10;
                colliderCarrots(carrot, player, 500);
                scorePlayer.setText(rabbit[1].score);
            }
        }

        function colliderCarrots ( carrot, player, posX ) {
            carrot.disableBody(true, true);

            if ( player.y ==  65 ) {
                carrot.enableBody(true, posX, 570, true, true);
            } else {
                carrot.enableBody(true, posX, 65, true, true);
            }
        }

        this.currentTime = 60;
        const timeGame = addScorePlayers (this, "", 0x000000, "yellow", 350, 625, 325, 615, this.currentTime);
        this.txtTime = timeGame;
        this.updateTime();

        //Creación de grupos respecto a la dirección de movimiento de los vehiculos
        groupLeftVehicles = this.physics.add.group();
        groupRightVehicles = this.physics.add.group();

        //We add to every group its vehicles
        const vehiclesType1 = groupLeftVehicles.create(
            -100,
            165,
            this.randomCar(0),
            this.randomSpriteCar(0)
        )
        this.randomVelocity( 0, vehiclesType1, 1 ); //Velocity movement of vehicle

        const vehiclesType2 = groupLeftVehicles.create(
            -100,
            265,
            this.randomCar(1),
            this.randomSpriteCar(1)
        )
        this.randomVelocity( 1, vehiclesType2, 1 ); //Velocity movement of vehicle

        const vehiclesType3 = groupRightVehicles.create(
            900,
            385,
            this.randomCar(2),
            this.randomSpriteCar(2)
        )
        this.randomVelocity( 2, vehiclesType3, -1 ); //Velocity movement of vehicle
        vehiclesType3.flipX = true;

        const vehiclesType4 = groupRightVehicles.create(
            900,
            485,
            this.randomCar(3),
            this.randomSpriteCar(3)
        )
        this.randomVelocity( 3, vehiclesType4, -1 ); //Velocity movement of vehicle
        vehiclesType4.flipX = true;

        //Create the limits of movemente every vehicle
        const limit1 = this.add.rectangle(900, 325, 25, 480, 0x000000);
        this.physics.add.existing(limit1); //Add physics object
        this.physics.add.collider(groupLeftVehicles, limit1, this.newLeftCar, null, this); //Indentify the collision
        limit1.body.setImmovable(true); //This limit is immovable

        const limit2 = this.add.rectangle(-100, 325, 25, 480, 0x000000);
        this.physics.add.existing(limit2); //Add physics
        this.physics.add.collider(groupRightVehicles, limit2, this.newRightCar, null, this); //Indentify the collision
        limit2.body.setImmovable(true); //This limit is immovable

        //Add collision between vehicle and rabbits
        this.physics.add.overlap(rabbit[0], groupRightVehicles, collisionRightCars, null, this);
        this.physics.add.overlap(rabbit[0], groupLeftVehicles, collisionLeftCars, null, this);
        
    }

    newRightCar ( limit, element ) {
        element.destroy(); //Remove

        //Create new vehicle Right
        const vehicleType = element.y == 385 ? 2 : 3;
        const currentVehicle = groupRightVehicles.create(
            900,
            element.y,
            this.randomCar(vehicleType),
            this.randomSpriteCar(vehicleType)
        )
        this.randomVelocity( vehicleType, currentVehicle, -1 );
        currentVehicle.flipX = true;
    }

    newLeftCar (limit, element) {
        element.destroy(); //Remove vehicle what collision with the limit

        //Create new vehicle Left
        const vehicleType = element.y == 165 ? 0 : 1;
        const currentVehicle = groupLeftVehicles.create(
            -100,
            element.y,
            this.randomCar(vehicleType),
            this.randomSpriteCar(vehicleType)
        )
        this.randomVelocity( vehicleType, currentVehicle, 1 );
    }
    
    randomVelocity ( vehicleType, element, direction ) {
        const vehicle = arrayCurrentTypeVehicles[vehicleType];

        switch(vehicle) {
            case "cars1":
                element.setVelocityX( ( Math.random() * 220 + 160 ) * direction );
            break;
            case "cars2":
                element.setVelocityX( ( Math.random() * 300 + 220 ) * direction );
            break;
            case "bigvehicles":
                element.setVelocityX( ( Math.random() * 200 + 100 ) * direction );
            break;
            case "motorcycles":
                element.setVelocityX( ( Math.random() * 375 + 300 ) * direction );
            break;
        }
    }

    randomSpriteCar ( vehicleType ) {
        const vehicle = arrayCurrentTypeVehicles[vehicleType];
        
        switch(vehicle) {
            case "cars1":
                return Math.floor(Math.random() * 9);
            break;
            case "cars2":
                return Math.floor(Math.random() * 23);
            break;
            case "bigvehicles":
                return Math.floor(Math.random() * 7);
            break;
            case "motorcycles":
                return Math.floor(Math.random() * 3);
            break;
        }
    }

    randomCar ( vehicleType ) {
        arrayCurrentTypeVehicles[vehicleType] = arrayTypeVehicles[Math.floor(Math.random() * arrayTypeVehicles.length)]
        return arrayCurrentTypeVehicles[vehicleType];
    }

    updateTime ( txtTime ) {
        this.currentTime--;

        const txtPreviewTime = this.currentTime < 10 ? "00:0" : "00:";
        preTimeText = txtPreviewTime;

        this.txtTime.setText(preTimeText+this.currentTime);

        if (this.currentTime == 0) {
            this.physics.pause();

            this.time.addEvent({
                delay: 1500,
                loop: false,
                callback: () => {
                    this.scene.start("endScene");
                }
            });
        } else {
            this.time.delayedCall(1000, this.updateTime, [], this);
        }
    }
    update () {
        let cursors = this.input.keyboard.createCursorKeys();
        const movementPlayer = new Movement(
            rabbit[0],
            cursors.up,
            cursors.down,
            ["Up", "Down"],
            goUpP1,
            goDownP1,
            1
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

        if ( playerQuantity == 2 ) {
            let keyObjUp = this.input.keyboard.addKey("W");
            let keyObjDown = this.input.keyboard.addKey("S");

            const movementPlayer = new Movement (
                rabbit[1],
                keyObjUp,
                keyObjDown,
                ["Up", "Down"],
                goUpP2,
                goDownP2,
                2
            );

            if (keyObjUp.isDown) {
                if (stateAddMovementP2)
                {
                    stateAddMovementP2 = false;
                    movementPlayer.AddMovementPlayer();
                }
            } else if (keyObjDown.isDown) {
                if (stateAddMovementDownP2)
                {
                    stateAddMovementDownP2 = false;
                    movementPlayer.AddMovementPlayer();
                }
            }

            if (keyObjUp.isUp) {
                stateAddMovementP2 = true;
            }
            if (keyObjDown.isUp) {
                stateAddMovementDownP2 = true;
            }
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
        arcade: {
            debug: false,
        }
    }
}
new Phaser.Game(config);