import Phaser from 'phaser';

export enum collisionGroups{
	PLAYER = -1,
	ENEMY = -2,
    OTHER = -3,
}

export enum collisionCategories{
	red = 2,
	blue = 4,
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
    constructor(scene: Phaser.Scene, { pos, texture, collisionGroup, hitRadius, frame }: IEntity, active?: boolean | false){
        super(scene.matter.world, pos.x, pos.y, texture, frame,{
            label: texture,
            //isStatic: true,
            isSensor: true,
            friction: 0,
            frictionAir: 0,
            circleRadius: hitRadius,
            collisionFilter: { group: collisionGroup }
        });

        this.scene.add.existing(this);

        // only active entities are updated
        if(!active){
            this.removeInteractive();
            this.world.remove(this.getBody());
        }

        this.create();
    }

    protected preUpdate(time: number, delta: number){
       
    }

    create(){
        this.setOnCollide(this.handleCollision);
    }

    update() {
        
    }


    getBody(){
        return this.body as MatterJS.BodyType
    }

    protected handleCollision(data: Phaser.Types.Physics.Matter.MatterCollisionData){
        console.dir(data);
    }

    protected setStatus(status: boolean | false){
        this.setActive(status);
        this.setVisible(status);

        if(status == true){
            this.world.add(this.getBody());
        }
            
        else{
            this.removeInteractive();
            this.world.remove(this.getBody());
        }
    }
}