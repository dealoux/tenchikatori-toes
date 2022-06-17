import Phaser from 'phaser';
import { IEntity, Entity, IVectorPoint, COLLISION_CATEGORIES } from './Entity';

import { PoolManager } from '../@types/Pool';
import eventsCenter from '../plugins/EventsCentre';
import { IShootPoints } from '../objects/Projectile_Player';

export enum CharacterState{
    ALIVE,
    DEAD
}

export enum Characters{
    PLAYER = 'enna',
    YOUSEIS = 'youseis'
}

export class Character extends Entity{
    state: CharacterState;
    hp: number;
    speed: number;
    lastShotTime: number;
    collisionCategory?: number;
    projectileManager?: PoolManager;

    constructor(scene: Phaser.Scene, { pos, texture, collisionGroup, hitRadius, frame }: IEntity,  hp: number, speed: number, projectileManager?: PoolManager | undefined){
        super(scene, { pos, texture, collisionGroup, hitRadius, frame }, true);

        this.hp = hp;
        this.speed = speed;
        this.state = CharacterState.ALIVE;
        this.lastShotTime = 0;
        this.projectileManager = projectileManager;
    }

    // protected preUpdate(time: number, delta: number){
    //    super.preUpdate(time, delta);
    // }

    // create(){
    //     super.create();
    // }

    // update() {
    //     super.update();
    // }

    // protected handleCollision(data: Phaser.Types.Physics.Matter.MatterCollisionData){
    //     super.handleCollision(data);
    // }

    protected moveVertically(y: number){
        this.y += y;
    }

    protected moveHorizontally(x: number){
        this.x += x;
    }

    protected time(){
        return this.scene.game.getTime();
    }

    protected spawnProjectile(name: string, point: IVectorPoint){
        this.projectileManager?.spawnInstance(name, { pos: new Phaser.Math.Vector2(this.body.position.x + point.pos.x, this.body.position.y + point.pos.y), theta: point.theta });
    }

    protected setMode(mode: number){
        this.collisionCategory = mode;
        this.setCollisionCategory(mode);
    }
}