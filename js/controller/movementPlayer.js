export class Movement {
    constructor ( 
        player,  
        up, 
        down,
        animsKey,
        btnup, 
        btndown,
        currentPosPlayer
    ) {
        this.player = player;
        this.up = up;
        this.down = down;
        this.animsKey = animsKey;
        this.btnup = btnup;
        this.btndown = btndown;
        this.currentPosPlayer = currentPosPlayer;
    }
    GetUpPlayerMovement (pos) {
        if (pos + 1 < posibleMoves.length) {
            if ( this.currentPosPlayer == 1 ) {
                positionPlayerP1++;

                return posibleMoves[positionPlayerP1];
            } else if ( this.currentPosPlayer == 2 ) {
                positionPlayerP2++;
                
                return posibleMoves[positionPlayerP2];
            } 
        } else {
            return false;
        }
    }
    GetDownPlayerMovement (pos) {
        if (pos - 1 >= 0) {
            if ( this.currentPosPlayer == 1 ) {
                positionPlayerP1--;

                return posibleMoves[positionPlayerP1];
            } else if ( this.currentPosPlayer == 2 ) {
                positionPlayerP2--;
                
                return posibleMoves[positionPlayerP2];
            }
        } else {
            return false;
        }
    }
    AddMovementPlayer () {
        // saltar
        if ( this.up.isDown || this.btnup ) {
            if ( this.currentPosPlayer == 1 ) {
                nextUpMove = this.GetUpPlayerMovement(positionPlayerP1);
            } else if ( this.currentPosPlayer == 2 ) {
                nextUpMove = this.GetUpPlayerMovement(positionPlayerP2);
            }

            if (nextUpMove) {
                this.player.anims.play(this.animsKey[0], true);
                this.player.y = nextUpMove;
            }
        } else if (this.down.isDown || this.btndown) {
            if ( this.currentPosPlayer == 1 ) {
                nextDownMove = this.GetDownPlayerMovement(positionPlayerP1);
            } else if ( this.currentPosPlayer == 2 ) {
                nextDownMove = this.GetDownPlayerMovement(positionPlayerP2);
            }

            if (nextDownMove) {
                this.player.anims.play(this.animsKey[1], true);
                this.player.y = nextDownMove;
            }
        }
    }
}

let posibleMoves = [570, 530, 485, 435, 385, 315, 265, 210, 165, 105, 65];
let positionPlayerP1 = 0;
let positionPlayerP2 = 0;
let nextUpMove;
let nextDownMove;