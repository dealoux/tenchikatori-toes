import Phaser from 'phaser';
import { DialogUpdateAction } from '../objects/Dialog';
import { CHILNO_STAND, ENNA_STAND, FONT_NOKIA, SCENE_NAMES, TEXT_BOX } from '../constants';
import { CUTSCENE_EVENTS, eventsCenter, GAMEPLAY_EVENTS } from '../plugins/EventsCentre';
import { InputHandler } from '../plugins/InputHandler';
import { playAudio, SFX } from '../plugins/Audio';
import { IState } from '../plugins/StateMachine';
import { GameplayScene } from './Gameplay';
import { IVectorPoint } from '../entities/Entity';
import { DialogLineCreateOpts } from '../objects/DialogLine';
import { emptyFunction, IFunctionDelegate } from '../plugins/Utilities';

export class GameplayState implements IState{
    scene: GameplayScene;
    enterTime: number;

    constructor(scene: GameplayScene){
        this.scene = scene;
        this.enterTime = 0;
    }

	// init(){ }

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
	spawnPoint: IVectorPoint,
}

export interface ITextboxData{
	point: IVectorPoint,
	scale: Phaser.Types.Math.Vector2Like,
}

export interface ICutsceneData{
	rightChar: ICutsceneCharacterData,
	leftChar: ICutsceneCharacterData,
}

export const TEST_CUTSCENE: ICutsceneData = {
	rightChar: { key: ENNA_STAND.key, scale: {x: .17, y: .17}, point: { pos: new Phaser.Math.Vector2(1200, 740) }, spawnPoint: { pos: new Phaser.Math.Vector2(1500, 740) } },
	leftChar: { key: CHILNO_STAND.key, scale: {x: 1, y: 1}, point: { pos: new Phaser.Math.Vector2(150, 680) }, spawnPoint: { pos: new Phaser.Math.Vector2(-150, 740) } }
}

export const TEXT_BOX_LEFT: ITextboxData = { point: {pos: new Phaser.Math.Vector2(480, 600)}, scale: { x:.2, y: .3 }, }
export const TEXT_BOX_RIGHT: ITextboxData = { point: {pos: new Phaser.Math.Vector2(870, 600)}, scale: { x:.2, y: .3 }, }
const TEXT_BOX_WIDTH = 1920 * TEXT_BOX_LEFT.scale.x! - 20;

export const TEXT_LEFT = new Phaser.Math.Vector2(TEXT_BOX_LEFT.point.pos.x! - TEXT_BOX_WIDTH/2 + 4, TEXT_BOX_LEFT.point.pos.y! - 12);
export const TEXT_RIGHT = new Phaser.Math.Vector2(TEXT_BOX_RIGHT.point.pos.x! - TEXT_BOX_WIDTH/2 + 4, TEXT_BOX_LEFT.point.pos.y! - 12);

export const TEXT_OPTS: DialogLineCreateOpts = {
	pos: Phaser.Math.Vector2.ZERO,
	bounds: { x: TEXT_BOX_WIDTH, y: 0 },
	size: 24,
	step: 100,
	dialog: { text: 'Lorem ipsum dolor sit amet.', font: FONT_NOKIA.key},
};

export class SceneState_Cutscene extends GameplayState{
	sceneUpdateDelegate: IFunctionDelegate;
	sData: ICutsceneData;
	leftChar?: Phaser.GameObjects.Image;
	rightChar?: Phaser.GameObjects.Image;
	leftTextBox?: Phaser.GameObjects.Image;
	rightTextBox?: Phaser.GameObjects.Image;

	currChar?: Phaser.GameObjects.Image;
	currTextBox?: Phaser.GameObjects.Image;

	constructor(scene: GameplayScene){
		super(scene);
		this.sData = TEST_CUTSCENE;
		this.sceneUpdateDelegate = emptyFunction;
	}

	init(right = false){
		this.leftChar = this.addChar(this.sData.leftChar).setVisible(false);
		this.rightChar = this.addChar(this.sData.rightChar).setVisible(false);
		this.leftTextBox = this.scene.add.image(TEXT_BOX_LEFT.point.pos.x!, TEXT_BOX_LEFT.point.pos.y!, TEXT_BOX.key).setScale(TEXT_BOX_LEFT.scale.x!, TEXT_BOX_LEFT.scale.y!).setVisible(false);
		this.rightTextBox = this.scene.add.image(TEXT_BOX_RIGHT.point.pos.x!, TEXT_BOX_RIGHT.point.pos.y!, TEXT_BOX.key).setScale(TEXT_BOX_RIGHT.scale.x!, TEXT_BOX_RIGHT.scale.y!).setVisible(false);

		if(right){
			this.currChar = this.rightChar;
			this.currTextBox = this.rightTextBox;
		}
		else{
			this.currChar = this.leftChar;
			this.currTextBox = this.leftTextBox;
		}
	}

	enter(): void {
		super.enter();
		this.scene.mobManager?.pauseUpdate();
		this.scene.clearActiveProjectiles();
		this.scene.player?.stateMachine.changeState(this.scene.player.disableInteractiveState);

		this.setStatus(true);
		this.scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.dialogUpdate, this);
		eventsCenter.on(CUTSCENE_EVENTS.changeSpeaker, this.swapSpeaker, this);

		this.scene.time.delayedCall(2000, () => {
			this.scene.physics.pause();
		}, [], this);
	}

	exit(): void {
		super.exit();
		this.scene.mobManager?.resumeUpdate();
		this.scene.physics.resume();
		this.scene.player?.stateMachine.changeState(this.scene.player.interactiveState);

		this.leftChar?.setPosition(this.sData.leftChar.spawnPoint.pos.x, this.sData.leftChar.spawnPoint.pos.y);
		this.rightChar?.setPosition(this.sData.rightChar.spawnPoint.pos.x, this.sData.rightChar.spawnPoint.pos.y);

		this.leftChar?.setVisible(false);
		this.rightChar?.setVisible(false);
		this.leftTextBox?.setVisible(false);
		this.rightTextBox?.setVisible(false);

		this.scene.input.off(Phaser.Input.Events.POINTER_DOWN, this.dialogUpdate, this);
		eventsCenter.off(CUTSCENE_EVENTS.changeSpeaker, this.swapSpeaker);
	}

	update(time: number, delta: number): void {
		super.update(time, delta);
		this.sceneUpdateDelegate();
	}

	protected dialogUpdate(){
		this.scene.dialog?.update(this.scene, { dialogUpdate: DialogUpdateAction.PROGRESS });
	}

	protected sceneUpdate(){
		this.scene.dialog?.update(this.scene, {});

		const {inputs} = InputHandler.Instance();

		if(inputs.Shot){
			inputs.Shot = false;
			this.dialogUpdate();
		}
	}

	protected addChar(charData: ICutsceneCharacterData){
		return this.scene.add.image(charData.spawnPoint.pos.x, charData.spawnPoint.pos.y, charData.key).setScale(charData.scale.x!, charData.scale.y!);
	}

	protected swapSpeaker(){
		this.setStatus();

		if(this.currChar == this.rightChar){
			this.currChar = this.leftChar;
			this.currTextBox = this.leftTextBox;
		}
		else{
			this.currChar = this.rightChar;
			this.currTextBox = this.rightTextBox;
		}

		this.setStatus(true);
	}

	protected setStatus(value = false){
		this.currChar?.setVisible(value);
		
		if(value){
			let tempPoint = (this.currChar == this.rightChar) ? this.sData.rightChar.point : this.sData.leftChar.point;
			this.tweenMovement(this.currChar!, tempPoint, 2000, () => {
				this.currTextBox?.setVisible(value);
				this.sceneUpdateDelegate = this.sceneUpdate;
			}, () => { this.sceneUpdateDelegate = emptyFunction; });
		}
		else{
			let tempPoint = (this.currChar == this.rightChar) ? this.sData.rightChar.spawnPoint : this.sData.leftChar.spawnPoint;
			this.currChar?.setPosition(tempPoint.pos.x, tempPoint.pos.y);
			this.currTextBox?.setVisible(value);
		}
	}

	protected tweenMovement(target: Phaser.GameObjects.Image, point: IVectorPoint, duration: number, onComplete = emptyFunction, onStart = emptyFunction){
        this.scene.tweens.add({
            targets: target,
            x: point.pos.x,
            y: point.pos.y,
            duration: duration,
            ease: 'Sine.easeInOut',
            onStart: onStart,
            onComplete: onComplete,
        });
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