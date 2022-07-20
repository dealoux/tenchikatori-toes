import Phaser, { Scene } from 'phaser';
import { Dialog, DialogUpdateAction } from '../objects/Dialog';
import { DEFAULT_DIALOG_LINE_CREATE_OPTS } from '../objects/DialogLine';
import { WINDOW_WIDTH, WINDOW_HEIGHT, FONT_NOKIA, FONT_INTER } from '../constants';
import { Player } from '../entities/characters/player/Player';
import { Enemy } from '../entities/characters/enemies/Enemy';
import { Character } from '../entities/characters/Character';
import { DATA_POWER_ITEM, DATA_SCORE_ITEM, DATA_SPECIAL_ITEM } from '../entities/projectiles/items/Item';
import { Entity, IText, IVectorPoint } from '../entities/Entity';
import { eventsCenter, GAMEPLAY_EVENTS } from '../plugins/EventsCentre';

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
		Player.preload(this);
		Enemy.preload(this);
	}

	create() {
		this.input.on('pointerdown', () => {
			this.dialog?.update(this, { dialogUpdate: DialogUpdateAction.PROGRESS });
		});

		//this.add.image(GAMEPLAY_SIZE.WIDTH/2, GAMEPLAY_SIZE.HEIGHT/2, 'godseesall').setScale(1.5).setAlpha(.2);
		this.player = new Player(this, new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH/2, GAMEPLAY_SIZE.HEIGHT/2));

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
}

export const HUD_SIZE = {
	width: WINDOW_WIDTH-GAMEPLAY_SIZE.OFFSET-GAMEPLAY_SIZE.WIDTH,
	height: WINDOW_HEIGHT * .9,
	offset: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH + GAMEPLAY_SIZE.OFFSET + 30, GAMEPLAY_SIZE.OFFSET),
};

const HUD_LINE_SPACING = HUD_SIZE.height * .1;
const HUD_LINE_BASE = new Phaser.Math.Vector2(10, 10);
const HUD_ICON_OFFSET_X = HUD_SIZE.width* .1;
const HUD_VALUE_OFFSET_X = HUD_SIZE.width* .4;

const HUD_HISCORE: IText = {
	text: 'High Score',
	font: FONT_INTER.key,
	point: { pos: new Phaser.Math.Vector2(HUD_LINE_BASE.x + HUD_LINE_SPACING, HUD_LINE_BASE.y + HUD_LINE_SPACING), theta: 0 },
}

const HUD_SCORE: IText = {
	text: 'Score',
	font: FONT_NOKIA.key,
	point: { pos: new Phaser.Math.Vector2(HUD_LINE_BASE.x + HUD_LINE_SPACING, HUD_LINE_BASE.y + HUD_LINE_SPACING*2), theta: 0 },
}

const HUD_LIVES_COUNT: IText = {
	text: 'Lives Count',
	font: FONT_INTER.key,
	point: { pos: new Phaser.Math.Vector2(HUD_LINE_BASE.x + HUD_LINE_SPACING, HUD_LINE_BASE.y + HUD_LINE_SPACING*3), theta: 0 },
}

const HUD_SPECIAL_COUNT: IText = {
	text: 'Special Count',
	font: FONT_NOKIA.key,
	point: { pos: new Phaser.Math.Vector2(HUD_LINE_BASE.x + HUD_LINE_SPACING, HUD_LINE_BASE.y + HUD_LINE_SPACING*4), theta: 0 },
}

const HUD_POWER: IText = {
	text: 'Power',
	font: FONT_NOKIA.key,
	point: { pos: new Phaser.Math.Vector2(HUD_LINE_BASE.x + HUD_LINE_SPACING, HUD_LINE_BASE.y + HUD_LINE_SPACING*5), theta: 0 },
}

const HUD_EXTRA_SCORE: IText = {
	text: 'Extra Score',
	font: FONT_NOKIA.key,
	point: { pos: new Phaser.Math.Vector2(HUD_LINE_BASE.x + HUD_LINE_SPACING, HUD_LINE_BASE.y + HUD_LINE_SPACING*6), theta: 0 },
}

const HUD_GRAZE_COUNT: IText = {
	text: 'Graze Count',
	font: FONT_NOKIA.key,
	point: { pos: new Phaser.Math.Vector2(HUD_LINE_BASE.x + HUD_LINE_SPACING, HUD_LINE_BASE.y + HUD_LINE_SPACING*7), theta: 0 },
}

export class HUDScene extends Scene{
	hiscoreValue?: Phaser.GameObjects.Text;
	scoreValue?: Phaser.GameObjects.Text;
	livesCount?: Phaser.GameObjects.Text;
	specialCountValue?: Phaser.GameObjects.Text;
	powerCount?: Phaser.GameObjects.Text;
	extraScoreValue?: Phaser.GameObjects.Text;
	grazeCount?: Phaser.GameObjects.Text;

	constructor(name: string) {
		super(name);
	}

	preload() {
	}

	create() {
		this.cameras.main.setViewport(HUD_SIZE.offset.x, HUD_SIZE.offset.y, HUD_SIZE.width, HUD_SIZE.height);

		this.scoreValue = this.displayText(HUD_SCORE);
		this.livesCount = this.displayText(HUD_LIVES_COUNT);
		this.grazeCount = this.displayText(HUD_GRAZE_COUNT);
		this.specialCountValue = this.displayTextItem(HUD_SPECIAL_COUNT, DATA_SPECIAL_ITEM.texture.key);
		this.powerCount = this.displayTextItem(HUD_POWER, DATA_POWER_ITEM.texture.key);
		this.extraScoreValue = this.displayTextItem(HUD_EXTRA_SCORE, DATA_SCORE_ITEM.texture.key);

		eventsCenter.on(GAMEPLAY_EVENTS.updateScore, (value: string) => this.updateText(this.scoreValue!, value), this);
		eventsCenter.on(GAMEPLAY_EVENTS.updateLivesCount,  (value: string) => this.updateText(this.livesCount!, value), this);
		eventsCenter.on(GAMEPLAY_EVENTS.updateGrazeCount,  (value: string) => this.updateText(this.grazeCount!, value), this);
		eventsCenter.on(GAMEPLAY_EVENTS.updateSpecialCount,  (value: string) => this.updateText(this.specialCountValue!, value), this);
		eventsCenter.on(GAMEPLAY_EVENTS.updatePowerCount,  (value: string) => this.updateText(this.powerCount!, value), this);
		eventsCenter.on(GAMEPLAY_EVENTS.updateExtraScore,  (value: string) => this.updateText(this.extraScoreValue!, value), this);
	}

	// protected displayText(textData: IText){
	// 	this.add.bitmapText(textData.point.pos.x, textData.point.pos.y, textData.font, textData.text);
	// 	return this.add.bitmapText(textData.point.pos.x + HUD_VALUE_OFFSET_X, textData.point.pos.y, textData.font, '');
	// }

	// protected displayTextItem(textData: IText, icon: string){
	// 	this.add.image(textData.point.pos.x-20, textData.point.pos.y+5, icon);
	// 	return this.displayText(textData);
	// }

	// protected updateText(text: Phaser.GameObjects.BitmapText, value: string){
	// 	text.setText(value);
	// }

	protected displayText(textData: IText){
		this.add.text(textData.point.pos.x, textData.point.pos.y, textData.text);
		return this.add.text(textData.point.pos.x + HUD_VALUE_OFFSET_X, textData.point.pos.y, '');
	}

	protected displayTextItem(textData: IText, icon: string){
		this.add.image(textData.point.pos.x-20, textData.point.pos.y+5, icon);
		return this.displayText(textData);
	}

	protected updateText(text: Phaser.GameObjects.Text, value: string){
		text.setText(value);
	}

}