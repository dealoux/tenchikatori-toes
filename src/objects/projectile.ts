import Phaser from 'phaser';
import { IEntity, COLLISION_GROUPS, IVectorPoint, COLLISION_CATEGORIES, Entity } from '../entities/Entity';

export interface IProjectileData{
    entData: IEntity,
    speed: number,
}

export class Projectile extends Entity{
    scene: Phaser.Scene;
    tracking: boolean;
    scaleSpeed: integer;

    constructor(scene: Phaser.Scene, data: IProjectileData, tracking = false, scaleSpeed = 0){
        super(scene, { pos: data.entData.pos, texture: data.entData.texture, hitRadius: data.entData.hitRadius, frame: data.entData.frame });
        
        this.scene = scene;
        this.tracking = tracking;
        this.scaleSpeed = scaleSpeed;

        //this.setCollidesWith([COLLISION_CATEGORIES.blue, COLLISION_CATEGORIES.red]);
    }

    create(){
        super.create();
    }

    // protected handleCollision(data: Phaser.Types.Physics.Matter.MatterCollisionData){
    //     super.handleCollision(data);

    //     // const {bodyA, bodyB} = data;
    //     // switch(bodyB.gameObject){

    //     // }
    // }

    // fire({x, y, angle = 0, speed, gx = 0, gy = 0, tracking = false, texture = 'bullet5', scaleSpeed = 0, target = null}) {
    //     this.scene.shootSFX.play();
    //         this.enableBody(true, x, y, true, true);   
    //     this.setTexture(texture).setSize()
    //     this.setScale(1)
    //     this.tracking = tracking;
    //     this.scaleSpeed = scaleSpeed;
    //     this.angle = angle;
    //     if (target) {
    //       this.scene.physics.moveToObject(this, this.scene.player, speed)
    //     } else {
    //       this.scene.physics.velocityFromAngle(angle, speed, this.body.velocity);    
    //     }
    //     this.body.gravity.set(gx, gy); // apply gravity to the physics body
    // }

    preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);

        // out of view check
        if(!this.inCameraView()){
            this.setStatus(false);
        }
    }

    // updateTransform(point: VPoint){
    //     super.updateTransform(point);
    // }
}