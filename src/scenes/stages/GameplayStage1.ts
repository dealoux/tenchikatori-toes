import { DEFAULT_DIALOG_LINE_CREATE_OPTS } from '../../objects/DialogLine';
import { GameplayScene } from '../Gameplay';
import { GAMEPLAY_SIZE } from '../Gameplay';
import { SCENE_NAMES } from '../GameManager';
import { Enemy } from '../../entities/characters/enemies/Enemy';
import { DATA_SHOTBLUE, DATA_SHOTRED, EnemyProjectile } from '../../entities/projectiles/Projectile_Enemy';
import { PoolGroup, PoolManager } from '../../@types/Pool';
import { Entity } from '../../entities/Entity';
import { BGM, playAudio } from '../../@types/Audio';
import { Player } from '../../entities/characters/player/Player';
import { Character } from '../../entities/characters/Character';
import { DATA_POWER_ITEM, DATA_SCORE_ITEM, Item } from '../../entities/projectiles/items/Item';
import { Projectile } from '../../entities/projectiles/Projectile';
import { DATA_YOUSEI1, Yousei1 } from '../../entities/characters/enemies/Enemy_Yousei1';
import { Chilno } from '../../entities/characters/enemies/bosses/EnemyBoss_Chilno';

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
	mobManager?: PoolManager;
	bgm?: Phaser.Sound.BaseSound;
	
	constructor() {
		super(SCENE_NAMES.Stage1_Gameplay);
	}

	preload() {
		super.preload();
		Yousei1.preload(this);
		Chilno.preload(this);
	}

	create() {
		super.create();

		this.dialog = this.add.dialog({
			...DEFAULT_DIALOG_LINE_CREATE_OPTS,
			text: chant,
		});

		this.bgm = playAudio(this, BGM.god_sees_wish_of_this_mystia, true, .2);

		this.mobManager = new PoolManager(this);
		this.handleYousei1();

		this.physics.add.overlap(this.player?.hitbox as Entity, Enemy.bluePManager.getGroup(DATA_SHOTBLUE.texture.key) as PoolGroup, this.callBack_hitPlayerEnemyProjectile, undefined, this);
		this.physics.add.overlap(this.player?.hitbox as Entity, Enemy.redPManager.getGroup(DATA_SHOTRED.texture.key) as PoolGroup, this.callBack_hitPlayerEnemyProjectile, undefined, this);

		this.physics.add.overlap(this.player as Player, Character.itemManager.getGroup(DATA_POWER_ITEM.texture.key) as PoolGroup, this.callBack_hitGrazeItem, undefined, this);
		this.physics.add.overlap(this.player as Player, Character.itemManager.getGroup(DATA_SCORE_ITEM.texture.key) as PoolGroup, this.callBack_hitGrazeItem, undefined, this);
		this.physics.add.overlap(this.player?.hitbox as Entity, Character.itemManager.getGroup(DATA_POWER_ITEM.texture.key) as PoolGroup, this.callBack_hitPlayerPowerItem, undefined, this);
		this.physics.add.overlap(this.player?.hitbox as Entity, Character.itemManager.getGroup(DATA_SCORE_ITEM.texture.key) as PoolGroup, this.callBack_hitPlayerScoreItem, undefined, this);
	}

	update() {
		super.update();
		// this.yousei1?.update();
		this.chilno?.update();
	}

	private handleYousei1(){
		this.mobManager?.addGroup(DATA_YOUSEI1.texture.key, Yousei1, 4);

		this.yousei1 = this.mobManager?.spawnInstance(DATA_YOUSEI1.texture.key, { pos: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH/2, GAMEPLAY_SIZE.HEIGHT/2-400), theta: 0 });
		this.yousei2 = this.mobManager?.spawnInstance(DATA_YOUSEI1.texture.key, { pos: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH/2, GAMEPLAY_SIZE.HEIGHT/2-200), theta: 0 });

		this.player?.projectileManager.pList.forEach(pGroup => {
			this.mobManager?.pList.forEach(eGroup => {
				this.physics.add.overlap(eGroup, pGroup, this.callBack_hitEnemyMob, undefined, this);
			})
		});

		//this.chilno = new Chilno(this);
	}

	protected callBack_hitPlayerEnemyProjectile(playerHitbox: any, p: any) {
		this.hitPlayerEnemyProjectile(playerHitbox as Entity, p as Projectile);
	}
	protected hitPlayerEnemyProjectile(playerHitbox: Entity, p: Projectile) {
		//playerHitbox.handleCollision(p);
		const { x, y } = p.body.center; // set x and y constants to the bullet's body (for use later)
		p.handleCollision(playerHitbox);	
	}

	protected callBack_hitEnemyMob(enemy: any, p: any) {
		this.hitEnemyMob(enemy as Enemy, p as Projectile);
	}
	protected hitEnemyMob(enemy: Enemy, p: Projectile) {
		// this.score += enemy.points;
		// this.scoreText.setText("SCORE:"+Phaser.Utils.String.Pad(this.score, 6, '0', 1));
		enemy.handleCollision(p);
		const { x, y } = p.body.center; // set x and y constants to the bullet's body (for use later)
		p.handleCollision(enemy);
		
		// this.explosion
		//   .setSpeedX(0.2 * bullet.body.velocity.x)
		//   .setSpeedY(0.2 * bullet.body.velocity.y)
		//   .emitParticleAt(x, y);
		// this.explodeSFX.play();
	}

	protected callBack_hitGrazeItem(player: any, i: any) {
		this.hitGrazeItem(player as Player, i as Item);
	}
	protected hitGrazeItem(player: Player, i: Item){
		i.handlingGrazeHBCollision(player);
	}

	protected callBack_hitPlayerPowerItem(playerHitbox: any, i: any) {
		this.hitPlayerPowerItem(playerHitbox as Entity, i as Item);
	}
	protected hitPlayerPowerItem(playerHitbox: Entity, i: Item){
		this.player?.handlingPowerItemCollisionDelegate(i);
		i.handleCollision(playerHitbox);
	}

	protected callBack_hitPlayerScoreItem(playerHitbox: any, i: any) {
		this.hitPlayerScoreItem(playerHitbox as Entity, i as Item);
	}
	protected hitPlayerScoreItem(playerHitbox: Entity, i: Item){
		this.player?.handlingScoreItem(i);
		i.handleCollision(playerHitbox);
	}
}
