import Phaser from 'phaser';
import { eventsCenter } from '../plugins/EventsCentre';
import { FONT_NOKIA, SCENE_NAMES, TEXTURE_FLIXEL_BUTTON, WINDOW_HEIGHT, WINDOW_WIDTH } from '../constants';
import { Button, IButton, UIScene } from '../@types/UI';

const MAINMENU_UI_TEXT_SIZE = 32;
const MAINMENU_UI_BUTTON_SCALE = { x: 6, y: 4.5 };

const STAGE1_BUTTON: IButton = {
	text: 'Stage 1',
	font: FONT_NOKIA.key,
	textSize: MAINMENU_UI_TEXT_SIZE,
	textTint: 0,
	buttonScale: MAINMENU_UI_BUTTON_SCALE,
	buttonTexture: TEXTURE_FLIXEL_BUTTON,
	point: { pos: new Phaser.Math.Vector2(WINDOW_WIDTH/2, 400) },
}

const STAGE2_BUTTON: IButton = {
	text: 'Stage 2',
	font: FONT_NOKIA.key,
	textSize: MAINMENU_UI_TEXT_SIZE,
	textTint: 0,
	buttonScale: MAINMENU_UI_BUTTON_SCALE,
	buttonTexture: TEXTURE_FLIXEL_BUTTON,
	point: { pos: new Phaser.Math.Vector2(WINDOW_WIDTH/2, 600) },
}

// const STAGE3_BUTTON: IButton = {
// 	text: 'Stage 3',
// 	font: FONT_NOKIA.key,
// 	textSize: MAINMENU_UI_TEXT_SIZE,
// 	textTint: 0,
// 	buttonScale: MAINMENU_UI_BUTTON_SCALE,
// 	buttonTexture: TEXTURE_FLIXEL_BUTTON,
// 	point: { pos: new Phaser.Math.Vector2(WINDOW_WIDTH/2, 800) },
// }

export class MainMenu extends UIScene {
	constructor() {
		super(SCENE_NAMES.MainMenu);
	}

	preload() {
		this.load.spritesheet(TEXTURE_FLIXEL_BUTTON.key, TEXTURE_FLIXEL_BUTTON.path, { frameWidth: TEXTURE_FLIXEL_BUTTON.frameWidth!, frameHeight: TEXTURE_FLIXEL_BUTTON.frameHeight! });
	}

	create() {		
		this.buttons.push(new Button(this, STAGE1_BUTTON, this.stage1.bind(this), 0));
		this.buttons.push(new Button(this, STAGE2_BUTTON, this.stage2.bind(this), 1));
		// this.buttons.push(new Button(this, STAGE3_BUTTON, this.stage1.bind(this), 1));
	}

	update() {
		super.update();
	}
	
	private stage1(){
		this.scene.start(SCENE_NAMES.Stage1_Gameplay);
		this.scene.start(SCENE_NAMES.HUD);
	}

	private stage2(){
		// this.scene.start(SCENE_NAMES.Stage1_Gameplay);
		// this.scene.start(SCENE_NAMES.HUD);
	}
}