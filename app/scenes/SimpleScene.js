export class SimpleScene extends Phaser.Scene {

	constructor() {
		super({
			key: 'SimpleScene',
			physics: {
				system: 'impact',
				gravity: 0,
				setBounds: {
					width: 800,
					height: 600
				}
			}
		});
	}

	preload() {
		this.load.image('ground', 'assets/sprites/platform.png');
		this.load.spritesheet('ship', 'assets/sprites/anim_ship_spin.png', { frameWidth: 192, frameHeight: 63 });
		
	}

	create() {
		this.add.text(100, 100, 'Hello Phaser!', { fill: '#0f0' });

		this.cursors = this.input.keyboard.createCursorKeys();

		this.platforms = this.physics.add.staticGroup();
    	this.platforms.create(400, 568, 'ground').refreshBody();

		this.player = this.physics.add.sprite(400, 300, 'ship');
		//player.body.setGravity(0,0);
		//this.player.body.allowGravity = false;
		this.player.setActive(true);
		this.player.body.setGravity(0,-100);
		this.player.body.setAllowDrag(true);
		this.player.body.setDrag(70, 70);
		this.player.body.setFriction(0.7, 0);

		this.anims.create({
			key: 'spin',
			frames: this.anims.generateFrameNumbers('ship', { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		});

		this.player.anims.play('spin', true);

		this.physics.add.collider(this.player, this.platforms, this.HitGround, null, this);
	}

	update() {
		if (this.cursors.left.isDown){
			this.player.setAccelerationX(-500);
			this.player.setAccelerationY(-500);
			if(this.player.angle > -15){
				this.player.setAngle(this.player.angle-1);
			}
		}else if (this.cursors.right.isDown){
			this.player.setAccelerationX(500);
			this.player.setAccelerationY(-500);
			if(this.player.angle < 15){
				this.player.setAngle(this.player.angle+1);
			}
		//}else if (this.cursors.up.isDown){
		//	this.player.setAccelerationY(-250);
		//}else if (this.cursors.down.isDown){
		//	this.player.setAccelerationY(250);
		}else{
			if(Math.abs(this.player.angle) < 1){
				this.player.setAngle(0);
			}else{
				this.player.setAngle(this.player.angle*0.7);
			}
			this.player.setAcceleration(0);
		}


	}

	HitGround(){
		//console.log('Hit Ground')
	}
}