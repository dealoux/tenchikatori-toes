import { DEFAULT_DIALOG_LINE_CREATE_OPTS } from '../../objects/DialogLine';
import { GameplayScene } from '../Gameplay';
import { Enemy } from '../../entities/characters/enemies/Enemy';
import { DATA_SHOTBLUE, DATA_SHOTRED } from '../../entities/projectiles/Projectile_Enemy';
import { Entity } from '../../entities/Entity';
import { BGM, playAudio } from '../../plugins/Audio';
import { Player } from '../../entities/characters/player/Player';
import { Character } from '../../entities/characters/Character';
import { DATA_HP_ITEM, DATA_POWER_ITEM, DATA_SCORE_ITEM, DATA_SPECIAL_ITEM, Item } from '../../entities/projectiles/items/Item';
import { Projectile } from '../../entities/projectiles/Projectile';
import { DATA_YOUSEI1, Yousei1 } from '../../entities/characters/enemies/Enemy_Yousei1';
import { Chilno } from '../../entities/characters/enemies/bosses/EnemyBoss_Chilno';
import { GAMEPLAY_SIZE, SCENE_NAMES } from '../../constants';
import { ITexture } from '../../@types/UI';
import { PoolGroup } from '../../plugins/Pool';

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

		this.handleMob();
		this.handleBoss();

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
	}

	update() {
		super.update();
		this.backgroundScroll(.8);
		// this.yousei1?.update();
		// this.chilno?.update();
	}

	protected handleMob(){
		this.mobManager?.addGroup(DATA_YOUSEI1.texture.key, Yousei1, 4);

		this.yousei1 = this.mobManager?.spawnInstance(DATA_YOUSEI1.texture.key, { pos: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH/2, GAMEPLAY_SIZE.HEIGHT/2-400), theta: 0 });
		this.yousei2 = this.mobManager?.spawnInstance(DATA_YOUSEI1.texture.key, { pos: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH/2, GAMEPLAY_SIZE.HEIGHT/2-200), theta: 0 });

		this.player?.projectileManager.pList.forEach(pGroup => {
			this.mobManager?.pList.forEach(eGroup => {
				this.physics.add.overlap(eGroup, pGroup, this.callBack_hitEnemyMob, undefined, this);
			});
		});
	}

	protected handleBoss(){
		this.chilno = new Chilno(this);
	}

	protected callBack_hitPlayerEnemyProjectile(playerHitbox: unknown, p: unknown) {
		this.hitPlayerEnemyProjectile(playerHitbox as Entity, p as Projectile);
	}
	protected hitPlayerEnemyProjectile(playerHitbox: Entity, p: Projectile) {
		this.player?.handlingProjectileCollisionDelegate(p);
		const { x, y } = p.body.center; // set x and y constants to the bullet's body (for use later)
		p.handleCollision(this.player!);	
	}

	protected callBack_hitGrazeEnemyProjectile(player: unknown, p: unknown) {
		this.hitGrazeEnemyProjectile(player as Player, p as Projectile);
	}
	protected hitGrazeEnemyProjectile(player: Player, p: Projectile) {
		player.handlingGrazeCount(p);
	}

	protected callBack_hitEnemyMob(enemy: unknown, p: unknown) {
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

	protected callBack_hitGrazeItem(player: unknown, i: unknown) {
		this.hitGrazeItem(player as Player, i as Item);
	}
	protected hitGrazeItem(player: Player, i: Item){
		i.handlingGrazeHBCollision(player);
	}

	protected callBack_hitPlayerPowerItem(playerHitbox: unknown, i: unknown) {
		this.hitPlayerPowerItem(playerHitbox as Entity, i as Item);
	}
	protected hitPlayerPowerItem(playerHitbox: Entity, i: Item){
		i.handleCollision();
		this.player?.handlingPowerItemCollisionDelegate(i);
	}

	protected callBack_hitPlayerScoreItem(playerHitbox: unknown, i: unknown) {
		this.hitPlayerScoreItem(playerHitbox as Entity, i as Item);
	}
	protected hitPlayerScoreItem(playerHitbox: Entity, i: Item){
		i.handleCollision();
		this.player?.handlingScoreItem(i);
	}

	protected callBack_hitPlayerHPItem(playerHitbox: unknown, i: unknown) {
		this.hitPlayerHPItem(playerHitbox as Entity, i as Item);
	}
	protected hitPlayerHPItem(playerHitbox: Entity, i: Item){
		i.handleCollision();
		this.player?.handlingHPItemCollisionDelegate(i);
	}

	protected callBack_hitPlayerSpecialItem(playerHitbox: unknown, i: unknown) {
		this.hitPlayerSpecialItem(playerHitbox as Entity, i as Item);
	}
	protected hitPlayerSpecialItem(playerHitbox: Entity, i: Item){
		i.handleCollision();
		this.player?.handlingSpecialItemCollisionDelegate(i);
	}
}
