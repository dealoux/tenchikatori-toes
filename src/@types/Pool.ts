import Phaser, { Physics } from 'phaser';
import { IEntity, IVectorPoint } from '../entities/Entity';

export class PoolGroup extends Phaser.GameObjects.Group{
    constructor(scene: Phaser.Scene, name: string, type: Function, quantity: number = 1){
        super(scene, undefined, { enable: false } as Phaser.Types.Physics.Arcade.PhysicsGroupConfig);

        this.createMultiple({
            key: name,
            classType: type,
            frameQuantity: quantity,
            active: false,
            visible: false,
        });

        //this.children.each((c) => c.removeInteractive());
    }

    getInstance(point : IVectorPoint){
        const instance = this.getFirstDead(false);

        if(instance){
            instance.updateTransform(point);
        }

        return instance;
    }
}

export class PoolManager extends Phaser.Physics.Arcade.Factory{
    pList : Map<string, PoolGroup>;
    owner: Function;

    constructor(scene: Phaser.Scene, owner: Function){
        super(scene.physics.world);

        this.pList = new Map;
        this.owner = owner;
    }

    addGroup(name: string, type: Function, quantity: number = 1){
        if(!this.pList.has(name))
            this.pList.set(name, new PoolGroup(this.scene, name, type, quantity));
    }

    getGroup(name: string){
        return this.pList.get(name);
    }

    spawnInstance(name:string, point : IVectorPoint){
        let instance = undefined;
        const group = this.pList.get(name);

        if(group){
            instance = group.getInstance(point);
        }

        return instance;
    }
}