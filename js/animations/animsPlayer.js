export class AnimationsPlayer {
    constructor ( keyAnims, sprite, anims, frame, rate, repeatAnims ) {
        this.keyAnims = keyAnims;
        this.sprite = sprite;
        this.anims = anims;
        this.frame = frame;
        this.rate = rate;
        this.repeatAnims = repeatAnims;
    }
    CreateAnimationsPlayer () {
        this.keyAnims.forEach((keyAnim, index) => {
            this.anims.create({
                key: keyAnim,
                frames: this.anims.generateFrameNumbers(
                    this.sprite, 
                    {start: this.frame[index][0], end: this.frame[index][1]},
                ),
                frameRate: this.rate,
                repeat: this.repeatAnims,
            })
        });
    }
}