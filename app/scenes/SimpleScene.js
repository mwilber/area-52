export class SimpleScene extends Phaser.Scene {

	preload() {
		this.load.spritesheet('ship', 'assets/sprites/anim_ship_spin.png', { frameWidth: 191, frameHeight: 63 });
	}

	create() {
		this.add.image(400, 300, 'ship');
		this.add.text(100, 100, 'Hello Phaser!', { fill: '#0f0' });
	}
}