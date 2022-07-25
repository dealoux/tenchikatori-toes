import { GameplayScene } from '../Gameplay';
import { BGM, playAudio } from '../../plugins/Audio';
import { GAMEPLAY_SIZE, SCENE_NAMES } from '../../constants';
import { ITexture } from '../UI';
import { SDATA_SPAWN_YOUSEI3, SDATA_SPAWN_YOUSEI4, Yousei3, Yousei4 } from '../../entities/characters/enemies/mobs/Enemy_YouseiTest';
import { IVectorPoint } from '../../entities/Entity';
import { DEMO_EVENTS, eventsCenter } from '../../plugins/EventsCentre';

const BG_FIELD: ITexture = { key: 'field', path: 'assets/sprites/touhou_test/field.png' }

export default class GameplayStage2 extends GameplayScene {
	yousei3?: Yousei3;
	yousei4?: Yousei4;

	constructor() {
		super(SCENE_NAMES.Stage2_Gameplay);
	}

	preload() {
		super.preload();
		this.load.image(BG_FIELD.key, BG_FIELD.path);
	}

	create() {
		super.create();

		this.bgm = playAudio(this, BGM.god_sees_wish_of_this_mystia, .2, true);
		this.background = this.add.tileSprite(0, 0, GAMEPLAY_SIZE.WIDTH, GAMEPLAY_SIZE.HEIGHT, BG_FIELD.key).setOrigin(0, 0).setDepth(-1).setAlpha(.8);

		this.handleMob();
	}

	update(time: number, delta: number) {
		super.update(time, delta);
		this.backgroundScroll(.8);
	}

	updateInteractive(time: number, delta: number): void {
		super.updateInteractive(time, delta);
	}

	protected async handleMob(){
		this.mobManager?.addGroup('yousei3', Yousei3, 4);
		this.mobManager?.addGroup('yousei4', Yousei4, 4);

		this.spawnY3();
		this.spawnY4();

		this.player?.projectileManager.pList.forEach(pGroup => {
			this.mobManager?.pList.forEach(eGroup => {
				this.physics.add.overlap(eGroup, pGroup, this.callBack_hitEnemyMob, undefined, this);
			});
		});

		eventsCenter.on(DEMO_EVENTS.stage2_spawn, this.spawnY3, this);
		eventsCenter.on(DEMO_EVENTS.stage2_spawn2, this.spawnY4, this);
	}

	updateGroup(name: string, spawnPoint: IVectorPoint){
		this.mobManager?.spawnInstance(name, spawnPoint);
	}

	spawnY3(){
		if(!this.mobManager?.getGroup('yousei3')?.getFirstAlive())
			this.time.delayedCall(4000, () => { this.mobManager?.spawnInstance('yousei3', SDATA_SPAWN_YOUSEI3.spawnPoint) }, [], this)
			
	}

	spawnY4(){
		if(!this.mobManager?.getGroup('yousei4')?.getFirstAlive())
			this.time.delayedCall(4000, () => { this.mobManager?.spawnInstance('yousei4', SDATA_SPAWN_YOUSEI4.spawnPoint) }, [], this)
	}
}
