import { DEFAULT_DIALOG_LINE_CREATE_OPTS } from '../../objects/DialogLine';
import { GameplayScene } from '../Gameplay';
import { ITexture } from '../UI';
import { FONT_NOKIA, GAMEPLAY_SIZE, SCENE_NAMES } from '../../constants';
import { BGM, playAudio } from '../../plugins/Audio';
import { Chilno } from '../../entities/characters/enemies/bosses/EnemyBoss_Chilno';
import { DATA_YOUSEI1, SDATA_SPAWN_YOUSEI1, Yousei1 } from '../../entities/characters/enemies/mobs/Enemy_Yousei1';
import { SDATA_SPAWN_YOUSEI2, Yousei2, Yousei31 } from '../../entities/characters/enemies/mobs/Enemy_Yousei2';
import { Entity } from '../../entities/Entity';

const BG_SKY: ITexture = { key: 'sky', path: 'assets/sprites/touhou_test/sky.png' }

//#region Dialogues
const chant: Array<IDialogText> = [
	{ text: 'Jinzou Faiya Faibo Waipa', font: FONT_NOKIA.key } , 
	{ text: 'Taiga, Taiga, T-T-T-T-Taiga', font: FONT_NOKIA.key } ,
	{ text: 'Chape Ape Kara Kina', font: FONT_NOKIA.key } ,
	{ text: 'Chape Ape Kara Kina', font: FONT_NOKIA.key } ,
	{ text: 'Myouhontusuke', font: FONT_NOKIA.key } ,
	{ text: '*Clap*', font: FONT_NOKIA.key } ,
	{ text: '*Waipa*', font: FONT_NOKIA.key, swapChar: true } ,
];

const chant2: Array<IDialogText> = [
	{ text: 'Faiya, Faiya', font: FONT_NOKIA.key } , 
	{ text: 'Tora Tora Kara Kina', font: FONT_NOKIA.key } ,
	{ text: 'Chape Ape Fama', font: FONT_NOKIA.key } ,
	{ text: 'Ama Ama Jyasupa', font: FONT_NOKIA.key } ,
	{ text: 'Tora Taiga, Tora Taiga', font: FONT_NOKIA.key } ,
	{ text: 'Jinzou Sen\'i Iettaiga', font: FONT_NOKIA.key } ,
];
//#endregion

export default class GameplayStage1 extends GameplayScene {	
	constructor() {
		super(SCENE_NAMES.Stage1_Gameplay);
	}

	preload() {
		super.preload();
		Chilno.preload(this);
		this.load.image(BG_SKY.key, BG_SKY.path);
	}

	create() {
		super.create();

		this.bgm = playAudio(this, BGM.god_sees_wish_of_this_mystia, .2, true);
		this.background = this.add.tileSprite(0, 0, GAMEPLAY_SIZE.WIDTH, GAMEPLAY_SIZE.HEIGHT, BG_SKY.key).setOrigin(0, 0).setDepth(-1).setAlpha(.8);

		this.cutsceneState.init();
		this.addBossDialog(chant);
		this.addPlayerDialog(chant2);

		this.currSpeakerDialog = this.dialogBoss;
		this.nextDialog();

		this.stateMachine.initialize(this.interactiveState);

		this.initMob();

		this.time.delayedCall(1500, () => {
			this.handleMob();
		}, [], this);
	}

	update(time: number, delta: number) {
		super.update(time, delta);
		this.backgroundScroll(.8);
	}

	updateInteractive(time: number, delta: number): void {
		super.updateInteractive(time, delta);
		this.boss?.update(time, delta);
	}

	protected async initMob(){
		this.mobManager?.addGroup('yousei1', Yousei1, 8);
		this.mobManager?.addGroup('yousei2', Yousei2, 3);
		this.mobManager?.addGroup('yousei3', Yousei31, 3);

		this.mobManager?.pList.forEach(eGroup => {
			this.player?.projectileManager.pList.forEach(pGroup => {
				this.physics.add.overlap(eGroup, pGroup, this.callBack_hitEnemyMob, undefined, this);
			});
			this.physics.add.overlap(this.player?.hitbox as Entity, eGroup, this.callBack_hitPlayerEnemy, undefined, this);
		});
	}

	protected async handleMob(){
		this.time.delayedCall(100, () => {
			this.mobManager?.spawnGroup('yousei1', {x: GAMEPLAY_SIZE.WIDTH + 100, y: 50}, {x: 50, y: 30}, {x: -DATA_YOUSEI1.speed!, y: 0}, 4);
		}, [], this);

		this.time.delayedCall(10000, () => {
			this.mobManager?.spawnInstance('yousei2');
		}, [], this);

		this.time.delayedCall(15000, () => {
			this.mobManager?.spawnInstance('yousei3');
		}, [], this);

		this.time.delayedCall(20000, () => {
			this.mobManager?.spawnGroup('yousei1', {x: 0 - 100, y: 50}, {x: 50, y: 30}, {x: DATA_YOUSEI1.speed!, y: 0}, 4);
		}, [], this);

		this.time.delayedCall(30000, () => {
			this.mobManager?.spawnInstance('yousei2');
			this.mobManager?.spawnInstance('yousei3');
		}, [], this);

		this.time.delayedCall(35000, () => {
			this.mobManager?.spawnGroup('yousei1', {x: GAMEPLAY_SIZE.WIDTH + 100, y: 50}, {x: 50, y: 30}, {x: -DATA_YOUSEI1.speed!, y: 0}, 4);
			this.mobManager?.spawnGroup('yousei1', {x: 0 - 100, y: 50}, {x: 50, y: 30}, {x: DATA_YOUSEI1.speed!, y: 0}, 4);
		}, [], this);

		this.time.delayedCall(50000, () => {
			this.handleBoss();
		}, [], this);
	}

	protected handleBoss(){
		this.boss = new Chilno(this);

		this.player?.projectileManager.pList.forEach(pGroup => {
			this.physics.add.overlap(this.boss as Chilno, pGroup, this.callBack_hitEnemyMob, undefined, this);
		});
		this.physics.add.overlap(this.player?.hitbox as Entity, this.boss, this.callBack_hitPlayerEnemy, undefined, this);

		this.stateMachine.changeState(this.cutsceneState);
	}
}
