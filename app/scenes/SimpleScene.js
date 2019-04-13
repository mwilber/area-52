export class SimpleScene extends Phaser.Scene {

	preload() {
		this.load.spritesheet('ship', 'assets/sprites/anim_ship_spin.png', { frameWidth: 192, frameHeight: 63 });
		
	}

	create() {
		this.add.text(100, 100, 'Hello Phaser!', { fill: '#0f0' });

		var player = this.physics.add.sprite(400, 300, 'ship');
		//player.body.setGravity(0,0);
		player.body.allowGravity = false;

		this.anims.create({
			key: 'spin',
			frames: this.anims.generateFrameNumbers('ship', { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		});

		player.anims.play('spin', true);
	}
}