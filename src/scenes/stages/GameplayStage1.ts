import { DEFAULT_DIALOG_LINE_CREATE_OPTS } from '../../objects/DialogLine';
import { GameplayScene } from '../Gameplay';
import { Enemies, Yousei1, Yousei1Anims } from '../../entities/Enemy_Specific';
import { Characters } from '../../entities/Character';
import { GAMEPLAY_SIZE } from '../Gameplay';
import { SCENE_NAMES } from '../GameManager';
import { Player } from '../../entities/Player';
import { Enemy } from '../../entities/Enemy';
import { DATA_SHOTBLUE, DATA_SHOTRED } from '../../objects/Projectile_Enemy';
import { PoolGroup, PoolManager } from '../../@types/Pool';
import { Projectile } from '../../objects/Projectile';

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

		let bgm = this.sound.add('2huseesall', { volume: .2 });
		bgm.play({loop: true});

		this.mobManager = new PoolManager(this, GameplayScene);
		this.handleYousei1();

		// this.physics.add.overlap(this.player as Player, Enemy.bluePManager.getPGroup(DATA_SHOTBLUE.entData.texture) as PoolGroup, this.hitPlayer, undefined, this);
		// this.physics.add.overlap(this.player as Player, Enemy.redPManager.getPGroup(DATA_SHOTRED.entData.texture) as PoolGroup, this.hitPlayer, undefined, this);

		this.physics.add.overlap(this.player?.hitbox as Phaser.GameObjects.Rectangle, Enemy.bluePManager.getPGroup(DATA_SHOTBLUE.entData.texture) as PoolGroup, this.hitPlayer, undefined, this);
		this.physics.add.overlap(this.player?.hitbox as Phaser.GameObjects.Rectangle, Enemy.redPManager.getPGroup(DATA_SHOTRED.entData.texture) as PoolGroup, this.hitPlayer, undefined, this);
	}

	update() {
		super.update();

		this.yousei1?.update();
	}

	private handleYousei1(){
		this.yousei1 = new Yousei1(this, { pos: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH/2, GAMEPLAY_SIZE.HEIGHT/2-400), texture: Characters.YOUSEIS });
		this.yousei2 = new Yousei1(this, { pos: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH/2, GAMEPLAY_SIZE.HEIGHT/2-200), texture: Characters.YOUSEIS });

		this.player?.projectileManager.pList.forEach(pGroup => {
			this.physics.add.overlap(this.yousei1 as Yousei1, pGroup, this.hitEnemyMob, undefined, this);
			this.physics.add.overlap(this.yousei2 as Yousei1, pGroup, this.hitEnemyMob, undefined, this);
		});


		// this.mobManager?.addPGroup(Enemies.yousei1, Yousei1, 4);

		// this.yousei1 = this.mobManager?.spawnInstance(Enemies.yousei1, { pos: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH/2, GAMEPLAY_SIZE.HEIGHT/2-400), theta: 0 });
		// this.yousei2 = this.mobManager?.spawnInstance(Enemies.yousei1, { pos: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH/2, GAMEPLAY_SIZE.HEIGHT/2-200), theta: 0 });

		// this.player?.projectileManager.pList.forEach(pGroup => {
		// 	this.mobManager?.pList.forEach(eGroup => {
		// 		this.physics.add.overlap(eGroup, pGroup, this.hitEnemyMob, undefined, this);
		// 	})
		// });
	}

	protected hitPlayer(playerHitbox: any, p: any) {
		const { x, y } = p.body.center; // set x and y constants to the bullet's body (for use later)
		p.handleCollision();
		//p.setStatus(false);

		console.log(typeof playerHitbox + " " + typeof p);
		
		// this.explosion
		//   .setSpeedX(0.2 * bullet.body.velocity.x)
		//   .setSpeedY(0.2 * bullet.body.velocity.y)
		//   .emitParticleAt(x, y);
		// this.explodeSFX.play();
	}

	protected hitEnemyMob(enemy: any, p: any) {
		// this.score += enemy.points;
		// this.scoreText.setText("SCORE:"+Phaser.Utils.String.Pad(this.score, 6, '0', 1));
		enemy.handleCollision();
		const { x, y } = p.body.center; // set x and y constants to the bullet's body (for use later)
		p.handleCollision();
		
		// this.explosion
		//   .setSpeedX(0.2 * bullet.body.velocity.x)
		//   .setSpeedY(0.2 * bullet.body.velocity.y)
		//   .emitParticleAt(x, y);
		// this.explodeSFX.play();
	}
}
