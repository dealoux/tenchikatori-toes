import Phaser from 'phaser';

export interface IVectorPoint{
    pos: Phaser.Math.Vector2;
    theta: number;
}

export interface IEntity{
    pos: Phaser.Math.Vector2;
    texture: string;
    frame?: string | number;
    hitRadius?: number;
    offset?: Phaser.Math.Vector2;
}

export interface IFunctionDelegate{
    () : void;
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
    collisionCategory?: number;

    constructor(scene: Phaser.Scene, { pos, texture, hitRadius = 0, frame }: IEntity, active = false, scale = 1){
        super(scene, pos.x, pos.y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // this.getBody().setCircle(hitRadius/2);
        this.getBody().setSize(hitRadius, hitRadius, true);
        this.getBody().setFriction(0, 0);
        this.getBody().setBounce(0, 0);
        this.setOrigin(.5, .5);
        
        this.setStatus(active);
        
        this.create();
    }

    protected preUpdate(time: number, delta: number){
       
    }

    create(){
        //this.setOnCollide(this.handleCollision);
        //console.log('bruh');
    }

    update() {
        
    }

    updateTransform(point: IVectorPoint){
        this.setPosition(point.pos.x, point.pos.y);
        this.setRotation(point.theta);
        this.enableEntity(point.pos);
    }

    getBody(){
        return this.body as Phaser.Physics.Arcade.Body;
    }

    public handleCollision(entity: Entity){
        console.log(entity);
    }

    protected inCameraView(){
        return this.scene.cameras.main.worldView.contains(this.x, this.y);
    }

    public enableEntity(pos: Phaser.Math.Vector2){
        this.setStatus(true);
        this.enableBody(true, pos.x, pos.y, true, true);
    }

    public disableEntity(){
        this.setStatus(false);

        //this.removeInteractive();
        this.disableBody(true, true);
    }

    protected setStatus(status: boolean | false){
        this.setActive(status);
        this.setVisible(status);
    }

    public setMode(mode: number){
        this.collisionCategory = mode;
    }
}