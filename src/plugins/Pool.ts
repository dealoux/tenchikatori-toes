import Phaser from 'phaser';
import { IVectorPoint } from '../entities/Entity';

export class PoolGroup extends Phaser.Physics.Arcade.Group{
    constructor(scene: Phaser.Scene, name: string, type: Function, quantity: number = 1){
        super(scene.physics.world, scene, { enable: false, runChildUpdate: true });

        this.createMultiple({
            key: name,
            classType: type,
            frameQuantity: quantity,
            active: false,
            visible: false,
        });

        scene.add.existing(this);
    }

    spawnInstance(point?: IVectorPoint){
        const instance = this.getFirstDead(false);

        if(instance){
            instance.updateTransform(point);
        }

        return instance;
    }

    launchGroup(pos: Phaser.Types.Math.Vector2Like, spacing : Phaser.Types.Math.Vector2Like, groupSize: number) {
        const startingY = Phaser.Math.Between(pos.y! - spacing.y!, pos.y! + spacing.y!);

        for (let i =0; i < groupSize; i++) {
            const entity = this.getFirstDead(false);

            if (entity) {
                const startingX = pos.x! + spacing.x! * i;
                entity.enableBody(true, startingX, startingY, true, true);
                // entity.body.velocity.x = -entity.entData.SPEED;
                // entity.body.velocity.y = Phaser.Math.Between(-300, 300);
            }
        }
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

    spawnInstance(name:string, point?: IVectorPoint){
        let instance = undefined;
        const group = this.pList.get(name);

        if(group){
            instance = group.spawnInstance(point);
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