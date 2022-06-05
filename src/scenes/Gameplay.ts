import Phaser, { Scene } from 'phaser';
import { Dialog, DialogUpdateAction } from '../objects/Dialog';
import { DEFAULT_DIALOG_LINE_CREATE_OPTS } from '../objects/DialogLine';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from '../constants';
import { Player } from '../entities/Player';
import { IEntity } from '../entities/Entity';

export default class GameplayScene extends Scene {
	dialog?: IDialog;
	player?: Player;

	constructor(name: string) {
		super(name);
	}

	preload() {
		Dialog.preload(this);
		Player.preload(this);
	}

	create() {
		this.input.on('pointerdown', () => {
			this.dialog?.update(this, { dialogUpdate: DialogUpdateAction.PROGRESS });
		});

		this.player = new Player(this, { pos: new Phaser.Math.Vector2(WINDOW_WIDTH/2, WINDOW_HEIGHT/2), texture: 'enna' } );
	}

	update() {
		this.dialog?.update(this, {});
		this.player?.update();
	}
}
