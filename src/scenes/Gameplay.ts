import Phaser, { Scene } from 'phaser';
import { Dialog, DialogUpdateAction } from '../objects/Dialog';
import { DEFAULT_DIALOG_LINE_CREATE_OPTS } from '../objects/DialogLine';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from '../constants';
import { Player } from '../entities/Player';
import { IEntity, COLLISION_GROUPS, COLLISION_CATEGORIES } from '../entities/Entity';
import { Enemy } from '../entities/Enemy';
import { Characters } from '../entities/Character';

export const GAMEPLAY_SIZE = {
	WIDTH: WINDOW_WIDTH * .7,
	HEIGHT: WINDOW_HEIGHT * .9,
}

const GAMEPLAY_OFFSET = 50;

export class GameplayScene extends Scene {
	dialog?: IDialog;
	player?: Player;

	constructor(name: string) {
		super(name);
	}

	preload() {
		Dialog.preload(this);
		Player.preload(this);
		Enemy.preload(this);
	}

	create() {
		this.input.on('pointerdown', () => {
			this.dialog?.update(this, { dialogUpdate: DialogUpdateAction.PROGRESS });
		});

		//this.add.image(GAMEPLAY_SIZE.WIDTH/2, GAMEPLAY_SIZE.HEIGHT/2, 'godseesall').setScale(1.5).setAlpha(.2);
		this.player = new Player(this, { pos: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH/2, GAMEPLAY_SIZE.HEIGHT/2), texture: Characters.PLAYER } );

		//this.player.handlingInput(false);
		
		//this.eventSub();

		this.cameras.main.setViewport(GAMEPLAY_OFFSET, GAMEPLAY_OFFSET, GAMEPLAY_SIZE.WIDTH, GAMEPLAY_SIZE.HEIGHT);
		this.matter.world.setBounds(0, 0, GAMEPLAY_SIZE.WIDTH, GAMEPLAY_SIZE.HEIGHT);
	}

	update() {
		this.dialog?.update(this, {});
		this.player?.update();
	}

//#region Depricated
	private eventSub(){
		this.game.events.on(Phaser.Core.Events.BLUR, () => this.scene.pause(this.scene.key));
		this.game.events.on(Phaser.Core.Events.FOCUS, () => this.scene.resume(this.scene.key));
	}

	// test
	private collideEvent(){
		let ball = this.matter.add.circle(WINDOW_WIDTH/2, WINDOW_HEIGHT/2-500, 40,{
			label: 'box',
            //isStatic: true,
            isSensor: true,
            friction: 0,
            frictionAir: 0,
            collisionFilter: { group: COLLISION_GROUPS.ENEMY, category: COLLISION_CATEGORIES.blue }
		});

		this.matter.world.on('collisionstart', (event :  Phaser.Physics.Matter.Events.CollisionStartEvent ) => {
			for (const pair of event.pairs) {
				const bodyA = pair.bodyA;
				const bodyB = pair.bodyB;
				console.log(pair);
				if (bodyA.isSensor && bodyB.isSensor) 
					continue;
				const sensor = bodyA.isSensor ? bodyA : bodyB;
				console.log(`sensor ${sensor.label} is hit`);
			}
		});
	}
//#endregion
}

export const HUD_SIZE = {
	WIDTH: WINDOW_WIDTH-GAMEPLAY_OFFSET-GAMEPLAY_SIZE.WIDTH,
	HEIGHT: WINDOW_HEIGHT * .9,
};

const HUDOFFSET = {
	x: GAMEPLAY_SIZE.WIDTH + GAMEPLAY_OFFSET + 30,
	y: GAMEPLAY_OFFSET,
};

export class HUDScene extends Scene{
	dialog?: IDialog;

	constructor(name: string) {
		super(name);
	}

	preload() {
	}

	create() {
		this.cameras.main.setViewport(HUDOFFSET.x, HUDOFFSET.y, HUD_SIZE.WIDTH, HUD_SIZE.HEIGHT);

		this.input.on('pointerdown', () => {
			this.dialog?.update(this, { dialogUpdate: DialogUpdateAction.PROGRESS });
		});

		this.dialog = this.add.dialog({
			...DEFAULT_DIALOG_LINE_CREATE_OPTS,
			text: ['FKING B*TCH'],
		});
	}

	update() {
		this.dialog?.update(this, {});
	}
}