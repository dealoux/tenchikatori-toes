import Phaser, { Scene } from 'phaser';
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

		this.game.events.on(Phaser.Core.Events.BLUR, () => this.pause());
		this.game.events.on(Phaser.Core.Events.FOCUS, () => this.resume());
	}

	private pause(){
		InputHandler.Instance().reset();
	}

	private resume(){
		//InputHandler.Instance().reset();
	}

	update() {
		InputHandler.Instance().update(this);
	}
}