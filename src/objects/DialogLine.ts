import { WINDOW_HEIGHT, WINDOW_WIDTH } from "../constants";
import Phaser from 'phaser';

const VERY_LONG_TIME = 1000 * 30; // 30 mins
//const VERY_LONG_TIME = 1000 * 60 * 30; // 30 mins
const VERY_FAR_AWAY = WINDOW_HEIGHT * 5;

export interface DialogLineCreateOpts {
	x: number;
	y: number;
	width: number;
	size: number;
	step: number;
	text: string;
}

export enum DialogLineState {
	ACTIVATING, // the line is animating to progressively show text
	ACTIVE, // the line is showing all its text, and it is the active line
	DEACTIVATED, // the line is showing all its text, and it is no longer the active line
};

export enum DialogLineUpdateAction {
	NOOP,
	FORCE_NEXT_STATE,
}

type DisplayCallbackFactory = (params: {
	timerEvent: Phaser.Time.TimerEvent,
	step: number,
	lastI: number,
	getState: () => DialogLineState,
	transitionState: () => void,
}) => Phaser.Types.GameObjects.BitmapText.DisplayCallback;

const displayCallbackFactory: DisplayCallbackFactory = ({ timerEvent, step, lastI, getState, transitionState }): Phaser.Types.GameObjects.BitmapText.DisplayCallback => (display) => {
	switch (getState()) {
	case DialogLineState.ACTIVATING:
		// hide letter while it's still animating and not time for it to show
		if (timerEvent.getElapsed() < step * display.index) {
			display.y += VERY_FAR_AWAY;
		// when it's time for the last character to show, transition state.
		} else if (display.index === lastI) {
			transitionState();
		}
		break;
	case DialogLineState.ACTIVE:
		if (display.index === lastI) {
			if (timerEvent.getElapsed() >= 1000) {
				display.y += VERY_FAR_AWAY;
			}
		}
		break;
	case DialogLineState.DEACTIVATED:
		if (display.index === lastI) {
			display.y += VERY_FAR_AWAY;
		}
		break;
	}
	return display;
};

export const DEFAULT_DIALOG_LINE_CREATE_OPTS: DialogLineCreateOpts = {
	x: WINDOW_WIDTH / 8,
	y: WINDOW_HEIGHT / 8,
	width: WINDOW_WIDTH * 3 / 4,
	size: 32,
	step: 100,
	text: 'Lorem ipsum dolor sit amet.',
};

export interface DialogLineUpdateOpts {
	dialogLineUpdate?: DialogLineUpdateAction;
}

export class DialogLine extends Phaser.GameObjects.Container implements IDialog {
	text: Phaser.GameObjects.DynamicBitmapText;
	private timerEvent: Phaser.Time.TimerEvent;
	state: DialogLineState = DialogLineState.ACTIVATING;

	static preload(scene: Phaser.Scene) {
		scene.load.bitmapFont('inter', 'assets/fonts/inter-regular-outline-2_0.png', 'assets/fonts/inter-regular-outline-2.fnt');
	}

	constructor(scene: Phaser.Scene, { x, y, width, size, step, text }: DialogLineCreateOpts) {
		super(scene);

		const timerEvent = scene.time.addEvent({ delay: VERY_LONG_TIME, repeat: 0 });
		this.timerEvent = timerEvent;

		const lastI = text.length;
		const textToRender = `${text}‣`;
		const textObject = scene.add.dynamicBitmapText(x, y, 'inter', textToRender, size);
		textObject.setMaxWidth(width);
		textObject.setDisplayCallback(displayCallbackFactory({ timerEvent, step, lastI, getState: () => this.state, transitionState: this.transitionState.bind(this) }));
		this.text = textObject;
	}

	update<T extends DialogLineUpdateOpts>(scene: Phaser.Scene, { dialogLineUpdate }: T) {
		if (dialogLineUpdate === DialogLineUpdateAction.FORCE_NEXT_STATE) {
			this.transitionState();
		}
	}

	transitionState() {
		switch (this.state) {
		case DialogLineState.ACTIVATING:
			this.state = DialogLineState.ACTIVE;
			this.timerEvent.reset({
				loop: true,
				delay: 2000,
			});
			break;
		case DialogLineState.ACTIVE:
			this.state = DialogLineState.DEACTIVATED;
			this.timerEvent.destroy();
		}
	}

	getBounds(output?: Phaser.Geom.Rectangle): Phaser.Geom.Rectangle {
		const { global } = this.text.getTextBounds();
		const rectangle = output || new Phaser.Geom.Rectangle();
		rectangle.setTo(global.x, global.y, global.width, global.height);
		return rectangle;
	}

	destroy(fromScene?: boolean): void {
		this.text.destroy();
		this.timerEvent?.destroy();
		super.destroy(fromScene);
	}
}

Phaser.GameObjects.GameObjectFactory.register('dialogLine', function (this: Phaser.GameObjects.GameObjectFactory, opts: DialogLineCreateOpts) {
	const dialogLine = new DialogLine(this.scene, opts);
	this.displayList.add(dialogLine);

	return dialogLine;
});
