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
import { EnemyState_Spawn, IEnemyStateData_Spawn } from './enemy_states/EnemyState_Spawn';
import { IUIBar, UIBarComponent } from '../CharacterComponent';

export interface IEnemy extends ICharacter{
    shootPoint: IVectorPoint
    movementDuration: number,
}

const ENEMY_HP_BAR : IUIBar = {
    size: { x: 50, y: 6 },
    offset: { x: -25, y: 35 },
    fillColour: 0x00ff00,
}

export class Enemy extends Character{
    static bluePManager : PoolManager;
    static redPManager : PoolManager;

    idleState: EnemyState;
    attackState: EnemyState;
    disableInteractiveState: EnemyState;

    attacks: Map<string, PPattern>;

    constructor(scene: Phaser.Scene, data: IEnemy, sData_Idle: IEnemyStateData_Idle, sData_Attack: IEnemyStateData_Attack){
        super(scene, data);

        this.attacks = new Map;
        this.components.addComponents(this, new UIBarComponent(ENEMY_HP_BAR));

        this.idleState = new EnemyState_Idle(this, data, sData_Idle);
        this.attackState = new EnemyState_Attack(this, data, sData_Attack);
        this.disableInteractiveState = new EnemyState(this, data, {});

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

    nextStage(noAttack: boolean): EnemyState{
        return noAttack ? this.idleState : this.attackState;
    }
    
    handleCollision(p: Projectile) {
        this.createInvulnerableEffect();
        this.hp -= p.entData.value;
        (this.components.findComponents(this, UIBarComponent) as UIBarComponent).display(this.hp, this.entData.hp);

        if(this.hp <= 0){
            Character.itemManager.emitItemsEnemy(this.x, this.y);
            this.disableEntity();
            playAudio(this.scene, SFX.enemy_vanish);
        }
    }

    enableEntity(pos: Phaser.Math.Vector2): void {
        super.enableEntity(pos);
    }

    disableEntity(): void {
        super.disableEntity();
        this.stateMachine.changeState(this.disableInteractiveState);
    }

    public getBlueGroup(key: string){
        return Enemy.bluePManager.getGroup(key);
    }

    public getRedGroup(key: string){
        return Enemy.redPManager.getGroup(key);
    }
}

export class EnemyWithSpawn extends Enemy{
    spawnState: EnemyState;

    constructor(scene: Phaser.Scene, data: IEnemy, sData_Idle: IEnemyStateData_Idle, sData_Attack: IEnemyStateData_Attack, sData_Spawn: IEnemyStateData_Spawn){
        super(scene, data, sData_Idle, sData_Attack);
        this.spawnState = new EnemyState_Spawn(this, data, sData_Spawn);
        this.stateMachine.initialize(this.spawnState);
    }
}

export class EnemyBoss extends EnemyWithSpawn{
    moveState: EnemyState;

    constructor(scene: Phaser.Scene, data: IEnemy, sData_Idle: IEnemyStateData_Idle, sData_Attack: IEnemyStateData_Attack, sData_Spawn: IEnemyStateData_Spawn, sData_Move: IEnemyStateData_Move){
        super(scene, data, sData_Idle, sData_Attack, sData_Spawn);
        this.moveState = new EnemyState_Move(this, data, sData_Move);
    }

    nextStage(noAttack: boolean): EnemyState{
        return noAttack ? this.moveState : this.attackState;
    }
}