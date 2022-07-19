import Phaser from 'phaser';
import { IWavePatternData, PPatternWave, Projectile } from '../../../projectiles/Projectile';
import { DATA_SHOTBLUE } from '../../../projectiles/Projectile_Enemy';
import { IAnimation } from '../../Character';
import { IEnemyAttackStateData } from '../enemy_states/Enemy_AttackState';
import { IEnemyIdleStateData } from '../enemy_states/Enemy_IdleState';
import { IEnemyMoveStateData } from '../enemy_states/Enemy_MoveState';
import { EnemyBoss, IEnemyBoss } from './EnemyBoss';

const DATA_CHILNO: IEnemyBoss = {
    texture: { key: 'chilno', path: 'assets/sprites/touhou_test/chilno.png', json: 'assets/sprites/touhou_test/chilno.json' },
    shootPoint: { pos: new Phaser.Math.Vector2(0, 30), theta: 90, },
    hp: 200,
    speed: 200,
    movementDuration: 1500,
}

export enum CHILNO_ANIMS{
    idle = 'chilno_idle_',
    idle2 = 'chilno_idle2_',
    hurt = 'chilno_hurt_',
    strafeLeft = 'chilno_strafeLeft_',
    strafeRight = 'chilno_strafeRight_',
    spell1 = 'chilno_spell1_',
    spell2 = 'chilno_spell2_',
    spell3 = 'chilno_spell3_',
}

const CHILNO_ANIMS_DATA: Array<IAnimation> = [
    { key: CHILNO_ANIMS.idle, end: 3, pad: 2 },
    { key: CHILNO_ANIMS.idle2, end: 1, pad: 2 },
    { key: CHILNO_ANIMS.hurt, end: 2, pad: 2 },
    { key: CHILNO_ANIMS.strafeLeft, end: 1, pad: 2 },
    { key: CHILNO_ANIMS.strafeRight, end: 1, pad: 2 },
    { key: CHILNO_ANIMS.spell1, end: 2, pad: 2 },
    { key: CHILNO_ANIMS.spell2, end: 2, pad: 2 },
    { key: CHILNO_ANIMS.spell3, end: 2, pad: 2 },
]

const SDATA_IDLE_CHILNO: IEnemyIdleStateData = {
    maxIdleTime: 800,
    attackRate: .85,
    animKey: CHILNO_ANIMS.idle,
}

const SDATA_MOVE_CHILNO: IEnemyMoveStateData = {
    locations: [
        { pos: new Phaser.Math.Vector2(720, 300), theta: 0 },
        { pos: new Phaser.Math.Vector2(1020, 200), theta: 0 },
        { pos: new Phaser.Math.Vector2(420, 200), theta: 0 },
    ],
    animKey: CHILNO_ANIMS.strafeLeft,
}

const SDATA_ATTACK_CHILNO: IEnemyAttackStateData = {
    animKey: CHILNO_ANIMS.spell1,
}

const WAVEPATTERN_CHILNO : IWavePatternData = {
    pSpeed : 250,
    fireRate : 30,
    wave: PPatternWave.generateWaveArray(400, 16),
    waveIndex: 0,
    duration: 250,
}

export class Chilno extends EnemyBoss{
    constructor(scene: Phaser.Scene){
        super(scene, DATA_CHILNO, SDATA_IDLE_CHILNO, SDATA_MOVE_CHILNO, SDATA_ATTACK_CHILNO);

        this.attacks.set('key', new PPatternWave(this, DATA_CHILNO.shootPoint, this.getBlueGroup(DATA_SHOTBLUE.texture.key), WAVEPATTERN_CHILNO));
    }

    static preload(scene: Phaser.Scene) {
        scene.load.atlas(DATA_CHILNO.texture.key, DATA_CHILNO.texture.path, DATA_CHILNO.texture.json);
	}

    create(){
        super.create();

        this.createAnimation(CHILNO_ANIMS_DATA, DATA_CHILNO.texture.key);
        // this.anims.create({ key: CHILNO_ANIMS.idle, frames: this.anims.generateFrameNames(DATA_CHILNO.texture.key, { prefix: CHILNO_ANIMS.idle, end: 4, zeroPad: 2}), repeat: -1});
        // this.anims.create({ key: CHILNO_ANIMS.idle2, frames: this.anims.generateFrameNames(DATA_CHILNO.texture.key, { prefix: CHILNO_ANIMS.idle2, end: 2, zeroPad: 2}), repeat: -1});
        // this.anims.create({ key: CHILNO_ANIMS.hurt, frames: this.anims.generateFrameNames(DATA_CHILNO.texture.key, { prefix: CHILNO_ANIMS.hurt, end: 3, zeroPad: 2}), repeat: -1});
        // this.anims.create({ key: CHILNO_ANIMS.strafeLeft, frames: this.anims.generateFrameNames(DATA_CHILNO.texture.key, { prefix: CHILNO_ANIMS.strafeLeft, end: 2, zeroPad: 2}), repeat: -1});
        // this.anims.create({ key: CHILNO_ANIMS.strafeRight, frames: this.anims.generateFrameNames(DATA_CHILNO.texture.key, { prefix: CHILNO_ANIMS.strafeRight, end: 2, zeroPad: 2}), repeat: -1});
        // this.anims.create({ key: CHILNO_ANIMS.spell2, frames: this.anims.generateFrameNames(DATA_CHILNO.texture.key, { prefix: CHILNO_ANIMS.spell2, end: 3, zeroPad: 2}), repeat: -1});
    }

    static initPManagers(scene: Phaser.Scene){
    }

    protected updateHere(): void {
        super.updateHere();
    }
    
    handleCollision(p: Projectile) {
        
    }
}