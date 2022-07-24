import Phaser from 'phaser';
import { Dialog, DialogUpdateAction } from '../objects/Dialog';
import { GAMEPLAY_SIZE, SCENE_NAMES } from '../constants';
import { Player } from '../entities/characters/player/Player';
import { Enemy } from '../entities/characters/enemies/Enemy';
import { Character } from '../entities/characters/Character';
import { Entity } from '../entities/Entity';
import { eventsCenter, GAMEPLAY_EVENTS } from '../plugins/EventsCentre';
import { InputHandler } from '../plugins/InputHandler';
import { playAudio, SFX } from '../plugins/Audio';
import { PoolManager } from '../plugins/Pool';
import { BaseScene } from './BaseScene';
import { IState, StateMachine } from '../plugins/StateMachine';

export abstract class GameplayScene extends BaseScene {
	dialog?: IDialog;
	player?: Player;
	mobManager?: PoolManager;
	bgm?: Phaser.Sound.BaseSound;
	background?: Phaser.GameObjects.TileSprite;
	stateMachine: StateMachine;
	interactiveState: GameplayState;
	cutsceneState: GameplayState;

	constructor(name: string) {
		super(name);
		this.stateMachine = new StateMachine();
		this.interactiveState = new SceneState_Interactive(this);
		this.cutsceneState  = new SceneState_Cutscene(this);
	}

	preload() {
		Player.preload(this);
		Enemy.preload(this);
	}

	create() {
		super.create();

		this.mobManager = new PoolManager(this);
		this.player = new Player(this);

		Enemy.initPManagers(this);
		Character.initManager(this);
		Entity.setWorldsEdge(this);

		this.cameras.main.setViewport(GAMEPLAY_SIZE.OFFSET, GAMEPLAY_SIZE.OFFSET, GAMEPLAY_SIZE.WIDTH, GAMEPLAY_SIZE.HEIGHT);
		this.physics.world.setBounds(0, 0, GAMEPLAY_SIZE.WIDTH, GAMEPLAY_SIZE.HEIGHT);

		this.events.on(Phaser.Scenes.Events.CREATE, this.onCreate, this);
		this.events.on(Phaser.Scenes.Events.SLEEP, this.onPause, this);
		this.events.on(Phaser.Scenes.Events.WAKE, this.onResume, this);
		this.events.on(Phaser.Scenes.Events.PAUSE, this.onPause, this);
		this.events.on(Phaser.Scenes.Events.RESUME, this.onResume, this);

		this.stateMachine.initialize(this.interactiveState);
	}

	update(time: number, delta: number) {
		this.stateMachine.currState().update(time, delta);
	}

	updateInteractive(time: number, delta: number){ 
		this.player?.update(time, delta);
	}

	protected backgroundScroll(speedY = 0, speedX = 0){
		this.background?.setTilePosition(this.background.tilePositionX + speedX, this.background.tilePositionY - speedY);
	}

	protected onCreate(){
		this.scene.run(SCENE_NAMES.HUD);
		eventsCenter.emit(GAMEPLAY_EVENTS.gameplayStart);
	}

	protected onPause(){
		this.scene.pause(SCENE_NAMES.HUD); 
		InputHandler.Instance().reset(); 
		eventsCenter.emit(GAMEPLAY_EVENTS.gameplayPause);
	}

	protected onResume(){
		this.scene.resume(SCENE_NAMES.HUD); 
		eventsCenter.emit(GAMEPLAY_EVENTS.gameplayResume);
	}

	protected onShutdown(){
		this.bgm?.stop();
		this.scene.stop(SCENE_NAMES.HUD); 
		InputHandler.Instance().reset(); 
		eventsCenter.emit(GAMEPLAY_EVENTS.gameplayEnd);
	}
}

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

class SceneState_Interactive extends GameplayState{
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

class SceneState_Cutscene extends GameplayState{
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