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
		this.landingObjectLayer = [];

		this.scoreboard = null;
		this.bank = 0;
		this.order = 0;
	}

	preload() {
		this.load.image('ground', 'assets/sprites/platform.png');
		this.load.spritesheet('ship', 'assets/sprites/anim_ship_spin.png', { frameWidth: 192, frameHeight: 63 });
		this.load.image('landing_gear', 'assets/sprites/LandingGear.png');
		this.load.image('tiles', 'assets/sprites/super-mario-tiles.png');
		this.load.tilemapTiledJSON("map", "assets/sprites/SuperMarioTiles.json");

		this.load.html('scoreboard', 'assets/html/hud.html');
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
		this.cameras.main.startFollow(this.player, true);

		this.physics.add.collider(this.player, this.worldLayer, this.HitWorld, null, this);
		//this.physics.add.collider(this.player, this.landingLayer, this.HitLandingPad, null, this);
		//console.log('player', this.player);

		this.console = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });

		this.scoreboard = this.add.dom(120, 65 ).createFromCache('scoreboard').setScrollFactor(0);
		
		//debugger;
		//this.hud.setPerspective(800);
	}

	update() {
		if (this.cursors.left.isDown){
			//this.ConsoleWrite('left');
			this.player.body.setAccelerationX(-500);
			this.player.body.setAccelerationY(-500);
			if(this.player.angle > -15){
				this.player.setAngle(this.player.angle-1);
			}
		}else if (this.cursors.right.isDown){
			//this.ConsoleWrite('right');
			this.player.body.setAccelerationX(500);
			this.player.body.setAccelerationY(-500);
			if(this.player.angle < 15){
				this.player.setAngle(this.player.angle+1);
			}
		}else{
			if(Math.abs(this.player.angle) < 1){
				this.player.setAngle(0);
			}else{
				this.player.setAngle(this.player.angle*0.7);
			}
			this.player.body.setAcceleration(0);
		}

		if(this.cursors.space.isDown && this.gear.relax === 0){
			this.gear.relax = 10;
			if(this.gear.visible){
				this.gear.visible = false;
				this.player.body.height = 31;
			}else{
				this.gear.visible = true;
				this.player.body.height = 55;
			}
			
		}

		if(this.gear.relax !== 0){
			this.gear.relax = Math.abs(this.gear.relax) - 1;
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
				//tmp.body.setAllowGravity(false);
				//tmp.body.setFriction(1, 1);
				this.physics.add.collider(this.player, tmp, this.HitLandingPad, null, this);
				//debugger;
				this.landingObjectLayer.push(tmp);

				// Add pad label
				if(tmp.properties.padnum !== 0){
					let xoffset = (tmp.width*.7);
					if(tmp.x > (this.map.widthInPixels/2)) xoffset = -xoffset;
					this.add.text((tmp.x-xoffset), (tmp.y-tmp.height), tmp.properties.padnum, { color: '#ffffff', textAlagn: 'center' });
				}
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
		this.saucer = this.add.sprite(48, 16, 'ship');
		this.saucer.anims.play('spin', true);
		
		this.gear = this.add.sprite(48, 66, 'landing_gear');
		this.gear.visible = true;
		this.gear.relax = 0;

		this.player = this.add.container(400, 3000, [ this.saucer, this.gear ]);
		this.player.setSize(96, 55);
		this.player.setActive(true);
		this.player.setScale(0.5);

		this.physics.world.enable(this.player, 0);
		this.player.body.setBounceY(0.2);
		this.player.body.setGravity(0,-100);
		this.player.body.setAllowDrag(true);
		this.player.body.setDrag(70, 70);
		this.player.body.setFriction(1, 0);
		this.player.body.setCollideWorldBounds(true);
		//this.player.anims.play('spin', true);
		this.physics.add.collider(this.gear, this.worldLayer, this.HitGround, null, this);
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
		//console.log('Hit Ground');
		//debugger;
		this.bank = 0;
		this.order = 0;
		this.landingObjectLayer = [];
		// this.SetHudPad('DEAD!');
		// this.SetHudBank();
		this.scene.restart();
	}

	HitLandingPad(event, evtwo){
		if( !this.gear.visible || 
			event.body.touching.up || 
			event.body.touching.left || 
			event.body.touching.right
		){
			this.HitWorld();
		}else{
			//this.SetHudPad('Landed: Pad '+evtwo.properties.padnum);
			if( evtwo.properties.padnum === this.order ){
				if( this.order === 0 ){
					this.SetOrder(this.ChooseOrderPad());
				}else{
					this.SetOrderReceived();
				}
			}
		}
	}

	ChooseOrderPad(){
		// Discount the restaurant (pad 0).
		return Math.floor(Math.random()*(this.landingObjectLayer.length-1))+1;
	}

	SetOrder(padNum){
		this.order = padNum;
		this.SetHudPad('Deliver to pad '+this.order);
	}

	SetOrderReceived(){
		this.order = 0;
		this.bank += 5;
		this.SetHudPad('Thanks!');
		this.SetHudBank();
	}

	SetHudPad(txtOut){
		this.scoreboard.getChildByID('hud-pad').innerHTML = txtOut;
	}

	SetHudBank(){
		this.scoreboard.getChildByID('hud-bank').innerHTML = '$'+this.bank.toString();
	}

	ConsoleWrite(statement){
		this.console.setText([statement,this.console.text]);
	}
}