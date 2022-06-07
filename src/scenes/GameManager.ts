import Phaser, { Input, Scene } from 'phaser';
import { Dialog, DialogUpdateAction } from '../objects/Dialog';
import { DEFAULT_DIALOG_LINE_CREATE_OPTS } from '../objects/DialogLine';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from '../constants';
import { Player } from '../entities/Player';
import { IEntity } from '../entities/Entity';
import { InputHandler, InputStrings } from '../plugins/InputHandler';
import eventsCenter from '../plugins/EventsCentre';

export default class GameManager extends Scene {
	constructor() {
		super('GameManager');
		new InputHandler(this);
	}

	preload() {
		this.load.image('empty', 'assets/sprites/empty.png');
	}

	create() {
		InputHandler.Instance().create(this);
		this.scene.run('MainMenu');

		eventsCenter.on('stage1_starts', () => console.log('stage 1 starts'));
	}

	update() {
		InputHandler.Instance().update(this);

		// this.events.on('up', () => {this.inputs.up = true}, this);
		// this.events.on('down', () => {this.inputs.down = true}, this);
		// this.events.on('left', () => {this.inputs.left = true}, this);
		// this.events.on('right', () => {this.inputs.right = true}, this);

		// this.events.once('off')
	}
}