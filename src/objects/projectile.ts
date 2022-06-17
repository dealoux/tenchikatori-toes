import Phaser from 'phaser';
import { IEntity, COLLISION_GROUPS, VPoint, COLLISION_CATEGORIES, Entity } from '../entities/Entity';

export interface ProjectileData{
    entData: IEntity,
    speed: number,
}

export class Projectile extends Entity{
    constructor(scene: Phaser.Scene, data: ProjectileData){
        super(scene, { pos: data.entData.pos, texture: data.entData.texture, collisionGroup: data.entData.collisionGroup, hitRadius: data.entData.hitRadius, frame: data.entData.frame, offset: data.entData.offset });

        //this.setCollidesWith([collisionCategories.blue, collisionCategories.red]);
    }

    create(){
        super.create();
    }

    protected handleCollision(data: Phaser.Types.Physics.Matter.MatterCollisionData){
        super.handleCollision(data);

        // const {bodyA, bodyB} = data;
        // switch(bodyB.gameObject){

        // }
    }

    preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);

        // out of view check
        if(!this.scene.cameras.main.worldView.contains(this.x, this.y)){
            this.setStatus(false);
        }
    }

    // updateTransform(point: VPoint){
    //     super.updateTransform(point);
    // }
}