import Phaser, { Scene } from 'phaser';
import { Dialog, DialogUpdateAction } from '../objects/Dialog';
import { DEFAULT_DIALOG_LINE_CREATE_OPTS } from '../objects/DialogLine';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from '../constants';
import { Player, PLAYER_TEXTURE } from '../entities/characters/player/Player';
import { Enemy } from '../entities/characters/enemies/Enemy';
import { Character } from '../entities/characters/Character';
import { Item } from '../entities/projectiles/items/Item';
import { Entity } from '../entities/Entity';

export const GAMEPLAY_SIZE = {
	WIDTH: WINDOW_WIDTH * .7,
	HEIGHT: WINDOW_HEIGHT * .9,
	OFFSET: 50,
}

export class GameplayScene extends Scene {
	dialog?: IDialog;
	player?: Player;

	constructor(name: string) {
		super(name);
	}

	preload() {
		Dialog.preload(this);
		Item.preload(this);
		Player.preload(this);
		Enemy.preload(this);
	}

	create() {
		this.input.on('pointerdown', () => {
			this.dialog?.update(this, { dialogUpdate: DialogUpdateAction.PROGRESS });
		});

		//this.add.image(GAMEPLAY_SIZE.WIDTH/2, GAMEPLAY_SIZE.HEIGHT/2, 'godseesall').setScale(1.5).setAlpha(.2);
		this.player = new Player(this, { pos: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH/2, GAMEPLAY_SIZE.HEIGHT/2), texture: PLAYER_TEXTURE } );

		//this.player.handlingInput(false);
		
		//this.eventSub();

		Enemy.initPManagers(this);
		Character.initManager(this);
		Entity.setWorldsEdge(this);

		this.cameras.main.setViewport(GAMEPLAY_SIZE.OFFSET, GAMEPLAY_SIZE.OFFSET, GAMEPLAY_SIZE.WIDTH, GAMEPLAY_SIZE.HEIGHT);
		this.physics.world.setBounds(0, 0, GAMEPLAY_SIZE.WIDTH, GAMEPLAY_SIZE.HEIGHT);
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

//#endregion
}

export const HUD_SIZE = {
	WIDTH: WINDOW_WIDTH-GAMEPLAY_SIZE.OFFSET-GAMEPLAY_SIZE.WIDTH,
	HEIGHT: WINDOW_HEIGHT * .9,
	OFFSET: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH + GAMEPLAY_SIZE.OFFSET + 30, GAMEPLAY_SIZE.OFFSET),
};

enum HUD_TEXT {
	HighScore = 'High Score',
	Score = 'Score',
	Lives = 'Lives',
	Special = 'Special',
	Power = 'Power',
	ExtraPoint = 'Extra Points',
	Graze = 'Graze'
}

export class HUDScene extends Scene{
	dialog?: IDialog;

	constructor(name: string) {
		super(name);
	}

	preload() {
	}

	create() {
		this.cameras.main.setViewport(HUD_SIZE.OFFSET.x, HUD_SIZE.OFFSET.y, HUD_SIZE.WIDTH, HUD_SIZE.HEIGHT);

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