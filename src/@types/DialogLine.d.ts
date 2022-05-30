declare interface IDialogLineCreateOpts {
	x: number;
	y: number;
	width: number;
	size: number;
	step: number;
	text: string;
}

declare interface IDialogLine extends Phaser.GameObjects.Container {
}

declare namespace Phaser.GameObjects {
	interface GameObjectFactory {
		dialogLine(opts: IDialogLineCreateOpts): IDialogLine;
	}
}
