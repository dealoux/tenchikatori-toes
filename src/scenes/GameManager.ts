import Phaser, { Scene } from 'phaser';
import { InputHandler, INPUT_STRINGS } from '../plugins/InputHandler';
import { eventsCenter } from '../plugins/EventsCentre';
import { EMPTY_TEXTURE, GOD_SEES_ALL_BG, SCENE_NAMES, WINDOW_HEIGHT, WINDOW_WIDTH } from '../constants';
import { HUDScene } from './Gameplay';
import { loadBGM } from '../@types/Audio';
import { Item } from '../entities/projectiles/items/Item';
import GameplayStage1 from './stages/GameplayStage1';

export default class GameManager extends Scene {
	constructor() {
		super(SCENE_NAMES.GameManager);
		new InputHandler();
	}

	preload() {
		this.load.image(EMPTY_TEXTURE.key, EMPTY_TEXTURE.path);
		this.load.image(GOD_SEES_ALL_BG.key, GOD_SEES_ALL_BG.path);
		//this.load.json('shapes', 'assets/sprites/spriteshapes.json');

		loadBGM(this);
		Item.preload(this);
		this.loadScenes();
	}

	create() {
		InputHandler.Instance().create(this);
		this.scene.run(SCENE_NAMES.MainMenu);

		this.add.image(WINDOW_WIDTH/2, WINDOW_HEIGHT/2, GOD_SEES_ALL_BG.key).setScale(1.5).setAlpha(.2).setDepth(1);

		this.game.events.on(Phaser.Core.Events.BLUR, () => this.pause());
		this.game.events.on(Phaser.Core.Events.FOCUS, () => this.resume());
	}

	private loadScenes(){
		this.scene.add(SCENE_NAMES.HUD, HUDScene);
		this.scene.add(SCENE_NAMES.Stage1_Gameplay, GameplayStage1);
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