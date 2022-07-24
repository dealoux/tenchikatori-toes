import Phaser from 'phaser';
import { Dialog, DialogUpdateAction } from '../objects/Dialog';
import { CHILNO_STAND, ENNA_STAND, SCENE_NAMES, TEXT_BOX } from '../constants';
import { eventsCenter, GAMEPLAY_EVENTS } from '../plugins/EventsCentre';
import { InputHandler } from '../plugins/InputHandler';
import { playAudio, SFX } from '../plugins/Audio';
import { IState } from '../plugins/StateMachine';
import { GameplayScene } from './Gameplay';
import { IVectorPoint } from '../entities/Entity';

export class GameplayState implements IState{
    scene: GameplayScene;
    enterTime: number;

    constructor(scene: GameplayScene){
        this.scene = scene;
        this.enterTime = 0;
    }

	init(){ }

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

export interface ICutsceneCharacterData{
	key: string,
	scale: Phaser.Types.Math.Vector2Like,
	point: IVectorPoint,
}

export interface ICutsceneData{
	rightChar: ICutsceneCharacterData,
	leftChar: ICutsceneCharacterData,
}

export const TEST_CUTSCENE: ICutsceneData = {
	rightChar: { key: ENNA_STAND.key, scale: {x: .17, y: .17}, point: { pos: new Phaser.Math.Vector2(1200, 740) } },
	leftChar: { key: CHILNO_STAND.key, scale: {x: 1, y: 1}, point: { pos: new Phaser.Math.Vector2(150, 680) } }
}

export class SceneState_Cutscene extends GameplayState{
	sData: ICutsceneData;
	leftChar?: Phaser.GameObjects.Image;
	rightChar?: Phaser.GameObjects.Image;
	leftTextBox?: Phaser.GameObjects.Image;
	rightTextBox?: Phaser.GameObjects.Image;

	constructor(scene: GameplayScene){
		super(scene);
		this.sData = TEST_CUTSCENE;
	}

	init(){
		this.leftChar = this.addChar(this.sData.leftChar).setVisible(false);
		this.rightChar = this.addChar(this.sData.rightChar).setVisible(false);
		this.leftTextBox = this.scene.add.image(480, 600, TEXT_BOX.key).setScale(.2, .3).setVisible(false);
		this.rightTextBox = this.scene.add.image(870, 600, TEXT_BOX.key).setScale(.2, .3).setVisible(false);
	}

	enter(): void {
		super.enter();
		this.scene.mobManager?.pauseUpdate();
		this.scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.dialogUpdate, this);

		this.leftChar?.setVisible(true);
		this.rightChar?.setVisible(true);
		this.leftTextBox?.setVisible(true);
		this.rightTextBox?.setVisible(true);
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

	private addChar(charData: ICutsceneCharacterData){
		return this.scene.add.image(charData.point.pos.x, charData.point.pos.y, charData.key).setScale(charData.scale.x!, charData.scale.y!);
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