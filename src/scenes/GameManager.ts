import Phaser, { Scene } from 'phaser';
import { InputHandler, INPUT_STRINGS } from '../plugins/InputHandler';
import eventsCenter from '../plugins/EventsCentre';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../constants';
import { HUDScene } from './Gameplay';

export enum SCENE_NAMES {
	GameManager = 'GameManager',
	MainMenu = 'MainMenu',
	HUD = 'HUD',
	Stage1_Gameplay = 'Stage1_Gameplay',
}

export default class GameManager extends Scene {
	constructor() {
		super('GameManager');
		new InputHandler();
	}

	preload() {
		this.load.image('empty', 'assets/sprites/empty.png');
		this.load.image('godseesall', 'assets/sprites/godseesall.png');
		this.load.audio('2huseesall', 'assets/bgm/god_sees_all/touhou_sees_all.ogg');
		this.load.json('shapes', 'assets/sprites/spriteshapes.json');
	}

	create() {
		InputHandler.Instance().create(this);
		this.scene.run(SCENE_NAMES.MainMenu);
		this.scene.add(SCENE_NAMES.HUD, HUDScene);

		this.add.image(WINDOW_WIDTH/2, WINDOW_HEIGHT/2, 'godseesall').setScale(1.5).setAlpha(.2).setDepth(1);

		eventsCenter.on('stage1_starts', () => {
			this.scene.run(SCENE_NAMES.HUD);
			console.log('stage 1 starts');
		});

		this.game.events.on(Phaser.Core.Events.BLUR, () => this.pause());
		this.game.events.on(Phaser.Core.Events.FOCUS, () => this.resume());
	}

	private pause(){
		InputHandler.Instance().reset();
		this.game.loop.sleep();
	}

	private resume(){
		this.game.loop.wake();
	}

	update() {
	}
}