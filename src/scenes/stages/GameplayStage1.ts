import { DEFAULT_DIALOG_LINE_CREATE_OPTS } from '../../objects/DialogLine';
import { GameplayScene } from '../Gameplay';
import { Yousei1 } from '../../entities/Enemy_Specific';
import { GAMEPLAY_SIZE } from '../Gameplay';
import { SCENE_NAMES } from '../GameManager';
import { Enemy, YOUSEI1_TEXTURE } from '../../entities/Enemy';
import { DATA_SHOTBLUE, DATA_SHOTRED } from '../../objects/Projectile_Enemy';
import { PoolGroup, PoolManager } from '../../@types/Pool';
import { Entity } from '../../entities/Entity';
import { BGM, playAudio } from '../../@types/Audio';
import { Player } from '../../entities/Player';
import { Character } from '../../entities/Character';
import { DATA_POWER_ITEM, DATA_SCORE_ITEM } from '../../entities/items/Item';

//#region Dialogues
const chant = [
	'JINZOU FIRE FAIBO WAIPAA', 
	'TAIGA TAIGA TTTTAIGA', 
	'CHAPE APE KARA KINA' ,
	'CHAPE APE KARA KINA' ,
	'MYOHHONTUSUKE' ,
	'*CLAP* WAIPAA!!', 
	'FIRE FIRE' ,
	'TORA TORA KARA KINA',
	'CHAPE APE BABA',
	'AMA AMA JYASUPA!',
	'TORA TAIGA, DARE TAIGA!',
	'JINZOU SENI YA TAIGA!'
];
//#endregion

export default class GameplayStage1 extends GameplayScene {
	yousei1?: Yousei1;
	yousei2?: Yousei1;
	mobManager?: PoolManager;
	bgm?: Phaser.Sound.BaseSound;
	
	constructor() {
		super(SCENE_NAMES.Stage1_Gameplay);
	}

	preload() {
		super.preload();
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

		this.physics.add.overlap(this.player?.hitbox as Entity, Enemy.bluePManager.getGroup(DATA_SHOTBLUE.texture.key) as PoolGroup, this.hitPlayerEnemyProjectile, undefined, this);
		this.physics.add.overlap(this.player?.hitbox as Entity, Enemy.redPManager.getGroup(DATA_SHOTRED.texture.key) as PoolGroup, this.hitPlayerEnemyProjectile, undefined, this);

		this.physics.add.overlap(this.player as Player, Character.itemManager.getGroup(DATA_POWER_ITEM.texture.key) as PoolGroup, this.hitGrazeItem, undefined, this);
		this.physics.add.overlap(this.player as Player, Character.itemManager.getGroup(DATA_SCORE_ITEM.texture.key) as PoolGroup, this.hitGrazeItem, undefined, this);
		this.physics.add.overlap(this.player?.hitbox as Entity, Character.itemManager.getGroup(DATA_POWER_ITEM.texture.key) as PoolGroup, this.hitPlayerPowerItem, undefined, this);
		this.physics.add.overlap(this.player?.hitbox as Entity, Character.itemManager.getGroup(DATA_SCORE_ITEM.texture.key) as PoolGroup, this.hitPlayerScoreItem, undefined, this);
	}

	update() {
		super.update();
		// this.yousei1?.update();
	}

	private handleYousei1(){
		// this.yousei1 = new Yousei1(this, { pos: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH/2, GAMEPLAY_SIZE.HEIGHT/2-400), texture: YOUSEI1_TEXTURE });
		// this.yousei2 = new Yousei1(this, { pos: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH/2, GAMEPLAY_SIZE.HEIGHT/2-200), texture: YOUSEI1_TEXTURE });

		// this.player?.projectileManager.pList.forEach(pGroup => {
		// 	this.physics.add.overlap(this.yousei1 as Yousei1, pGroup, this.hitEnemyMob, undefined, this);
		// 	this.physics.add.overlap(this.yousei2 as Yousei1, pGroup, this.hitEnemyMob, undefined, this);
		// });


		this.mobManager?.addGroup(YOUSEI1_TEXTURE.key, Yousei1, 4);

		this.yousei1 = this.mobManager?.spawnInstance(YOUSEI1_TEXTURE.key, { pos: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH/2, GAMEPLAY_SIZE.HEIGHT/2-400), theta: 0 });
		this.yousei2 = this.mobManager?.spawnInstance(YOUSEI1_TEXTURE.key, { pos: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH/2, GAMEPLAY_SIZE.HEIGHT/2-200), theta: 0 });

		this.player?.projectileManager.pList.forEach(pGroup => {
			this.mobManager?.pList.forEach(eGroup => {
				this.physics.add.overlap(eGroup, pGroup, this.hitEnemyMob, undefined, this);
			})
		});
	}

	protected hitPlayerEnemyProjectile(playerHitbox: any, p: any) {
		//playerHitbox.handleCollision(p);
		const { x, y } = p.body.center; // set x and y constants to the bullet's body (for use later)
		p.handleCollision(playerHitbox);
		// console.dir(playerHitbox)

		// console.log(typeof playerHitbox + " " + typeof p);
		
		// this.explosion
		//   .setSpeedX(0.2 * bullet.body.velocity.x)
		//   .setSpeedY(0.2 * bullet.body.velocity.y)
		//   .emitParticleAt(x, y);
		// this.explodeSFX.play();
	}

	protected hitEnemyMob(enemy: any, p: any) {
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

	protected hitGrazeItem(player: any, i: any){
		i.handlingGrazeHBCollision(player);
	}

	protected hitPlayerPowerItem(playerHitbox: any, i: any){
		this.player?.handlingPowerItemCollisionDelegate(i);
		i.handleCollision(playerHitbox);
	}

	protected hitPlayerScoreItem(playerHitbox: any, i: any){
		this.player?.handlingScoreItem(i);
		i.handleCollision(playerHitbox);
	}
}
