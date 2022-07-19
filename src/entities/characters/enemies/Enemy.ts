import Phaser from 'phaser';
import eventsCenter from '../../../plugins/EventsCentre';
import { PoolManager } from '../../../@types/Pool';
import { ENEMY_PROJECTILE_POOL, EnemyPBlue, EnemyPRed, DATA_SHOTBLUE, DATA_SHOTRED } from '../../projectiles/Projectile_Enemy';
import { Character, ICharacter } from '../Character';
import { PPattern, Projectile } from '../../projectiles/Projectile';
import { IVectorPoint } from '../../Entity';
import { IState, StateMachine } from '../../../@types/StateMachine';
import { Enemy_State } from './enemy_states/Enemy_State';
import { Enemy_IdleState, IEnemyIdleStateData } from './enemy_states/Enemy_IdleState';
import { Enemy_MoveState, IEnemyMoveStateData } from './enemy_states/Enemy_MoveState';
import { Enemy_AttackState, IEnemyAttackStateData } from './enemy_states/Enemy_AttackState';

export interface IEnemy extends ICharacter{
    shootPoint: IVectorPoint
    movementDuration: number,
}

export class Enemy extends Character{
    static bluePManager : PoolManager;
    static redPManager : PoolManager;

    stateMachine: StateMachine;
    stateSequence: Array<IState>;
    idleState: Enemy_State;
    moveState: Enemy_State;
    attackState: Enemy_State;
    attacks: Map<string, PPattern>;

    
    constructor(scene: Phaser.Scene, data: IEnemy, sData_Idle: IEnemyIdleStateData, sData_Move: IEnemyMoveStateData, sData_Attack: IEnemyAttackStateData){
        super(scene, data);

        this.stateMachine = new StateMachine(this);
        this.stateSequence = new Array;

        this.idleState = new Enemy_IdleState(this, data, sData_Idle);
        this.moveState = new Enemy_MoveState(this, data, sData_Move);
        this.attackState = new Enemy_AttackState(this, data, sData_Attack);

        this.attacks = new Map;
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
    
    getDamage(value?: number): void {
        this.scene.tweens.add({
            targets: this,
            duration: 100,
            repeat: 3,
            yoyo: true,
            alpha: 0.5,
            onStart: () => {
                if (value) {
                    this.hp = this.hp - value;
                }
            },
            onComplete: () => {
                this.setAlpha(1);
            },
        });
    }

    protected updateHere (){
        super.updateHere();
        this.stateMachine.currState().update();
    }

    handleCollision(p: Projectile) {
        this.hp -= p.entData.value || 0;

        if(this.hp <= 0){
            Character.itemManager.emitItems(this.x, this.y);
            this.disableEntity();
        }
        
        // console.log(this.hp);
    }

    public getBlueGroup(key: string){
        return Enemy.bluePManager.getGroup(key);
    }

    public getRedGroup(key: string){
        return Enemy.redPManager.getGroup(key);
    }
}