import Phaser from 'phaser';
import { Projectile } from '../../../projectiles/Projectile';
import { Enemy, IEnemy } from '../Enemy';
import { ITexture } from '../../../Entity';
import { IState, StateMachine } from '../../../../@types/StateMachine';
import { Enemy_IdleState } from '../enemy_states/Enemy_IdleState';
import { Enemy_MoveState } from '../enemy_states/Enemy_MoveState';
import { Enemy_AttackState } from '../enemy_states/Enemy_AttackState';

export interface IEnemyBoss extends IEnemy{
    maxIdleTime: number,
}

export class EnemyBoss extends Enemy{
    stateMachine: StateMachine;
    stateSequence : Array<IState>;
    idleState?: Enemy_IdleState;
    moveState?: Enemy_MoveState;
    attackState?: Enemy_AttackState;

    constructor(scene: Phaser.Scene, data: IEnemyBoss){
        super(scene, data);
        this.stateMachine = new StateMachine(this);
        this.stateSequence = new Array;
    }

    static preload(scene: Phaser.Scene) {
        // scene.load.atlas(YOUSEI1_TEXTURE.key, YOUSEI1_TEXTURE.path, YOUSEI1_TEXTURE.json);
	}

    static initPManagers(scene: Phaser.Scene){
        // Enemy.bluePManager = new PoolManager(scene);
        // Enemy.redPManager = new PoolManager(scene);

        // Enemy.bluePManager.addGroup(DATA_SHOTBLUE.texture.key, EnemyPBlue, ENEMY_PROJECTILE_POOL);
        // Enemy.redPManager.addGroup(DATA_SHOTRED.texture.key, EnemyPRed, ENEMY_PROJECTILE_POOL);
    }
    
    protected updateHere (){
        //super.updateHere();
    }

    handleCollision(p: Projectile) {
        
    }
}