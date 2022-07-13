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

    constructor(scene: Phaser.Scene, { pos, texture, hitRadius, frame }: IEntity,  hp: number, speed: number, projectileManager?: PoolManager | undefined){
        super(scene, { pos, texture, hitRadius, frame }, true);

        this.hp = hp;
        this.speed = speed;
        this.state = CharacterState.ALIVE;
        this.lastShotTime = 0;
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

    protected moveVertically(speed: number){
        //this.y += speed;
        this.setVelocityY(speed);
    }

    protected moveHorizontally(speed: number){
        //this.x += speed;
        this.setVelocityX(speed);
    }

    public time(){
        //return this.scene.time.now;
        return this.scene.game.getTime();
    }

    protected spawnProjectile(manager: PoolManager, name: string, point: IVectorPoint){
        return manager.spawnInstance(name, { pos: new Phaser.Math.Vector2(this.x + point.pos.x, this.y + point.pos.y), theta: point.theta });
    }
}