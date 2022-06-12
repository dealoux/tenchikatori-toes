import Phaser from 'phaser';
import { IEntity, collisionGroups, Entity } from '../entities/Entity';
import { Player } from '../entities/Player';

export interface PPoint{
    pos: Phaser.Math.Vector2;
    theta: number;
}

export interface ProjectileData{
    entData: IEntity,
    speed: number,
}

export class Projectile extends Phaser.Physics.Matter.Sprite{
    constructor(scene: Phaser.Scene, data: ProjectileData){
        super(scene.matter.world, data.entData.pos.x, data.entData.pos.y, data.entData.texture , data.entData.frame, {
            isSensor: true,
            friction: 0,
            frictionAir: 0,
            circleRadius: data.entData.hitRadius,
            collisionFilter: { group: data.entData.collisionGroup }
        });
        scene.add.existing(this);
        this.active = false;
        this.visible = false;
    }

    // create(){
    //     this.on
    // }

    setStatus(status: boolean | false){
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

    update(point: PPoint){
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
            projectile.update(point);
        }
    }

    // update(){
    //     for(let projectile in this){
    //         projectile.update();
    //     }
    // }
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

    // update(){
    //     for(let [key, value] of this.pList){
    //         value.update();
    //     }
    // }
}