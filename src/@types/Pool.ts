import Phaser from 'phaser';
import {IEntity, collisionGroups } from '../entities/Entity';
import { PPoint, Projectile, ProjectileData } from '../objects/Projectile';
import eventsCenter from '../plugins/EventsCentre';
import { SHOTPOOL_ENEMY, EnemyShotBlue, EnemyShotRed, Data_ShotBlue as DATA_SHOTBLUE, Data_ShotRed as DATA_SHOTRED } from '../objects/Projectile_Enemy';
import { Character, Characters } from '../entities/Character';

export class PoolGroup extends Phaser.GameObjects.Group{
    constructor(scene: Phaser.Scene, name: string, type: Function, quantity: number = 1){
        super(scene);

        this.createMultiple({
            key: name,
            classType: type,
            frameQuantity: quantity,
            active: false,
            visible: false,
        });
    }

    getInstance(point : PPoint){
        const projectile = this.getFirstDead(false);

        if(projectile){
            projectile.updateTransform(point);
        }
    }
}

export class PoolManager extends Phaser.Physics.Matter.Factory{
    pList : Map<string, PoolGroup>;
    owner: Function;

    constructor(scene: Phaser.Scene, owner: Function){
        super(scene.matter.world);

        this.pList = new Map;
        this.owner = owner;
    }

    getP(name:string, point : PPoint){
        const group = this.pList.get(name);

        if(group){
            group.getInstance(point);
        }
    }

    addPGroup(name: string, type: Function, quantity: number = 1){
        if(!this.pList.has(name))
            this.pList.set(name, new PoolGroup(this.scene, name, type, quantity));
    }
}