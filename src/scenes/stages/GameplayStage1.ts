import { DEFAULT_DIALOG_LINE_CREATE_OPTS } from '../../objects/DialogLine';
import { GameplayScene } from '../Gameplay';
import { ITexture } from '../UI';
import { FONT_NOKIA, GAMEPLAY_SIZE, SCENE_NAMES } from '../../constants';
import { BGM, playAudio } from '../../plugins/Audio';
import { Chilno } from '../../entities/characters/enemies/bosses/EnemyBoss_Chilno';
import { DATA_YOUSEI1, SDATA_SPAWN_YOUSEI1, Yousei1 } from '../../entities/characters/enemies/mobs/Enemy_Yousei1';
import { SDATA_SPAWN_YOUSEI2, Yousei2 } from '../../entities/characters/enemies/mobs/Enemy_Yousei2';

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

const chant2 = [
	{ text: 'Faiya, Faiya', font: FONT_NOKIA.key } , 
	{ text: 'Tora Tora Kara Kina', font: FONT_NOKIA.key } ,
	{ text: 'Chape Ape Fama', font: FONT_NOKIA.key } ,
	{ text: 'Ama Ama Jyasupa', font: FONT_NOKIA.key } ,
	{ text: 'Tora Taiga, Tora Taiga', font: FONT_NOKIA.key } ,
	{ text: 'Jinzou Sen\'i Iettaiga', font: FONT_NOKIA.key } ,
];
//#endregion

export default class GameplayStage1 extends GameplayScene {
	chilno?: Chilno;
	
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

		this.handleBoss();
		this.handleMob();

		this.cutsceneState.init();

		this.addPlayerDialog(chant2);
		this.addBossDialog(chant);

		this.currSpeakerDialog = this.dialogBoss;
		this.nextDialog();

		this.stateMachine.initialize(this.cutsceneState);
	}

	update(time: number, delta: number) {
		super.update(time, delta);
		this.backgroundScroll(.8);
	}

	updateInteractive(time: number, delta: number): void {
		super.updateInteractive(time, delta);
		this.chilno?.update(time, delta);
	}

	protected async handleMob(){
		this.mobManager?.addGroup('yousei1', Yousei1, 6);
		this.mobManager?.addGroup('yousei2', Yousei2, 4);

		this.mobManager?.spawnGroup('yousei1', {x: GAMEPLAY_SIZE.WIDTH + 100, y: 50}, {x: 50, y: 30}, {x: -DATA_YOUSEI1.speed!, y: 0}, 4)

		this.mobManager?.spawnInstance('yousei2', SDATA_SPAWN_YOUSEI2.spawnPoint);
		// this.mobManager?.spawnInstance('yousei1', SDATA_SPAWN_YOUSEI1.targetPoint);

		this.player?.projectileManager.pList.forEach(pGroup => {
			this.physics.add.overlap(this.chilno as Chilno, pGroup, this.callBack_hitEnemyMob, undefined, this);
			this.mobManager?.pList.forEach(eGroup => {
				this.physics.add.overlap(eGroup, pGroup, this.callBack_hitEnemyMob, undefined, this);
			});
		});
	}

	protected handleBoss(){
		this.chilno = new Chilno(this);
	}
}
