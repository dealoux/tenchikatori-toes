import Phaser from 'phaser';
import { eventsCenter, GAMEPLAY_EVENTS } from '../../../plugins/EventsCentre';
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
import { EnemyState_Retreat, IEnemyStateData_Retreat } from './enemy_states/EnemyState_Retreat';
import { emptyFunction } from '../../../plugins/Utilities';
import { YOUSEI_SPRITES } from '../../../constants';

export interface IEnemy extends ICharacter{
    shootPoint: IVectorPoint
    movementDuration: number,
}

interface IHandlingDamageDelegate{
    (value: number) : void;
}

const ENEMY_HP_BAR : IUIBar = {
    size: { x: 50, y: 6 },
    offset: { x: -25, y: 35 },
    fillColour: 0x00ff00,
}

export class Enemy extends Character{
    static bluePManager : PoolManager;
    static redPManager : PoolManager;

    // handleDamage: IHandlingDamageDelegate;

    idleState: EnemyState_Idle;
    attackState: EnemyState_Attack;
    disableInteractiveState: EnemyState;

    attacks: Map<string, PPattern>;

    constructor(scene: Phaser.Scene, data: IEnemy, sData_Idle: IEnemyStateData_Idle, sData_Attack: IEnemyStateData_Attack){
        super(scene, data);

        // this. handleDamage = this.handleDamageHelper;
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
        scene.load.atlas(YOUSEI_SPRITES.key, YOUSEI_SPRITES.path, YOUSEI_SPRITES.json);
	}

    static initPManagers(scene: Phaser.Scene){
        Enemy.bluePManager = new PoolManager(scene);
        Enemy.redPManager = new PoolManager(scene);

        Enemy.bluePManager.addGroup(DATA_SHOTBLUE.texture.key, EnemyPBlue, ENEMY_PROJECTILE_POOL);
        Enemy.redPManager.addGroup(DATA_SHOTRED.texture.key, EnemyPRed, ENEMY_PROJECTILE_POOL);
    }

    preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);
        // out of view check
        if(!this.inCameraView()){
            this.disableEntity();
        }                        
    }

    decideNextStage(noAttack: boolean): EnemyState{
        return noAttack ? this.idleState : this.attackState;
    }

    tweenMovement(point: IVectorPoint, duration: number, onComplete = emptyFunction, onStart = emptyFunction){
        this.scene.tweens.add({
            targets: this,
            x: point.pos.x,
            y: point.pos.y,
            duration: duration,
            ease: 'Sine.easeInOut',
            onStart: onStart,
            onComplete: onComplete,
        });
    }
    
    handleDamage(value: number) {
        this.createInvulnerableEffect();
        this.hp -= value;
        (this.components.findComponents(this, UIBarComponent) as UIBarComponent).display(this.hp, this.entData.hp);

        if(this.hp <= 0){
            Character.itemManager.emitItemsEnemy(this.x, this.y);
            playAudio(this.scene, SFX.enemy_vanish);
            this.disableEntity();
        }
    }

    updateTransform(point?: IVectorPoint): void {
        super.updateTransform(point);
        this.stateMachine.changeState(this.idleState);
    }

    enableEntity(pos: Phaser.Math.Vector2): void {
        super.enableEntity(pos);
        // reset properties here
        this.hp = this.entData.hp;
    }

    disableEntity(): void {
        super.disableEntity();
        this.stateMachine.changeState(this.disableInteractiveState);
    }

    getBlueGroup(key: string){
        return Enemy.bluePManager.getGroup(key);
    }

    getRedGroup(key: string){
        return Enemy.redPManager.getGroup(key);
    }
}

export class EnemyWithSpawn extends Enemy{
    spawnState: EnemyState_Spawn;
    retreatState: EnemyState_Retreat;
    activeStartTime?: number;

    constructor(scene: Phaser.Scene, data: IEnemy, sData_Idle: IEnemyStateData_Idle, sData_Attack: IEnemyStateData_Attack, sData_Spawn: IEnemyStateData_Spawn, sData_Retreat: IEnemyStateData_Retreat){
        super(scene, data, sData_Idle, sData_Attack);
        this.spawnState = new EnemyState_Spawn(this, data, sData_Spawn);
        this.retreatState = new EnemyState_Retreat(this, data, sData_Retreat);

        this.stateMachine.initialize(this.spawnState);
    }

    decideNextStage(noAttack: boolean): EnemyState{
        if(this.activeStartTime! + this.retreatState.sData.activeDuration < this.time()){
            return this.retreatState;
        }

        return super.decideNextStage(noAttack);
    }

    updateTransform(point?: IVectorPoint): void {
        super.updateTransform(point);
        this.stateMachine.changeState(this.spawnState);
    }

    onRetreat(){
    }
}

export class EnemyBoss extends EnemyWithSpawn{
    moveState: EnemyState_Move;

    constructor(scene: Phaser.Scene, data: IEnemy, sData_Idle: IEnemyStateData_Idle, sData_Attack: IEnemyStateData_Attack, sData_Spawn: IEnemyStateData_Spawn, sData_Retreat: IEnemyStateData_Retreat, sData_Move: IEnemyStateData_Move){
        super(scene, data, sData_Idle, sData_Attack, sData_Spawn, sData_Retreat);
        this.moveState = new EnemyState_Move(this, data, sData_Move);
    }

    decideNextStage(noAttack: boolean): EnemyState{
        if(this.activeStartTime! + this.retreatState.sData.activeDuration < this.time()){
            return this.retreatState;
        }

        return noAttack ? this.moveState : this.attackState;
    }

    disableEntity(): void {
        super.disableEntity();
        eventsCenter.emit(GAMEPLAY_EVENTS.stageBossVanished);
    }

    onRetreat(){
        super.onRetreat();
        eventsCenter.emit(GAMEPLAY_EVENTS.stageBossVanished);
    }
}