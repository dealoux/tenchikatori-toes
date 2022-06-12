import Phaser from 'phaser';

export enum collisionGroups{
	PLAYER = -1,
	ENEMY = -2,
    OTHER = -3,
}

export enum collisionCategories{
	red = 1,
	blue = 2,
}

export interface IEntity{
    pos: Phaser.Math.Vector2;
    texture: string;
    frame?: string | number;
    collisionGroup?: collisionGroups;
    hitRadius?: number;
    offset?: Phaser.Math.Vector2;
}

export class Entity extends Phaser.Physics.Matter.Sprite{
    constructor(scene: Phaser.Scene, { pos, texture, collisionGroup, hitRadius, frame }: IEntity){
        super(scene.matter.world, pos.x, pos.y, texture, frame,{
            label: 'hitbox',
            //isStatic: true,
            isSensor: true,
            friction: 0,
            frictionAir: 0,
            circleRadius: hitRadius,
            collisionFilter: { group: collisionGroup }
        });

        scene.add.existing(this);
    }

    protected getBody(){
        return this.body as MatterJS.BodyType
    }

    protected preUpdate(time: number, delta: number){
       
    }

    create(){
        this.setOnCollide(this.handleCollision);
    }

    update() {
        
    }

    protected handleCollision(data: Phaser.Types.Physics.Matter.MatterCollisionData){
        console.dir(data);
    }
}