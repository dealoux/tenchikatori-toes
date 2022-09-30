import Phaser from 'phaser';
import { Entity, IVectorPoint } from '../entities/Entity';

export class PoolGroup<T extends Entity> extends Phaser.Physics.Arcade.Group{
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
        const instance = this.getFirstDead(false) as T;

        if(instance){
            instance.enableEntity(point);
        }

        return instance;
    }

    spawnGroup(pos: Phaser.Types.Math.Vector2Like, spacing : Phaser.Types.Math.Vector2Like, speed: Phaser.Types.Math.Vector2Like, groupSize: number) {
        let temp = new Array<T>();

        for (let i =0; i < groupSize; i++) {
            const entity = this.getFirstDead(false) as T;

            if (entity) {
                const startingY = Phaser.Math.Between(pos.y! - spacing.y!, pos.y! + spacing.y!);
                const startingX = pos.x! + spacing.x! * i;
                entity.enableEntity({ pos: new Phaser.Math.Vector2(startingX, startingY) });
                entity.body.velocity.x = speed.x!;
                entity.body.velocity.y = Phaser.Math.Between(-speed.y!, speed.y!);
                temp.push(entity);
            }
        }

        return temp;
    }
}

export class PoolManager<T extends Entity> extends Phaser.Physics.Arcade.Factory{
    pList : Map<string, PoolGroup<T>>;

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

    spawnGroup(name: string, pos: Phaser.Types.Math.Vector2Like, spacing : Phaser.Types.Math.Vector2Like, speed: Phaser.Types.Math.Vector2Like, groupSize: number){
        let instance = undefined;
        const group = this.pList.get(name);

        if(group){
            return instance = group.spawnGroup(pos, spacing, speed, groupSize);
        }
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