export class IntroScene extends Phaser.Scene {
    constructor ()
    {
        super({ key: 'IntroScene' });
    }

    preload ()
    {
        //this.load.image('mech', 'assets/pics/titan-mech.png');
    }

    create ()
    {
        this.add.text(300, 300, 'Click to Start', {fontFamily:'sans-serif', fontSize:'2em', color:'#00ff00', textAlign:'center'})

        this.input.once('pointerdown', function (event) {

            this.scene.start('SimpleScene');

        }, this);
    }
}