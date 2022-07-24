import Phaser from 'phaser';
import { ITexture } from '../scenes/UI';
import { EMPTY_TEXTURE } from '../constants';

export interface IVectorPoint{
    pos: Phaser.Math.Vector2;
    theta?: number;
}

export const DEFAULT_VECTOR_POINT : IVectorPoint ={
    pos: new Phaser.Math.Vector2(0, 0),
    theta: 0,
}

export interface IEntity{
    pos?: Phaser.Math.Vector2,
    texture: ITexture,
    frame?: string | number,
    hitSize?: Phaser.Math.Vector2,
    offset?: Phaser.Math.Vector2,
    collisionCategory?: number,
}

export interface IPreUpdateDelegate{
    (time: number, delta: number) : void;
}

// export enum COLLISION_GROUPS{
// 	PLAYER = -1,
// 	ENEMY = -2,
//     OTHER = -3,
// }

export enum COLLISION_CATEGORIES{
	red = 2,
	blue = 4,
}

export class Entity extends Phaser.Physics.Arcade.Sprite{
    entData?: IEntity;
    collisionCategory?: number;
    static worldsEdge: Phaser.Geom.Rectangle;

    constructor(scene: Phaser.Scene, entData: IEntity, active = false, scale = 1, frame = 0){
        super(scene, entData.pos?.x || 0, entData.pos?.y || 0, entData.texture.key || EMPTY_TEXTURE.key, frame);

        this.entData = entData;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // this.getBody().setCircle(hitRadius/2);
        this.getBody().setSize(entData.hitSize?.x || 0, entData.hitSize?.y || 0, true);
        this.getBody().setFriction(0, 0);
        this.getBody().setBounce(0, 0);
        this.setScale(scale);
        this.setOrigin(.5, .5);

        if(!active)
            this.disableEntity();
        
        this.create();
    }

    protected inCameraView(){
        // return this.scene.cameras.main.worldView.contains(this.x, this.y);
        return Entity.worldsEdge.contains(this.x, this.y);
    }

    static setWorldsEdge(scene: Phaser.Scene){
        const { worldView } = scene.cameras.main;
        const offset = new Phaser.Math.Vector2(worldView.width * .125, worldView.height * .125);

        Entity.worldsEdge = new Phaser.Geom.Rectangle(worldView.x - offset.x, worldView.y - offset.y, worldView.width * 1.25, worldView.height * 1.25);
    }

    create(){
    }

    preUpdate(time: number, delta: number){
    } 

    update(time: number, delta: number) {
    }

    getBody(){ return this.body as Phaser.Physics.Arcade.Body; }

    updateTransform(point: IVectorPoint = DEFAULT_VECTOR_POINT){
        // this.setPosition(point.pos.x, point.pos.y);
        this.setRotation(point.theta);
        this.enableEntity(point.pos);
    }

    setStatus(status: boolean | false){
        this.setActive(status);
        this.setVisible(status);
    }

    enableEntity(pos = DEFAULT_VECTOR_POINT.pos){
        this.setStatus(true);
        this.enableBody(true, pos.x, pos.y, true, true);
    }

    disableEntity(){
        this.setStatus(false);
        this.disableBody(true, true);
        //this.removeInteractive();
    }

    setCollisionCategory(mode: number){
        this.collisionCategory = mode;
    }
}