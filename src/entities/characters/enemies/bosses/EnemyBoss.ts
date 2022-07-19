import Phaser from 'phaser';
import { PPattern, Projectile } from '../../../projectiles/Projectile';
import { Enemy, IEnemy } from '../Enemy';
import { ITexture } from '../../../Entity';
import { IState, StateMachine } from '../../../../@types/StateMachine';
import { Enemy_IdleState, IEnemyIdleStateData } from '../enemy_states/Enemy_IdleState';
import { Enemy_MoveState, IEnemyMoveStateData } from '../enemy_states/Enemy_MoveState';
import { Enemy_AttackState, IEnemyAttackStateData } from '../enemy_states/Enemy_AttackState';
import { Enemy_State } from '../enemy_states/Enemy_State';

export interface IEnemyBoss extends IEnemy{
    movementDuration: number,
}

export class EnemyBoss extends Enemy{
    stateMachine: StateMachine;
    stateSequence: Array<IState>;
    idleState: Enemy_State;
    moveState: Enemy_State;
    attackState: Enemy_State;
    attackPatterns: Array<PPattern>;

    constructor(scene: Phaser.Scene, data: IEnemyBoss, sData_Idle: IEnemyIdleStateData, sData_Move: IEnemyMoveStateData, sData_Attack: IEnemyAttackStateData){
        super(scene, data);
        this.stateMachine = new StateMachine(this);
        this.stateSequence = new Array;

        this.idleState = new Enemy_IdleState(this, data, sData_Idle);
        this.moveState = new Enemy_MoveState(this, data, sData_Move);
        this.attackState = new Enemy_AttackState(this, data, sData_Attack);
        this.attackPatterns = new Array;

        this.stateMachine.initialize(this.idleState);
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