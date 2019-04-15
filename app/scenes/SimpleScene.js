export class SimpleScene extends Phaser.Scene {

	constructor() {
		super({
			key: 'SimpleScene'
		});

		this.player = null;
		this.worldLayer = null;
	}

	preload() {
		this.load.image('ground', 'assets/sprites/platform.png');
		this.load.spritesheet('ship', 'assets/sprites/anim_ship_spin.png', { frameWidth: 192, frameHeight: 63 });
		this.load.image('tiles', 'assets/sprites/super-mario-tiles.png');
		this.load.tilemapTiledJSON("map", "assets/sprites/SuperMarioTiles.json");
	}

	create() {

		this.physics.world.setBounds(0, 0, 800, 32*100);
		this.cameras.main.setBounds(this.physics.world.bounds.x, this.physics.world.bounds.y, this.physics.world.bounds.width, this.physics.world.bounds.height);

		this.cursors = this.input.keyboard.createCursorKeys();

		this.worldLayer = this.InitTileMaps();

		this.InitPlayerAnims();
		this.InitPlayerObject();
		

		//the camera will follow the player in the world
		this.cameras.main.startFollow(this.player);

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

	InitTileMaps(){
		const map = this.make.tilemap({ key: "map" });
		const tileset = map.addTilesetImage("Super Mario Tiles", "tiles");

		const belowLayer = map.createStaticLayer("Background", tileset, 0, 0);
		const worldLayer = map.createStaticLayer("World", tileset, 0, 0);
		  
		worldLayer.setCollisionByProperty({ collides: true });

		return worldLayer;
	}

	InitPlayerObject(){
		this.player = this.physics.add.sprite(400, 300, 'ship');
		//player.body.setGravity(0,0);
		//this.player.body.allowGravity = false;
		this.player.setActive(true);
		this.player.body.setGravity(0,-100);
		this.player.body.setAllowDrag(true);
		this.player.body.setDrag(70, 70);
		this.player.body.setFriction(0.7, 0);
		this.player.setCollideWorldBounds(true);
		this.player.anims.play('spin', true);
	}

	InitPlayerAnims(){
		this.anims.create({
			key: 'spin',
			frames: this.anims.generateFrameNumbers('ship', { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		});
	}

	HitGround(){
		//console.log('Hit Ground')
	}
}