import Phaser, { Scene } from 'phaser';
import eventsCenter from '../plugins/EventsCentre';
import GameplayStage1 from './stages/GameplayStage1';
import { SCENE_NAMES } from './GameManager';

export default class MainMenu extends Scene {
	constructor() {
		super(SCENE_NAMES.MainMenu);
	}

	preload() {
		
	}

	create() {
		this.stage1();
	}

	update() {
	}
	
	stage1(){
		this.scene.add(SCENE_NAMES.Stage1_Gameplay, GameplayStage1);
		this.scene.start(SCENE_NAMES.Stage1_Gameplay);

		eventsCenter.emit('stage1_starts');
	}
}