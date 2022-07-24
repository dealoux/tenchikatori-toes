import Phaser from 'phaser';
import { IVectorPoint } from '../entities/Entity';

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

        this.runChildUpdate = true;
        scene.add.existing(this);
        this.children.each((c : any) => c.disableEntity());
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

    constructor(scene: Phaser.Scene){
        super(scene.physics.world);

        this.pList = new Map;
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

    protected setUpdateStatus(value: boolean, groupName?: string){
        if(groupName && this.pList.has(groupName)){
            this.getGroup(groupName)!.runChildUpdate = value;
        }
        else{
            this.pList.forEach(pGroup => { pGroup.runChildUpdate = value; });
        }
    }

    pauseUpdate(groupName?: string){
        this.setUpdateStatus(false, groupName);
    }

    resumeUpdate(groupName?: string){
        this.setUpdateStatus(true, groupName);
    }
}