export class SimpleScene extends Phaser.Scene {

	constructor() {
		super({
			key: 'SimpleScene'
		});

		this.background = [
			[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
			[  0,  1,  2,  3,  0,  0,  0,  1,  2,  3,  0 ],
			[  0,  5,  6,  7,  0,  0,  0,  5,  6,  7,  0 ],
			[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
			[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
			[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
			[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
			[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
			[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
			[ 35, 36, 37,  0,  0,  0,  0,  0,  0,  0,  0 ],
			[ 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39 ]
		];
		this.world = [
			[ 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40 ],
			[ 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40 ],
			[ 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40 ],
			[ 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40 ],
			[ 40, 40, 40, 14, 13, 14, 40, 40, 40, 40, 40 ],
			[ 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40 ],
			[ 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40 ],
			[ 40, 40, 14, 14, 14, 14, 14, 40, 40, 40, 15 ],
			[ 40, 40, 40, 40, 40, 40, 40, 40, 40, 15, 15 ],
			[ 40, 40, 40, 40, 40, 40, 40, 40, 15, 15, 15 ],
			[ 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39 ]
		];
		this.foreground = [
			[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
			[  0,  1,  2,  3,  0,  0,  0,  1,  2,  3,  0 ],
			[  0,  5,  6,  7,  0,  0,  0,  5,  6,  7,  0 ],
			[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
			[  0,  0,  0, 14, 13, 14,  0,  0,  0,  0,  0 ],
			[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
			[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
			[  0,  0, 14, 14, 14, 14, 14,  0,  0,  0, 15 ],
			[  0,  0,  0,  0,  0,  0,  0,  0,  0, 15, 15 ],
			[ 35, 36, 37,  0,  0,  0,  0,  0, 15, 15, 15 ],
			[ 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39 ]
		];
	}

	preload() {
		this.load.image('ground', 'assets/sprites/platform.png');
		this.load.spritesheet('ship', 'assets/sprites/anim_ship_spin.png', { frameWidth: 192, frameHeight: 63 });
		this.load.image('tiles', 'assets/sprites/super-mario-tiles.png');
	}

	create() {
		this.add.text(100, 100, 'Hello Phaser!', { fill: '#0f0' });

		this.cursors = this.input.keyboard.createCursorKeys();

		this.platforms = this.physics.add.staticGroup();
		this.platforms.create(400, 568, 'ground').refreshBody();
		
		this.belowMap = this.make.tilemap({ data: this.background, tileWidth: 32, tileHeight: 32 });
		this.belowTiles = this.belowMap.addTilesetImage('tiles');
		this.worldMap = this.make.tilemap({ data: this.world, tileWidth: 32, tileHeight: 32 });
  		this.worldTiles = this.worldMap.addTilesetImage('tiles');
		//this.layer = this.map.createStaticLayer(0, this.tiles, 0, 0);

		//this.belowLayer = this.belowMap.createStaticLayer(0, this.belowTiles, 0, 0);
  		this.worldLayer = this.worldMap.createStaticLayer(0, this.worldTiles, 0, 0);
		//this.aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0);
		  
		this.worldLayer.setCollision([13,14,39]);

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

		//the camera will follow the player in the world
		this.cameras.main.startFollow(this.player);

		this.physics.add.collider(this.player, this.platforms, this.HitGround, null, this);
		this.physics.add.collider(this.player, this.worldLayer, this.HitGround, null, this);
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