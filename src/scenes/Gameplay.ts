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
import { BaseScene, SceneState } from './BaseScene';
import { StateMachine } from '../plugins/StateMachine';

class SceneState_Interactive extends SceneState{
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
		this.scene.gameplayUpdate(time, delta);
	}
}

class SceneState_Cutscene extends SceneState{
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
	}
}

export abstract class GameplayScene extends BaseScene {
	dialog?: IDialog;
	player?: Player;
	mobManager?: PoolManager;
	bgm?: Phaser.Sound.BaseSound;
	background?: Phaser.GameObjects.TileSprite;
	stateMachine: StateMachine;
	interactiveState: SceneState;
	cutsceneState: SceneState;

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

		this.input.on('pointerdown', () => {
			this.dialog?.update(this, { dialogUpdate: DialogUpdateAction.PROGRESS });
		});

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

	gameplayUpdate(time: number, delta: number){
		this.dialog?.update(this, {});
		this.player?.update(time, delta);

		const {inputs} = InputHandler.Instance();

		if(inputs.Pause){
			playAudio(this, SFX.pause_resume);
			// this.scene.switch(SCENE_NAMES.PauseMenu);
			this.scene.pause();
			this.scene.launch(SCENE_NAMES.PauseMenu);
			eventsCenter.emit(GAMEPLAY_EVENTS.gameplayPause, SCENE_NAMES.Stage1_Gameplay);
		}

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