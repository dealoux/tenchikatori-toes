import Phaser, { Input, Scene } from 'phaser';
import { Dialog, DialogUpdateAction } from '../objects/Dialog';
import { DEFAULT_DIALOG_LINE_CREATE_OPTS } from '../objects/DialogLine';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from '../constants';
import { Player } from '../entities/Player';
import { IEntity } from '../entities/Entity';
import { InputHandler, INPUTSTRINGS } from '../plugins/InputHandler';
import eventsCenter from '../plugins/EventsCentre';
import GameplayStage1 from './stages/GameplayStage1';

export default class MainMenu extends Scene {
	constructor() {
		super('MainMenu');
	}

	preload() {
		
	}

	create() {
		this.stage1();
	}

	update() {
	}
	
	stage1(){
		this.scene.add('Stage1_Gameplay', GameplayStage1);
		this.scene.start('Stage1_Gameplay');

		eventsCenter.emit('stage1_starts');
	}
}