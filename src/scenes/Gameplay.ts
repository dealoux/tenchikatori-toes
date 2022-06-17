import Phaser, { Scene } from 'phaser';
import { Dialog, DialogUpdateAction } from '../objects/Dialog';
import { DEFAULT_DIALOG_LINE_CREATE_OPTS } from '../objects/DialogLine';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from '../constants';
import { Player } from '../entities/Player';
import { IEntity, COLLISION_GROUPS, COLLISION_CATEGORIES } from '../entities/Entity';
import { Enemy } from '../entities/Enemy';
import { Characters } from '../entities/Character';

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

		this.player = new Player(this, { pos: new Phaser.Math.Vector2(WINDOW_WIDTH/2, WINDOW_HEIGHT/2), texture: Characters.PLAYER } );

		//this.eventSub();
	}

	update() {
		this.dialog?.update(this, {});
		this.player?.update();
	}
	
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
}