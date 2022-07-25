import Phaser from 'phaser';
import { Dialog, DialogUpdateAction } from '../objects/Dialog';
import { GAMEPLAY_SIZE, SCENE_NAMES, TEXT_BOX } from '../constants';
import { Player } from '../entities/characters/player/Player';
import { Enemy } from '../entities/characters/enemies/Enemy';
import { Character } from '../entities/characters/Character';
import { Entity } from '../entities/Entity';
import { eventsCenter, GAMEPLAY_EVENTS } from '../plugins/EventsCentre';
import { InputHandler } from '../plugins/InputHandler';
import { PoolGroup, PoolManager } from '../plugins/Pool';
import { BaseScene } from './BaseScene';
import { StateMachine } from '../plugins/StateMachine';
import { DATA_HP_ITEM, DATA_POWER_ITEM, DATA_SCORE_ITEM, DATA_SPECIAL_ITEM, Item } from '../entities/projectiles/items/Item';
import { Projectile } from '../entities/projectiles/Projectile';
import { GameplayState, SceneState_Cutscene, SceneState_Interactive } from './GameplayState';
import { DATA_SHOTBLUE, DATA_SHOTRED } from '../entities/projectiles/Projectile_Enemy';

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
		this.load.image(TEXT_BOX.key, TEXT_BOX.path);
	}

	create() {
		super.create();

		this.mobManager = new PoolManager(this);
		this.player = new Player(this);
		this.cutsceneState.init();

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

		eventsCenter.on(GAMEPLAY_EVENTS.playerDamaged, () => { this.clearActiveMobs(); });
		eventsCenter.on(GAMEPLAY_EVENTS.stageBossVanished, () => { this.time.delayedCall(2500, () => { this.scene.start(SCENE_NAMES.OverMenu); }); });

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

	protected clearActiveMobs(){
		this.mobManager?.pList.forEach(pGroup => {
			let element: Enemy = pGroup.getFirstAlive();

			while(element){
				element.handleDamage(element.hp);
				element = pGroup.getFirstAlive();
			}
		});
	}

	protected callBack_hitPlayerEnemyProjectile(playerHitbox: unknown, p: unknown) {
		this.hitPlayerEnemyProjectile(playerHitbox as Entity, p as Projectile);
	}
	protected hitPlayerEnemyProjectile(playerHitbox: Entity, p: Projectile) {
		this.player?.handlingProjectileCollisionDelegate(p);
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
		enemy.handleDamage(p.entData.value);
		
		// this.explosion
		// const { x, y } = p.body.center; // set x and y constants to the bullet's body (for use later)
		//   .setSpeedX(0.2 * bullet.body.velocity.x)
		//   .setSpeedY(0.2 * bullet.body.velocity.y)
		//   .emitParticleAt(x, y);
		// this.explodeSFX.play();

		p.handleCollision(enemy);
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