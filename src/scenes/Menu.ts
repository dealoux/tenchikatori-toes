import Phaser from 'phaser';
import { eventsCenter, GAMEPLAY_EVENTS } from '../plugins/EventsCentre';
import { FONT_NOKIA, SCENE_NAMES, TEXTURE_FLIXEL_BUTTON, WINDOW_HEIGHT, WINDOW_WIDTH } from '../constants';
import { Button, IButton, UIScene } from '../@types/UI';
import { InputHandler } from '../plugins/InputHandler';

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

	private startStage(stageName: string){
		this.scene.start(SCENE_NAMES.Stage1_Gameplay);
		this.scene.start(SCENE_NAMES.HUD);
		eventsCenter.emit(GAMEPLAY_EVENTS.gameplayStart, stageName);
	}
	
	private stage1(){
		this.startStage(SCENE_NAMES.Stage1_Gameplay);
	}

	private stage2(){
		// this.scene.start(SCENE_NAMES.Stage1_Gameplay);
		// this.scene.start(SCENE_NAMES.HUD);
	}
}

const RESUME_BUTTON: IButton = {
	text: 'Resume',
	font: FONT_NOKIA.key,
	textSize: MAINMENU_UI_TEXT_SIZE,
	textTint: 0,
	buttonScale: MAINMENU_UI_BUTTON_SCALE,
	buttonTexture: TEXTURE_FLIXEL_BUTTON,
	point: { pos: new Phaser.Math.Vector2(WINDOW_WIDTH/2, 400) },
}

const RESTART_BUTTON: IButton = {
	text: 'Restart',
	font: FONT_NOKIA.key,
	textSize: MAINMENU_UI_TEXT_SIZE,
	textTint: 0,
	buttonScale: MAINMENU_UI_BUTTON_SCALE,
	buttonTexture: TEXTURE_FLIXEL_BUTTON,
	point: { pos: new Phaser.Math.Vector2(WINDOW_WIDTH/2, 600) },
}

const MAIN_MENU_BUTTON: IButton = {
	text: 'Main Menu',
	font: FONT_NOKIA.key,
	textSize: MAINMENU_UI_TEXT_SIZE,
	textTint: 0,
	buttonScale: MAINMENU_UI_BUTTON_SCALE,
	buttonTexture: TEXTURE_FLIXEL_BUTTON,
	point: { pos: new Phaser.Math.Vector2(WINDOW_WIDTH/2, 800) },
}

export class PauseScene extends UIScene {
	currStage?: string;

	constructor() {
		super(SCENE_NAMES.PauseMenu);
	}

	preload() {}

	create() {		
		this.buttons.push(new Button(this, RESUME_BUTTON, this.resume.bind(this), 0));
		this.buttons.push(new Button(this, RESTART_BUTTON, this.restart.bind(this), 1));
		this.buttons.push(new Button(this, MAIN_MENU_BUTTON, this.mainMenu.bind(this), 1));

		eventsCenter.on(GAMEPLAY_EVENTS.gameplayStart, (stageName: string) => this.currStage = stageName);
		eventsCenter.on(GAMEPLAY_EVENTS.gameplayPause, (stageName: string) => this.currStage = stageName);
	}

	update() {
		super.update();

		const {inputs} = InputHandler.Instance();

		if(inputs.Pause){
			inputs.Pause = false;
			this.resume();
		}
	}
	
	private resume(){
		this.scene.switch(this.currStage!);
		eventsCenter.emit(GAMEPLAY_EVENTS.gameplayResume);
	}

	private restart(){
		this.scene.get(this.currStage!).scene.restart();
		eventsCenter.emit(GAMEPLAY_EVENTS.gameplayRestart);
	}

	private mainMenu(){
		this.scene.start(SCENE_NAMES.MainMenu);
		eventsCenter.emit(GAMEPLAY_EVENTS.gameplayEnd);
	}
}

export class OverMenu extends UIScene {
	lastStage?: string;

	constructor() {
		super(SCENE_NAMES.OverMenu);
	}

	preload() {}

	create() {		
		this.buttons.push(new Button(this, RESTART_BUTTON, this.restart.bind(this), 0));
		this.buttons.push(new Button(this, MAIN_MENU_BUTTON, this.quit.bind(this), 1));

		eventsCenter.on(GAMEPLAY_EVENTS.gameplayEnd, (stageName: string) => this.lastStage = stageName);
	}

	update() {
		super.update();
	}
	
	private restart(){
		this.scene.get(this.lastStage!).scene.restart();
		eventsCenter.emit(GAMEPLAY_EVENTS.gameplayRestart);
	}

	private quit(){
		this.scene.start(SCENE_NAMES.MainMenu);
		eventsCenter.emit(GAMEPLAY_EVENTS.gameplayEnd);
	}
}