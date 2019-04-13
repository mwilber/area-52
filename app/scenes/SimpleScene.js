export class SimpleScene extends Phaser.Scene {

	

	preload() {
		this.load.spritesheet('ship', 'assets/sprites/anim_ship_spin.png', { frameWidth: 192, frameHeight: 63 });
		
	}

	create() {
		this.add.text(100, 100, 'Hello Phaser!', { fill: '#0f0' });

		this.cursors = this.input.keyboard.createCursorKeys();

		this.player = this.physics.add.sprite(400, 300, 'ship');
		//player.body.setGravity(0,0);
		this.player.body.allowGravity = false;
		this.player.setFriction(1);

		this.anims.create({
			key: 'spin',
			frames: this.anims.generateFrameNumbers('ship', { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		});

		this.player.anims.play('spin', true);
	}

	update()
	{
		if (this.cursors.left.isDown)
		{
			this.player.setVelocityX(-160);
		}
		else if (this.cursors.right.isDown)
		{
			this.player.setVelocityX(160);
		}
	}
}