declare interface IDialogLineCreateOpts {
	pos: Phaser.Math.Vector2;
	bounds: Phaser.Types.Math.Vector2Like;
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