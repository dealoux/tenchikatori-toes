import { DialogLine, DialogLineState, DialogLineUpdateAction } from "./DialogLine";

export interface DialogCreateOpts {
	x: number;
	y: number;
	width: number;
	size: number;
	step: number;
	text: string[];
}
export interface DialogUpdateOpts {
	dialogUpdate?: DialogUpdateAction;
}

export enum DialogUpdateAction {
	NOOP,
	PROGRESS,
}

export class Dialog extends Phaser.GameObjects.Container {

	static preload = DialogLine.preload;

	lines: IDialogLine[] = [];
	text: string[];
	size: number;
	step: number;
	nextPos: Phaser.Math.Vector2;

	constructor(scene: Phaser.Scene, { x, y, width, size, step, text }: DialogCreateOpts) {
		super(scene);
		this.text = text;
		this.width = width;
		this.size = size;
		this.step = step;
		this.nextPos = new Phaser.Math.Vector2(0, 0);
	}

	update<T extends DialogUpdateOpts>(scene: Phaser.Scene, { dialogUpdate }: T) {
		if (dialogUpdate === DialogUpdateAction.PROGRESS) {
			const { length } = this.lines;
			if (length > 0) {
				const lastLineState = this.lines[length - 1].state;
				this.lines[length - 1].update(scene, { dialogLineUpdate: DialogLineUpdateAction.FORCE_NEXT_STATE });
				if (lastLineState === DialogLineState.ACTIVATING) {
					return;
				}
			}
			// When all the lines have been displayed and we want to progress,
			//   progress means destroying the dialog.
			if (length === this.text.length) {
				this.destroy();
				return;
			}
			const dialogLine = scene.add.dialogLine({ ...this.nextPos, width: this.width, size: 32, step: 100, text: this.text[length] });
			this.lines.push(dialogLine);
			this.nextPos.y += dialogLine.getBounds().height;
		}
	}

	destroy(fromScene?: boolean): void {
		this.lines.forEach((line) => line.destroy(fromScene));
		super.destroy(fromScene);
	}
}

Phaser.GameObjects.GameObjectFactory.register('dialog', function (this: Phaser.GameObjects.GameObjectFactory, opts: DialogCreateOpts) {
	const dialog = new Dialog(this.scene, opts);
	this.displayList.add(dialog);

	return dialog;
});
