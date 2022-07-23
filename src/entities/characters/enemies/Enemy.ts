import Phaser from 'phaser';
import { eventsCenter } from '../../../plugins/EventsCentre';
import { ENEMY_PROJECTILE_POOL, EnemyPBlue, EnemyPRed, DATA_SHOTBLUE, DATA_SHOTRED } from '../../projectiles/Projectile_Enemy';
import { Character, ICharacter } from '../Character';
import { PPattern, Projectile } from '../../projectiles/Projectile';
import { IVectorPoint } from '../../Entity';
import { EnemyState_Idle, IEnemyStateData_Idle } from './enemy_states/EnemyState_Idle';
import { EnemyState_Move, IEnemyStateData_Move } from './enemy_states/EnemyState_Move';
import { EnemyState_Attack, IEnemyStateData_Attack } from './enemy_states/EnemyState_Attack';
import { EnemyState } from './enemy_states/EnemyState';
import { playAudio, SFX } from '../../../plugins/Audio';
import { PoolManager } from '../../../plugins/Pool';

export interface IEnemy extends ICharacter{
    shootPoint: IVectorPoint
    movementDuration: number,
}

export class Enemy extends Character{
    static bluePManager : PoolManager;
    static redPManager : PoolManager;

    idleState: EnemyState;
    moveState: EnemyState;
    attackState: EnemyState;

    attacks: Map<string, PPattern>;

    constructor(scene: Phaser.Scene, data: IEnemy, sData_Idle: IEnemyStateData_Idle, sData_Move: IEnemyStateData_Move, sData_Attack: IEnemyStateData_Attack){
        super(scene, data);

        this.attacks = new Map;

        this.idleState = new EnemyState_Idle(this, data, sData_Idle);
        this.moveState = new EnemyState_Move(this, data, sData_Move);
        this.attackState = new EnemyState_Attack(this, data, sData_Attack);

        this.stateMachine.initialize(this.idleState);
    }

    static preload(scene: Phaser.Scene) {
        scene.load.image(DATA_SHOTBLUE.texture.key, DATA_SHOTBLUE.texture.path);
        scene.load.image(DATA_SHOTRED.texture.key, DATA_SHOTRED.texture.path);
	}

    static initPManagers(scene: Phaser.Scene){
        Enemy.bluePManager = new PoolManager(scene);
        Enemy.redPManager = new PoolManager(scene);

        Enemy.bluePManager.addGroup(DATA_SHOTBLUE.texture.key, EnemyPBlue, ENEMY_PROJECTILE_POOL);
        Enemy.redPManager.addGroup(DATA_SHOTRED.texture.key, EnemyPRed, ENEMY_PROJECTILE_POOL);
    }
    
    handleCollision(p: Projectile) {
        this.createInvulnerableEffect();
        this.hp -= p.entData.value;

        if(this.hp <= 0){
            Character.itemManager.emitItemsEnemy(this.x, this.y);
            this.disableEntity();
            playAudio(this.scene, SFX.enemy_vanish);
        }
    }

    public getBlueGroup(key: string){
        return Enemy.bluePManager.getGroup(key);
    }

    public getRedGroup(key: string){
        return Enemy.redPManager.getGroup(key);
    }
}