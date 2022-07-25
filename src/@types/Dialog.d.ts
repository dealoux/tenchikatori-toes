declare interface IDialogCreateOpts {
	pos: Phaser.Math.Vector2;
	bounds: Phaser.Types.Math.Vector2Like;
	size: number;
	step: number;
	dialog: IDialogText[];
}

declare interface IDialog extends Phaser.GameObjects.Container {
}

declare namespace Phaser.GameObjects {
	interface GameObjectFactory {
		dialog(opts: IDialogCreateOpts): IDialog;
	}
}