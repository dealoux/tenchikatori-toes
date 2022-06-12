import Phaser from 'phaser';
import { IEntity, collisionGroups, collisionCategories, Entity } from '../entities/Entity';

export interface PPoint{
    pos: Phaser.Math.Vector2;
    theta: number;
}

export interface ProjectileData{
    entData: IEntity,
    speed: number,
}

export class Projectile extends Entity{
    constructor(scene: Phaser.Scene, data: ProjectileData){
        super(scene, { pos: data.entData.pos, texture: data.entData.texture, collisionGroup: data.entData.collisionGroup, hitRadius: data.entData.hitRadius, frame: data.entData.frame, offset: data.entData.offset });

        this.setCollidesWith([collisionCategories.blue, collisionCategories.red]);
    }

    // create(){
    //     this.on
    // }

    protected setStatus(status: boolean | false){
        this.setActive(status);
        this.setVisible(status);
    }

    preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);

        // out of view check
        if(!this.scene.cameras.main.worldView.contains(this.x, this.y)){
            this.setStatus(false);
        }
    }

    updateTransform(point: PPoint){
        this.setPosition(point.pos.x, point.pos.y);
        this.setRotation(point.theta);
        this.setStatus(true);
    }
}

export class ProjectileGroup extends Phaser.GameObjects.Group{
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

    getProjectile(point : PPoint){
        const projectile = this.getFirstDead(false);

        if(projectile){
            projectile.updateTransform(point);
        }
    }
}

export class ProjectileManager extends Phaser.Physics.Matter.Factory{
    pList : Map<string, ProjectileGroup>;
    owner: Function;

    constructor(scene: Phaser.Scene, owner: Function){
        super(scene.matter.world);

        this.pList = new Map;
        this.owner = owner;
    }

    getP(name:string, point : PPoint){
        const group = this.pList.get(name);

        if(group){
            group.getProjectile(point);
        }
    }

    addPGroup(name: string, type: Function, quantity: number = 1){
        if(!this.pList.has(name))
            this.pList.set(name, new ProjectileGroup(this.scene, name, type, quantity));
    }
}