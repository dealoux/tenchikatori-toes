import Phaser from 'phaser';
import { FONT_NOKIA, FONT_INTER, HUD_SIZE, SCENE_NAMES } from '../constants';
import { PLAYER_DATA } from '../entities/characters/player/Player';
import { DATA_HP_ITEM, DATA_POWER_ITEM, DATA_SCORE_ITEM, DATA_SPECIAL_ITEM } from '../entities/projectiles/items/Item';
import { eventsCenter, GAMEPLAY_EVENTS } from '../plugins/EventsCentre';
import { addText, ITextHUD } from './UI';
import { BaseScene } from './BaseScene';

const HUD_LINE_SPACING = HUD_SIZE.height*.1;
const HUD_LINE_BASE = new Phaser.Math.Vector2(10, 10);
const HUD_VALUE_OFFSET_X = HUD_SIZE.width*.5;
const HUD_ICON_OFFSET = new Phaser.Math.Vector2(HUD_SIZE.width*.1, HUD_SIZE.height*.012);
const HUD_TEXT_SIZE = 25;
const HUD_FRONT = FONT_NOKIA.key;
const HUD_TEXT_TINT = 0xFFFFFF;

const HUD_HISCORE: ITextHUD = {
	text: 'High Score',
	font: HUD_FRONT,
	textSize: HUD_TEXT_SIZE,
	textTint: HUD_TEXT_TINT,
	point: { pos: new Phaser.Math.Vector2(HUD_LINE_BASE.x + HUD_LINE_SPACING, HUD_LINE_BASE.y + HUD_LINE_SPACING) },
}

const HUD_SCORE: ITextHUD = {
	text: 'Score',
	font: HUD_FRONT,
	textSize: HUD_TEXT_SIZE,
	textTint: HUD_TEXT_TINT,
	point: { pos: new Phaser.Math.Vector2(HUD_LINE_BASE.x + HUD_LINE_SPACING, HUD_LINE_BASE.y + HUD_LINE_SPACING*2) },
}

const HUD_LIVES_COUNT: ITextHUD = {
	text: 'HP',
	font: HUD_FRONT,
	textSize: HUD_TEXT_SIZE,
	textTint: HUD_TEXT_TINT,
	point: { pos: new Phaser.Math.Vector2(HUD_LINE_BASE.x + HUD_LINE_SPACING, HUD_LINE_BASE.y + HUD_LINE_SPACING*3) },
}

const HUD_SPECIAL_COUNT: ITextHUD = {
	text: 'Special',
	font: HUD_FRONT,
	textSize: HUD_TEXT_SIZE,
	textTint: HUD_TEXT_TINT,
	point: { pos: new Phaser.Math.Vector2(HUD_LINE_BASE.x + HUD_LINE_SPACING, HUD_LINE_BASE.y + HUD_LINE_SPACING*4) },
}

const HUD_POWER: ITextHUD = {
	text: 'Power',
	font: HUD_FRONT,
	textSize: HUD_TEXT_SIZE,
	textTint: HUD_TEXT_TINT,
	point: { pos: new Phaser.Math.Vector2(HUD_LINE_BASE.x + HUD_LINE_SPACING, HUD_LINE_BASE.y + HUD_LINE_SPACING*5) },
}

const HUD_EXTRA_SCORE: ITextHUD = {
	text: 'Extra Score',
	font: HUD_FRONT,
	textSize: HUD_TEXT_SIZE,
	textTint: HUD_TEXT_TINT,
	point: { pos: new Phaser.Math.Vector2(HUD_LINE_BASE.x + HUD_LINE_SPACING, HUD_LINE_BASE.y + HUD_LINE_SPACING*6) },
}

const HUD_GRAZE_COUNT: ITextHUD = {
	text: 'Graze Count',
	font: HUD_FRONT,
	textSize: HUD_TEXT_SIZE,
	textTint: HUD_TEXT_TINT,
	point: { pos: new Phaser.Math.Vector2(HUD_LINE_BASE.x + HUD_LINE_SPACING, HUD_LINE_BASE.y + HUD_LINE_SPACING*7) },
}

export class HUDScene extends BaseScene{
	hiscoreValue?: Phaser.GameObjects.BitmapText;
	scoreValue?: Phaser.GameObjects.BitmapText;
	HPCount?: Phaser.GameObjects.BitmapText;
	specialCount?: Phaser.GameObjects.BitmapText;
	powerCount?: Phaser.GameObjects.BitmapText;
	extraScoreValue?: Phaser.GameObjects.BitmapText;
	grazeCount?: Phaser.GameObjects.BitmapText;

	constructor() {
		super(SCENE_NAMES.HUD);
	}

	async create() {
		super.create();

		this.cameras.main.setViewport(HUD_SIZE.offset.x, HUD_SIZE.offset.y, HUD_SIZE.width, HUD_SIZE.height);

		this.scoreValue = this.displayText(HUD_SCORE);
		this.grazeCount = this.displayText(HUD_GRAZE_COUNT);
		this.HPCount = this.displayTextItem(HUD_LIVES_COUNT, DATA_HP_ITEM.texture.key);
		this.specialCount = this.displayTextItem(HUD_SPECIAL_COUNT, DATA_SPECIAL_ITEM.texture.key);
		this.powerCount = this.displayTextItem(HUD_POWER, DATA_POWER_ITEM.texture.key);
		this.extraScoreValue = this.displayTextItem(HUD_EXTRA_SCORE, DATA_SCORE_ITEM.texture.key);

		eventsCenter.on(GAMEPLAY_EVENTS.displayScore, this.updateScore, this);
		eventsCenter.on(GAMEPLAY_EVENTS.displayExtraScore, this.updateExtraScore, this);
		eventsCenter.on(GAMEPLAY_EVENTS.displayGrazeCount, this.updateGrazeCount, this);
		eventsCenter.on(GAMEPLAY_EVENTS.displayHPCount, this.updateHPCount, this);
		eventsCenter.on(GAMEPLAY_EVENTS.displayPowerCount, this.updatePowerCount, this);
		eventsCenter.on(GAMEPLAY_EVENTS.displaySpecialCount, this.updateSpecialCount, this);
	}

	updateScore(value: string){
		this.updateText(this.scoreValue!, value);
	}

	updateExtraScore(value: string){
		this.updateText(this.extraScoreValue!, value);
	}

	updateGrazeCount(value: string){
		this.updateText(this.grazeCount!, value);
	}

	updateHPCount(value: string){
		this.updateTextMax(this.HPCount!, value, PLAYER_DATA.maxHP.toString());
	}

	updatePowerCount(value: string){
		this.updateTextMax(this.powerCount!, value, PLAYER_DATA.maxPower.toString());
	}

	updateSpecialCount(value: string){
		this.updateTextMax(this.specialCount!, value, PLAYER_DATA.maxSpecial.toString());
	}

	protected displayText(textData: ITextHUD){
		addText(this, textData);
		return addText(this, { text: '', font: textData.font, textSize: textData.textSize, textTint: textData.textTint, point: { pos: new Phaser.Math.Vector2(textData.point.pos.x + HUD_VALUE_OFFSET_X, textData.point.pos.y) } });
	}

	protected displayTextItem(textData: ITextHUD, icon: string){
		this.add.image(textData.point.pos.x-HUD_ICON_OFFSET.x, textData.point.pos.y+HUD_ICON_OFFSET.y, icon);
		return this.displayText(textData);
	}

	protected updateText(text: Phaser.GameObjects.BitmapText, value: string){
		text.setText(value);
	}

	protected updateTextMax(text: Phaser.GameObjects.BitmapText, value: string, maxValue: string){
		text.setText(value + '/' + maxValue);
	}

	protected onShutdown(){
		// this.scoreValue?.destroy();
		// this.grazeCount?.destroy();
		// this.HPCount?.destroy();
		// this.specialCountValue?.destroy();
		// this.powerCount?.destroy();
		// this.extraScoreValue?.destroy();
		eventsCenter.off(GAMEPLAY_EVENTS.displayScore, this.updateScore);
		eventsCenter.off(GAMEPLAY_EVENTS.displayExtraScore, this.updateExtraScore);
		eventsCenter.off(GAMEPLAY_EVENTS.displayGrazeCount, this.updateGrazeCount);
		eventsCenter.off(GAMEPLAY_EVENTS.displayHPCount, this.updateHPCount);
		eventsCenter.off(GAMEPLAY_EVENTS.displayPowerCount, this.updatePowerCount);
		eventsCenter.off(GAMEPLAY_EVENTS.displaySpecialCount, this.updateSpecialCount);
	}
}