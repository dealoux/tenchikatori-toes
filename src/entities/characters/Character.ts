import Phaser from 'phaser';
import { eventsCenter } from '../../plugins/EventsCentre';
import { IEntity, Entity, IVectorPoint } from '../Entity';
import { PoolManager } from '../../@types/Pool';
import { ItemManager } from '../projectiles/items/Item';
import { Projectile } from '../projectiles/Projectile';
import { StateMachine } from '../../@types/StateMachine';

export interface ICharacter extends IEntity{
    hp: number,
    speed?: number,
}

export interface IAnimation{
    key: string,
    end: number,
    pad: number, 
}

export class Character extends Entity{
    static itemManager: ItemManager;
    stateMachine: StateMachine;
    hp: number;

    constructor(scene: Phaser.Scene, data: ICharacter){
        super(scene, { pos: data.pos, texture: data.texture, hitSize: data.hitSize, frame: data.frame }, true);
        this.stateMachine = new StateMachine(this);
        this.hp = data.hp;
    }

    time(){
        //return this.scene.time.now;
        return this.scene.game.getTime();
    }

    static async initManager(scene: Phaser.Scene){
        Character.itemManager = new ItemManager(scene);
        Character.itemManager.init();
    }

    update() {
        super.update();
        this.stateMachine.currState().update();
    }

    preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);
        this.stateMachine.currState().preUpdate(time, delta);
    }

    handleCollision(p: Projectile){
        super.handleCollision(p);
    }

    handleCollisionChar(char: Character){}

    protected moveVertically(speed: number){
        //this.y += speed;
        this.setVelocityY(speed);
    }

    protected moveHorizontally(speed: number){
        //this.x += speed;
        this.setVelocityX(speed);
    }

    protected spawnProjectile(manager: PoolManager, name: string, point: IVectorPoint){
        return manager.spawnInstance(name, { pos: new Phaser.Math.Vector2(this.x + point.pos.x, this.y + point.pos.y), theta: point.theta });
    }

    protected createAnimation(data: Array<IAnimation>, parent: string){
        data.forEach(a =>{
            this.anims.create({ key: a.key, frames: this.anims.generateFrameNames(parent, { prefix: a.key, end: a.end, zeroPad: a.pad }), repeat: -1 });
        });
    }
}