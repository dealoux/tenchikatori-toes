import Phaser, { Scene } from 'phaser';
import { IState } from '../plugins/StateMachine';

export class BaseScene extends Scene{
    constructor(sceneName: string) {
		super(sceneName);
	}

    create(){
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.onShutdown, this);
    }

    gameplayUpdate(time: number, delta: number){

    }

    protected onShutdown(){ }
}

export class SceneState implements IState{
    scene: BaseScene;
    enterTime: number;

    constructor(scene: BaseScene){
        this.scene = scene;
        this.enterTime = 0;
    }

    enter(): void {
        this.enterTime = this.scene.game.getTime();
    }

    exit(): void { }

    update(time: number, delta: number): void { }

    preUpdate(time: number, delta: number): void { }
}