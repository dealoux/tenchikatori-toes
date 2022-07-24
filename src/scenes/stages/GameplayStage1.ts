import { DEFAULT_DIALOG_LINE_CREATE_OPTS } from '../../objects/DialogLine';
import { GameplayScene } from '../Gameplay';
import { Enemy } from '../../entities/characters/enemies/Enemy';
import { DATA_SHOTBLUE, DATA_SHOTRED } from '../../entities/projectiles/Projectile_Enemy';
import { Entity } from '../../entities/Entity';
import { BGM, playAudio } from '../../plugins/Audio';
import { Player } from '../../entities/characters/player/Player';
import { Character } from '../../entities/characters/Character';
import { DATA_HP_ITEM, DATA_POWER_ITEM, DATA_SCORE_ITEM, DATA_SPECIAL_ITEM, Item } from '../../entities/projectiles/items/Item';
import { DATA_YOUSEI1, SDATA_SPAWN_YOUSEI1, Yousei1 } from '../../entities/characters/enemies/mobs/Enemy_Yousei1';
import { Chilno } from '../../entities/characters/enemies/bosses/EnemyBoss_Chilno';
import { GAMEPLAY_SIZE, SCENE_NAMES } from '../../constants';
import { ITexture } from '../UI';
import { PoolGroup } from '../../plugins/Pool';
import { DATA_YOUSEI2, SDATA_SPAWN_YOUSEI2, Yousei2 } from '../../entities/characters/enemies/mobs/Enemy_Yousei2';
import { emptyFunction } from '../../plugins/Utilities';

const BG_SKY: ITexture = { key: 'sky', path: 'assets/sprites/touhou_test/sky.png' }
const BG_FIELD: ITexture = { key: 'field', path: 'assets/sprites/touhou_test/field.png' }

//#region Dialogues
const chant = [
	'Jinzou Faiya Faibo Waipa', 
	'Taiga, Taiga, T-T-T-T-Taiga', 
	'Chape Ape Kara Kina' ,
	'Chape Ape Kara Kina' ,
	'Myouhontusuke' ,
	'*Clap*', 
	'Waipa!',
	'Faiya, Faiya' ,
	'Tora Tora Kara Kina',
	'Chape Ape Fama',
	'Ama Ama Jyasupa',
	'Tora Taiga, Tora Taiga',
	'Jinzou Sen\'i Iettaiga!'
];
//#endregion

export default class GameplayStage1 extends GameplayScene {
	yousei1?: Yousei1;
	yousei2?: Yousei1;
	chilno?: Chilno;
	
	constructor() {
		super(SCENE_NAMES.Stage1_Gameplay);
	}

	preload() {
		super.preload();
		Yousei1.preload(this);
		Chilno.preload(this);
		this.load.image(BG_SKY.key, BG_SKY.path);
		this.load.image(BG_FIELD.key, BG_FIELD.path);
	}

	create() {
		super.create();

		this.dialog = this.add.dialog({
			...DEFAULT_DIALOG_LINE_CREATE_OPTS,
			text: chant,
		});

		this.bgm = playAudio(this, BGM.god_sees_wish_of_this_mystia, .2, true);
		this.background = this.add.tileSprite(0, 0, GAMEPLAY_SIZE.WIDTH, GAMEPLAY_SIZE.HEIGHT, BG_SKY.key).setOrigin(0, 0).setDepth(-1).setAlpha(.8);

		this.handleBoss();
		this.handleMob();

		this.physics.add.overlap(this.player?.hitbox as Entity, Enemy.bluePManager.getGroup(DATA_SHOTBLUE.texture.key) as PoolGroup, this.callBack_hitPlayerEnemyProjectile, undefined, this);
		this.physics.add.overlap(this.player?.hitbox as Entity, Enemy.redPManager.getGroup(DATA_SHOTRED.texture.key) as PoolGroup, this.callBack_hitPlayerEnemyProjectile, undefined, this);
		this.physics.add.overlap(this.player as Player, Enemy.bluePManager.getGroup(DATA_SHOTBLUE.texture.key) as PoolGroup, this.callBack_hitGrazeEnemyProjectile, undefined, this);
		this.physics.add.overlap(this.player as Player, Enemy.redPManager.getGroup(DATA_SHOTRED.texture.key) as PoolGroup, this.callBack_hitGrazeEnemyProjectile, undefined, this);

		this.physics.add.overlap(this.player as Player, Character.itemManager.getGroup(DATA_POWER_ITEM.texture.key) as PoolGroup, this.callBack_hitGrazeItem, undefined, this);
		this.physics.add.overlap(this.player as Player, Character.itemManager.getGroup(DATA_SCORE_ITEM.texture.key) as PoolGroup, this.callBack_hitGrazeItem, undefined, this);
		this.physics.add.overlap(this.player as Player, Character.itemManager.getGroup(DATA_HP_ITEM.texture.key) as PoolGroup, this.callBack_hitGrazeItem, undefined, this);
		this.physics.add.overlap(this.player as Player, Character.itemManager.getGroup(DATA_SPECIAL_ITEM.texture.key) as PoolGroup, this.callBack_hitGrazeItem, undefined, this);
		this.physics.add.overlap(this.player?.hitbox as Entity, Character.itemManager.getGroup(DATA_POWER_ITEM.texture.key) as PoolGroup, this.callBack_hitPlayerPowerItem, undefined, this);
		this.physics.add.overlap(this.player?.hitbox as Entity, Character.itemManager.getGroup(DATA_SCORE_ITEM.texture.key) as PoolGroup, this.callBack_hitPlayerScoreItem, undefined, this);
		this.physics.add.overlap(this.player?.hitbox as Entity, Character.itemManager.getGroup(DATA_HP_ITEM.texture.key) as PoolGroup, this.callBack_hitPlayerHPItem, undefined, this);
		this.physics.add.overlap(this.player?.hitbox as Entity, Character.itemManager.getGroup(DATA_SPECIAL_ITEM.texture.key) as PoolGroup, this.callBack_hitPlayerSpecialItem, undefined, this);
		// this.stateMachine.initialize(this.cutsceneState);
	}

	update(time: number, delta: number) {
		super.update(time, delta);
		this.backgroundScroll(.8);
	}

	updateInteractive(time: number, delta: number): void {
		super.updateInteractive(time, delta);
		this.chilno?.update(time, delta);
	}

	protected handleMob(){
		this.mobManager?.addGroup('yousei1', Yousei1, 4);
		this.mobManager?.addGroup('yousei2', Yousei2, 4);

		this.mobManager?.spawnInstance('yousei2', SDATA_SPAWN_YOUSEI2.spawnPoint);
		this.yousei1 = this.mobManager?.spawnInstance('yousei1', SDATA_SPAWN_YOUSEI1.spawnPoint);
		this.yousei1?.tweenMovement(SDATA_SPAWN_YOUSEI1.targetPoint, SDATA_SPAWN_YOUSEI1.duration, emptyFunction, emptyFunction);

		// this.yousei1 = this.mobManager?.spawnInstance(DATA_YOUSEI1.texture.key, { pos: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH/2, GAMEPLAY_SIZE.HEIGHT/2-400), theta: 0 });
		// this.yousei2 = this.mobManager?.spawnInstance(DATA_YOUSEI1.texture.key, { pos: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH/2, GAMEPLAY_SIZE.HEIGHT/2-200), theta: 0 });

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
