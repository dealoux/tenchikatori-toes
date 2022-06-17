import Phaser from 'phaser';
import { IEntity, IVectorPoint } from '../entities/Entity';

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

    getInstance(point : IVectorPoint){
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

    addPGroup(name: string, type: Function, quantity: number = 1){
        if(!this.pList.has(name))
            this.pList.set(name, new PoolGroup(this.scene, name, type, quantity));
    }

    spawnInstance(name:string, point : IVectorPoint){
        const group = this.pList.get(name);

        if(group){
            group.getInstance(point);
        }
    }
}