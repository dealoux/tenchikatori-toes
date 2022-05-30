declare interface IDialogCreateOpts {
	x: number;
	y: number;
	width: number;
	size: number;
	step: number;
	text: string[];
}

declare interface IDialog extends Phaser.GameObjects.Container {
}

declare namespace Phaser.GameObjects {
	interface GameObjectFactory {
		dialog(opts: IDialogCreateOpts): IDialog;
	}
}
