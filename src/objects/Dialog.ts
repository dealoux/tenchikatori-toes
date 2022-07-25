import { CUTSCENE_EVENTS, eventsCenter } from "../plugins/EventsCentre";
import { DialogLine, DialogLineState, DialogLineUpdateAction } from "./DialogLine";

export interface DialogCreateOpts {
	pos: Phaser.Math.Vector2;
	bounds: Phaser.Types.Math.Vector2Like;
	size: number;
	step: number;
	dialog: IDialogText[];
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
	dialog: IDialogText[];
	size: number;
	step: number;
	nextPos: Phaser.Math.Vector2;
	bounds: Phaser.Types.Math.Vector2Like;

	constructor(scene: Phaser.Scene, { pos, bounds, size, step, dialog }: DialogCreateOpts) {
		super(scene);
		this.dialog = dialog;
		this.bounds = bounds;
		this.size = size;
		this.step = step;
		this.nextPos = pos;
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
			if (length === this.dialog.length) {
				if(this.dialog[length-1].swapChar){
					eventsCenter.emit(CUTSCENE_EVENTS.changeSpeaker);
				}

				this.destroy();

				eventsCenter.emit(CUTSCENE_EVENTS.dialogEnds);
				return;
			}
			const dialogLine = scene.add.dialogLine({ pos: this.nextPos, bounds: this.bounds, size: this.size, step: this.step, dialog: this.dialog[length] });
			if(this.nextPos.y + dialogLine.getBounds().height < this.bounds.y!){
				this.nextPos.y += dialogLine.getBounds().height;
			}
			else{
				this.destroy();
			}
			this.lines.push(dialogLine);
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