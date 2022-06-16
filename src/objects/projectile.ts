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

    create(){
        super.create();
    }

    protected handleCollision(data: Phaser.Types.Physics.Matter.MatterCollisionData){
        //super.handleCollision(data);

        const {bodyA, bodyB} = data;
        switch(bodyB.gameObject){

        }
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