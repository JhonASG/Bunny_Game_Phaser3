import { AnimationsPlayer } from "./animations/animsPlayer.js";
import { drawPlayers, drawCarrots } from "./config/configDrawObjs.js";
import { Movement } from "./controller/movementPlayer.js";
import { drawingObjs } from "./drawer/drawObjs.js";

let rabbit = [];
let carrots = [];
let groupsStars = 1;
let playerQuantity = 1;
let level = 1;
let levelName = "Easy";
let modeName = "1 Player";
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
let musicPlay = true;

class MainScene extends Phaser.Scene {
    constructor() {
        super("gameScene");
    }
    preload () {}
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
        rabbit[0].name = "Bunny";
        rabbit[0].score = 0;
        rabbit[0].direction = "up";
        rabbit[0].death = 0;

        if ( playerQuantity == 2 ) {
            rabbit[1].name = "Banny";
            rabbit[1].score = 0;
            rabbit[1].direction = "up";
            rabbit[1].death = 0;
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
            colliderCarrots(carrot, player, 200, this);
            scorePlayer.setText(rabbit[0].score);
        }

        if ( playerQuantity == 2 ) {
            this.physics.add.overlap(rabbit[1], carrots, collectCarrots2, null, this);
            const scorePlayer = addScorePlayers (this, rabbit[1], 0xff0000, "white", 500, 625, 495, 615, "");
    
            function collectCarrots2 ( player, carrot ) {
                rabbit[1].score += 10;
                colliderCarrots(carrot, player, 500, this);
                scorePlayer.setText(rabbit[1].score);
            }
        }

        function colliderCarrots ( carrot, player, posX, context ) {
            const musicCarrot = context.sound.add("goal");
            musicCarrot.play({
                volume: 0.75,
                loop: false,
            });
            carrot.disableBody(true, true);

            if ( player.y ==  65 ) {
                player.direction = "down";
                carrot.enableBody(true, posX, 570, true, true);
            } else {
                player.direction = "up";
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
        this.physics.add.overlap(groupRightVehicles, rabbit[0], this.playerCollider, null, this);
        this.physics.add.overlap(groupLeftVehicles, rabbit[0], this.playerCollider, null, this);
        
        if (playerQuantity == 2) {
            this.physics.add.overlap(groupRightVehicles, rabbit[1], this.playerCollider, null, this);
            this.physics.add.overlap(groupLeftVehicles, rabbit[1], this.playerCollider, null, this);
        }

        //Add controls in screen tactils
        if ( screen.width <= 900 ) {
            this.add.image(50, 50, "arrow").setScale(0.5);
            this.add.image(50, 575, "arrow").setScale(0.5).setFlip(true, true);

            this.createZoneActionBtns("UpP1", 25, 25, 50, 50);
            this.createZoneActionBtns("DownP1", 25, 550, 50, 50);
            if ( playerQuantity == 2 ) {
                this.add.image(650, 50, "arrow").setScale(0.5);
                this.add.image(650, 575, "arrow").setScale(0.5).setFlip(true, true);
                
                this.createZoneActionBtns("UpP2", 625, 25, 50, 50);
                this.createZoneActionBtns("DownP2", 625, 550, 50, 50);
            }
        }
    }

    createZoneActionBtns (btnName, posX, posY, width, height) {
        const btn = this.add.zone(posX, posY, width, height);
        btn.setOrigin(0, 0);
        btn.setInteractive();
        btn.on("pointerdown", () => this.actionMovementWithBtns(btnName, true));
        btn.on("pointerup", () => this.actionMovementWithBtns(btnName, false));
        btn.on("pointermove", () => this.actionMovementWithBtns(btnName, false));

        //this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(btn);
    }

    actionMovementWithBtns (btn, stateBtn) {
        switch(btn) {
            case "UpP1":
                goUpP1 = stateBtn;
            break;
            case "DownP1":
                goDownP1 = stateBtn;
            break;
            case "UpP2":
                goUpP2 = stateBtn;
            break;
            case "DownP2":
                goDownP2 = stateBtn;
            break;
            default:
                goUpP1 = false;
                goDownP1 = false;
                goUpP2 = false;
                goDownP2 = false;
            break;
        }
    }

    playerCollider (player, vehicle) {
        if (player.y == vehicle.y) {
            const musicCrash = this.sound.add("crash");
            musicCrash.play({
                volume: 0.5,
                loop: false,
            });

            player.death++;
            if (player.direction == "up") {
                if (rabbit[0] === player) {
                    const updatePosPlayer = new Movement(player, null, null, null, null, null, 1);
                    updatePosPlayer.UpdatePositionPlayerWhenDead( 0, 1 );
                } else if (rabbit[1] === player) {
                    const updatePosPlayer = new Movement(player, null, null, null, null, null, 2);
                    updatePosPlayer.UpdatePositionPlayerWhenDead( 0, 2 );
                }
                player.y = 570;
            } else {
                if (rabbit[0] === player) {
                    const updatePosPlayer = new Movement(player, null, null, null, null, null, 1);
                    updatePosPlayer.UpdatePositionPlayerWhenDead( updatePosPlayer.posibleMovesPlayer.length - 1, 1 );
                } else if (rabbit[1] === player) {
                    const updatePosPlayer = new Movement(player, null, null, null, null, null, 2);
                    updatePosPlayer.UpdatePositionPlayerWhenDead( updatePosPlayer.posibleMovesPlayer.length - 1, 2 );
                }
                player.y = 65;
            }
        }
    }

    newRightCar ( limit, element ) {
        element.destroy(); //Remove

        //Create new vehicle Right
        const vehicleType = element.y == 385 ? 2 : 3;
        const currentVehicle = groupRightVehicles.create(
            1000,
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
            -200,
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
                element.setVelocityX( ( Math.random() * 220 + 160 ) * direction * level );
            break;
            case "cars2":
                element.setVelocityX( ( Math.random() * 300 + 220 ) * direction * level );
            break;
            case "bigvehicles":
                element.setVelocityX( ( Math.random() * 200 + 100 ) * direction * level );
            break;
            case "motorcycles":
                element.setVelocityX( ( Math.random() * 375 + 300 ) * direction * level );
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
        
        if (cursors.up.isDown || goUpP1) {
            if (stateAddMovement)
            {
                stateAddMovement = false;
                goUpP1 = false;
                movementPlayer.AddMovementPlayer();
            }
        } else if (cursors.down.isDown || goDownP1) {
            if (stateAddMovementDown)
            {
                stateAddMovementDown = false;
                goDownP1 = false;
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

            if (keyObjUp.isDown || goUpP2) {
                if (stateAddMovementP2)
                {
                    stateAddMovementP2 = false;
                    goUpP2 = false;
                    movementPlayer.AddMovementPlayer();
                }
            } else if (keyObjDown.isDown || goDownP2) {
                if (stateAddMovementDownP2)
                {
                    stateAddMovementDownP2 = false;
                    goDownP2 = false;
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
    preload () {
        // Progress Bar
        this.barPreLoadAssets();

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
        this.load.image("bg", "../img/background.jpg");
        this.load.image("logo", "../img/BunnyGame.png");
        this.load.image("faceRabbit", "../img/faceRabbit.png");
        this.load.image("menuButtons", "../img/menuButtons.png");
        this.load.image("levelButtons", "../img/levelButtons.png");
        this.load.image("modeButtons", "../img/modeButtons.png");
        this.load.image("controlsP1", "../img/Player1.png");
        this.load.image("controlsP2", "../img/Player2.png");
        this.load.image("arrow", "../img/arrow.png");
        this.load.audio("music", "../sounds/FranticLevel.wav"); //
        this.load.audio("goal", "../sounds/Rise06.mp3");
        this.load.audio("crash", "../sounds/bzzzt.wav");
    }

    create () {
        if ( musicPlay ) {
            musicPlay = false;

            const music = this.sound.add("music");
            music.play({
                volume: 0.5,
                loop: true,
            });
        }

        // Drawing the images preload on the canvas
        this.add.image(420, 320, "bg").setScale(2);
        this.add.image(400, 80, "logo");
        this.add.image(180, 450, "faceRabbit");
        this.add.image(530, 420, "menuButtons");

        // Create the zone for clicking the buttons in the scene
        this.createZoneActionBtns( "gameScene", 435, 235, 190, 80 );
        this.createZoneActionBtns( "levelScene", 435, 335, 190, 80 );
        this.createZoneActionBtns( "modeScene", 435, 432, 190, 80 );
        this.createZoneActionBtns( "controlsScene", 435, 530, 190, 80 );
        this.addInfoPlayer("Level: ", levelName, 70, 200);
        this.addInfoPlayer("Mode: ", modeName, 70, 240);
    }

    barPreLoadAssets () {
        let progressBar = this.add.graphics();
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const loadingTxt = this.add.text(
            (width / 2) -50,
            (height / 2) - 20,
            "Loading...",
            { 
                font: "bold 32px monospace", 
                fill: "#ffffff", 
                align: "center" 
            }
        );
        const percentTxt = this.add.text(
            width / 2,
            (height / 2) -180,
            "0%",
            { 
                font: "28px monospace", 
                fill: "#ffffff", 
                align: "center" 
            }
        );
        const assetTxt = this.add.text(
            (width / 2)-150,
            (height / 2) -100,
            "",
            { 
                font: "28px monospace", 
                fill: "#ffffff", 
                align: "center" 
            }
        );

        this.load.on("progress", function (value) {
            percentTxt.setText(parseInt(value * 100) + "%");
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });

        this.load.on("fileprogress", function (file) {
            assetTxt.setText("Loading asset: " + file.key);
        });

        this.load.on("complete", function () {
            progressBar.destroy();
            loadingTxt.destroy();
            assetTxt.destroy();
            percentTxt.destroy();
        });
    }

    createZoneActionBtns (scene, posX, posY, width, height) {
        const btn = this.add.zone(posX, posY, width, height);
        btn.setOrigin(0, 0);
        btn.setInteractive();
        btn.once("pointerdown", () => this.redirectScene(scene));
        // this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(btn);
    }

    addInfoPlayer(title, info, posX, posY) {
        this.add.text(posX, posY, title + info, {
            fontSize: 30,
            fontStyle: "bold",
            fill: "#000000"
        });
    }

    redirectScene(scene) {
        this.scene.start(scene);
    }
}
class Level extends Phaser.Scene {
    constructor() {
        super("levelScene");
    }
    preload () {}
    create () {
        // Drawing the images preload on the canvas.
        this.add.image(420, 320, "bg").setScale(2);
        this.add.image(400, 80, "logo");
        this.add.image(180, 450, "faceRabbit");
        this.add.image(530, 420, "levelButtons");

        // Create the zone for clicking the buttons in the scene.
        this.createZoneActionBtns( 1, "Easy", 435, 235, 190, 80 );
        this.createZoneActionBtns( 2, "Medium", 435, 335, 190, 80 );
        this.createZoneActionBtns( 3, "Hard", 435, 432, 190, 80 );
        this.createZoneActionBtns( 0, "Back", 435, 530, 190, 80 );
    }

    createZoneActionBtns (numlevel, nameLevel, posX, posY, width, height) {
        const btn = this.add.zone(posX, posY, width, height);
        btn.setOrigin(0, 0);
        btn.setInteractive();

        btn.once("pointerdown", () => this.setLevelGame(numlevel, nameLevel));
        //this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(btn);
    }

    setLevelGame(numLevel, nameLevel) {
        if ( numLevel != 0 ) {
            levelName = nameLevel;
            level = numLevel;
        }
        this.redirectScene("menuScene");
    }

    redirectScene(scene) {
        this.scene.start(scene);
    }
}
class Mode extends Phaser.Scene {
    constructor() {
        super("modeScene");
    }
    preload () {}
    create () {
        // Drawing the images preload on the canvas
        this.add.image(420, 320, "bg").setScale(2);
        this.add.image(400, 80, "logo");
        this.add.image(180, 450, "faceRabbit");
        this.add.image(530, 420, "modeButtons");

        // Create the zone for clicking the buttons in the scene
        this.createZoneActionBtns( "1 Player", 1, 435, 285, 190, 80 );
        this.createZoneActionBtns( "2 Player", 2, 435, 385, 190, 80 );
        this.createZoneActionBtns( "Back", 0, 435, 480, 190, 80 );
    }

    createZoneActionBtns (mode, numPlayers, posX, posY, width, height) {
        const btn = this.add.zone(posX, posY, width, height);
        btn.setOrigin(0, 0);
        btn.setInteractive();
        btn.once("pointerdown", () => this.setModeGame(mode, numPlayers));
        //this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(btn);
    }

    setModeGame (mode, num) {
        if ( num != 0 ) {
            modeName = mode;
            playerQuantity = num;
        }
        this.redirectScene("menuScene");
    }

    redirectScene(scene) {
        this.scene.start(scene);
    }
}
class Controls extends Phaser.Scene {
    constructor() {
        super("controlsScene");
    }
    preload () {}
    
    create () {
        // Drawing the images preload on the canvas
        this.add.image(420, 320, "bg").setScale(2);
        this.add.image(400, 80, "logo");
        this.add.image(180, 450, "faceRabbit");
        this.add.image(430, 470, "controlsP1");
        this.add.image(640, 470, "controlsP2");

        //Add text for indicate what control is for every player
        this.addInfoPlayer("Player 1", "", 355, 300);
        this.addInfoPlayer("Player 2", "", 570, 300);

        // Create the zone for clicking back to the menu
        this.createZoneActionBtns("menuScene", 0, 0, 768, 672);
    }

    addInfoPlayer(title, info, posX, posY) {
        this.add.text(posX, posY, title + info, {
            fontSize: 32,
            fontStyle: "bold",
            fill: "#000000"
        });
    }

    createZoneActionBtns (scene, posX, posY, width, height) {
        const btn = this.add.zone(posX, posY, width, height);
        btn.setOrigin(0, 0);
        btn.setInteractive();
        btn.once("pointerdown", () => this.redirectScene(scene));
        //this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(btn);
    }

    redirectScene(scene) {
        this.scene.start(scene);
    }
}
class EndGame extends Phaser.Scene {
    constructor() {
        super("endScene");
    }
    preload () {}
    create () {
        // Drawing the images preload on the canvas
        this.add.image(420, 320, "bg").setScale(2);
        this.add.image(400, 80, "logo");
        this.add.image(180, 450, "faceRabbit");

        // Add information about the match of every player
        this.addInfoPlayer("Name: ", rabbit[0].name, 120, 180);
        this.addInfoPlayer("Score: ", rabbit[0].score, 120, 220);
        this.addInfoPlayer("Death: ", rabbit[0].death, 120, 260);

        if (playerQuantity == 2) {
            this.addInfoPlayer("Name: ", rabbit[1].name, 450, 180);
            this.addInfoPlayer("Score: ", rabbit[1].score, 450, 220);
            this.addInfoPlayer("Death: ", rabbit[1].death, 450, 260);
        }

        this.addInfoPlayer("Level: ", levelName, 450, 550);
        this.addInfoPlayer("Mode: ", modeName, 450, 590);

        // Create the zone for clicking back to the menu
        const backToMenu = this.add.zone(0, 0, 768, 672);
        backToMenu.setOrigin(0,0);
        backToMenu.setInteractive();
        backToMenu.once("pointerdown", () => this.redirectScene("menuScene"));
        // this.add.graphics().lineStyle(2, 0xff0000).strokeRectShape(backToMenu);
    }

    addInfoPlayer(title, info, posX, posY) {
        this.add.text(posX, posY, title + info, {
            fontSize: 30,
            fontStyle: "bold",
            fill: "#000000"
        });
    }

    redirectScene(scene) {
        this.scene.start(scene);
    }
}
const config = {
    type: Phaser.AUTO,
    width: 768,
    height: 672,
    scene: [
        Menu,
        MainScene,
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