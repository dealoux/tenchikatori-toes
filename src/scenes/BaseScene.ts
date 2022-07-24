import Phaser, { Scene } from 'phaser';

export class BaseScene extends Scene{
    constructor(sceneName: string) {
		super(sceneName);
	}

    create(){
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.onShutdown, this);
    }

    protected onShutdown(){ }
}