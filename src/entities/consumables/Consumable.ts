import Phaser, { Physics } from 'phaser';
import { IProjectileData } from '../../objects/Projectile';
import { IEntity, IVectorPoint, COLLISION_CATEGORIES, Entity, IFunctionDelegate } from '../Entity';

export class Consumable extends Entity{
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

    public handleCollision(){
        this.disableEntity();
    }

    preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);

        // out of view check
        if(!this.inCameraView()){
            this.disableEntity();
        }
    }
}