export class SimpleScene extends Phaser.Scene {

	constructor() {
		super({
			key: 'SimpleScene'
		});

		this.map = null;

		this.player = null;
		this.saucer = null;
		this.gear = null;
		this.worldLayer = null;
		this.landingLayer = null;
		this.console = null;
		this.testlayer = null;
	}

	preload() {
		this.load.image('ground', 'assets/sprites/platform.png');
		this.load.spritesheet('ship', 'assets/sprites/anim_ship_spin.png', { frameWidth: 192, frameHeight: 63 });
		this.load.image('landing_gear', 'assets/sprites/LandingGear.png');
		this.load.image('tiles', 'assets/sprites/super-mario-tiles.png');
		this.load.tilemapTiledJSON("map", "assets/sprites/SuperMarioTiles.json");
	}

	create() {

		this.physics.world.setBounds(0, 0, 800, 32*100);
		this.cameras.main.setBounds(this.physics.world.bounds.x, this.physics.world.bounds.y, this.physics.world.bounds.width, this.physics.world.bounds.height);

		this.cursors = this.input.keyboard.createCursorKeys();

		this.worldLayer = this.InitTileMaps();
		this.landingLayer = this.InitLandingPads();

		this.InitPlayerAnims();
		this.InitPlayerObject();
		
		this.ConvertObjects();

		//the camera will follow the player in the world
		this.cameras.main.startFollow(this.player);

		//this.physics.add.collider(this.player, this.worldLayer, this.HitWorld, null, this);
		//this.physics.add.collider(this.player, this.landingLayer, this.HitLandingPad, null, this);
		//console.log('player', this.player);

		this.console = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });
	}

	update() {
		if (this.cursors.left.isDown){
			this.ConsoleWrite('left');
			this.player.body.setAccelerationX(-500);
			this.player.body.setAccelerationY(-500);
			if(this.player.angle > -15){
				this.player.setAngle(this.player.angle-1);
			}
		}else if (this.cursors.right.isDown){
			this.ConsoleWrite('right');
			this.player.body.setAccelerationX(500);
			this.player.body.setAccelerationY(-500);
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
			this.player.body.setAcceleration(0);
		}

		
	}

	ConvertObjects(){
		const objects = this.map.getObjectLayer('Test'); //find the object layer in the tilemap named 'objects'

		objects.objects.forEach(
			(object) => {
				let tmp = this.add.rectangle((object.x+(object.width/2)), (object.y+(object.height/2)), object.width, object.height);
				tmp.properties = {};
				// Add pad number property
				for (let property of object.properties) {
					if (property.name === 'padnum') {
					  tmp.properties['padnum'] = property.value;
					  break;
					}
				}
				this.physics.world.enable(tmp, 1);
				this.physics.add.collider(this.gear, tmp, this.HitLandingPad, null, this);
				//debugger;
			}
		);
	}

	InitTileMaps(){
		//TODO: set this.map in the create method
		this.map = this.make.tilemap({ key: "map" });
		const tileset = this.map.addTilesetImage("Super Mario Tiles", "tiles");

		const belowLayer = this.map.createStaticLayer("Background", tileset, 0, 0);
		const worldLayer = this.map.createStaticLayer("World", tileset, 0, 0);
		  
		worldLayer.setCollisionByProperty({ collides: true });

		return worldLayer;
	}

	InitLandingPads(){
		const tileset = this.map.addTilesetImage("Super Mario Tiles", "tiles");

		const landingLayer = this.map.createStaticLayer("LandingPads", tileset, 0, 0);
		  
		landingLayer.setCollisionByProperty({ landingpad: true });

		return landingLayer;
	}

	InitPlayerObject(){
		this.saucer = this.add.sprite(0, 0, 'ship');
		this.saucer.anims.play('spin', true);
		//this.physics.world.enable(saucer, 1);
		//saucer.setSize(128, 62);
		//saucer.body.allowGravity = false;
		//saucer.body.immovable = true;
		//this.physics.add.collider(saucer, this.worldLayer, this.HitGround, null, this);
		this.gear = this.add.sprite(0, 50, 'landing_gear');
		//gear.body.allowGravity = false;
		//gear.body.immovable = true;
		//this.physics.add.collider(gear, this.worldLayer, this.Touchdown, null, this);

		//this.player = this.physics.add.sprite(400, 3000, 'ship');
		this.player = this.add.container(400, 2400, [ this.saucer, this.gear ]);

		this.physics.world.enable(this.gear, 1);
		this.gear.setSize(128, 62);

		this.player.setSize(128, 124);
		this.player.setActive(true);
		this.player.setScale(0.5);
		this.physics.world.enable(this.player);
		this.player.body.setGravity(0,-100);
		this.player.body.setAllowDrag(true);
		this.player.body.setDrag(70, 70);
		this.player.body.setFriction(0.7, 0);
		this.player.body.setCollideWorldBounds(true);
		//this.player.anims.play('spin', true);
	}

	InitPlayerAnims(){
		this.anims.create({
			key: 'spin',
			frames: this.anims.generateFrameNumbers('ship', { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		});
	}

	HitWorld(event){
		console.log('Hit Ground');
		//debugger;
	}

	HitLandingPad(event, evtwo){
		console.log('TOUCHDOWN!', evtwo.properties.padnum);
		//debugger;
	}

	ConsoleWrite(statement){
		this.console.setText([statement,this.console.text]);
	}
}