import Phaser from 'phaser';
import { Dialog, DialogUpdateAction } from '../objects/Dialog';
import { SCENE_NAMES } from '../constants';
import { eventsCenter, GAMEPLAY_EVENTS } from '../plugins/EventsCentre';
import { InputHandler } from '../plugins/InputHandler';
import { playAudio, SFX } from '../plugins/Audio';
import { IState } from '../plugins/StateMachine';
import { GameplayScene } from './Gameplay';

export class GameplayState implements IState{
    scene: GameplayScene;
    enterTime: number;

    constructor(scene: GameplayScene){
        this.scene = scene;
        this.enterTime = 0;
    }

    enter(): void {
        this.enterTime = this.scene.game.getTime();	
    }

    exit(): void { }

	preUpdate(time: number, delta: number): void { }

    update(time: number, delta: number): void {
		const {inputs} = InputHandler.Instance();

		if(inputs.Pause){
			playAudio(this.scene, SFX.pause_resume);
			// this.scene.switch(SCENE_NAMES.PauseMenu);
			this.scene.scene.pause();
			this.scene.scene.launch(SCENE_NAMES.PauseMenu);
			eventsCenter.emit(GAMEPLAY_EVENTS.gameplayPause, SCENE_NAMES.Stage1_Gameplay);
		}
	}

	protected changeState(nextState: IState, savePrevious = false){
        this.scene.stateMachine.changeState(nextState, savePrevious);
    }
}

export class SceneState_Interactive extends GameplayState{
	constructor(scene: GameplayScene){
		super(scene);
	}

	enter(): void {
		super.enter();
	}

	exit(): void {
		super.exit();
	}

	update(time: number, delta: number): void {
		super.update(time, delta);
		this.scene.updateInteractive(time, delta);
	}
}

export class SceneState_Cutscene extends GameplayState{
	constructor(scene: GameplayScene){
		super(scene);
	}

	enter(): void {
		super.enter();
		this.scene.mobManager?.pauseUpdate();
		this.scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.dialogUpdate, this);
	}

	exit(): void {
		super.exit();
		this.scene.mobManager?.resumeUpdate();
		this.scene.input.off(Phaser.Input.Events.POINTER_DOWN, this.dialogUpdate, this);
	}

	update(time: number, delta: number): void {
		super.update(time, delta);

		this.scene.dialog?.update(this.scene, {});

		const {inputs} = InputHandler.Instance();

		if(inputs.Shot){
			inputs.Shot = false;
			this.dialogUpdate();
		}
	}

	private dialogUpdate(){
		this.scene.dialog?.update(this.scene, { dialogUpdate: DialogUpdateAction.PROGRESS });
	}
}