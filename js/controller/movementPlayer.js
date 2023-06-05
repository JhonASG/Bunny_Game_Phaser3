export class Movement {
    constructor ( 
        player,  
        up, 
        down,
        animsKey,
        btnup, 
        btndown
    ) {
        this.player = player;
        this.up = up;
        this.down = down;
        this.animsKey = animsKey;
        this.btnup = btnup;
        this.btndown = btndown;
    }
    GetUpPlayerMovement (pos) {
        if (pos + 1 < posibleMoves.length) {
            currentPosP1++;
            return posibleMoves[currentPosP1];
        } else {
            return false;
        }
    }
    GetDownPlayerMovement (pos) {
        if (pos - 1 >= 0) {
            currentPosP1--;
            return posibleMoves[currentPosP1];
        } else {
            return false;
        }
    }
    AddMovementPlayer () {
        // saltar
        if ( this.up.isDown || this.btnup ) {
            if (canGoUP) {
                canGoUP = false;
                console.log("Go: " + canGoUP);
                
                const nextUpMove = this.GetUpPlayerMovement(currentPosP1);
                
                if (nextUpMove) {
                    this.player.anims.play(this.animsKey[0], true);
                    this.player.y = nextUpMove;
                }
            }
        } else if (this.down.isDown || this.btndown) {
            if (canGoDown) {
                canGoDown = false;
                
                const nextDownMove = this.GetDownPlayerMovement(currentPosP1);
                
                if (nextDownMove) {
                    this.player.anims.play(this.animsKey[1], true);
                    this.player.y = nextDownMove;
                }
            }
        }

        if ( this.up.isUp || !this.btnup ) {
            canGoUP = true;
        }

        if ( this.down.isUp || !this.btndown ) {
            canGoDown = true;
        }
    }
}

let posibleMoves = [570, 530, 485, 435, 385, 315, 265, 210, 165, 105, 65];
let currentPosP1 = 0;
let currentPosP2 = 0;
let canGoUP = true;
let canGoDown = true;