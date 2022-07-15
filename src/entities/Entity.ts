import Phaser from 'phaser';

export interface IVectorPoint{
    pos: Phaser.Math.Vector2;
    theta: number;
}

export interface ITexture{
    key: string,
    path: string,
    json?: string
}

export interface IEntity{
    pos: Phaser.Math.Vector2;
    texture: ITexture;
    frame?: string | number;
    hitSize?: Phaser.Math.Vector2;
    offset?: Phaser.Math.Vector2;
}

export interface IFunctionDelegate{
    () : void;
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
    updateDelegate: IFunctionDelegate;
    preUpdateDelegate: IPreUpdateDelegate;
    entData?: IEntity;
    collisionCategory?: number;
    static worldsEdge: Phaser.Geom.Rectangle;

    constructor(scene: Phaser.Scene, { pos, texture, hitSize: hitSize = Phaser.Math.Vector2.ZERO, frame }: IEntity, active = false, scale = 1){
        super(scene, pos.x, pos.y, texture.key, frame);

        this.updateDelegate = this.updateHere;
        this.preUpdateDelegate = this.preUpdateHere;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // this.getBody().setCircle(hitRadius/2);
        this.getBody().setSize(hitSize.x, hitSize.y, true);
        this.getBody().setFriction(0, 0);
        this.getBody().setBounce(0, 0);
        this.setScale(scale);
        this.setOrigin(.5, .5);
        
        if(!active)
            this.disableEntity();
        
        this.create();
    }

    protected emptyFunction() {}

    protected inCameraView(){
        // return this.scene.cameras.main.worldView.contains(this.x, this.y);
        return Entity.worldsEdge.contains(this.x, this.y);
    }

    protected setStatus(status: boolean | false){
        this.setActive(status);
        this.setVisible(status);
    }

    protected updateHere(){ }
    protected preUpdateHere(time: number, delta: number) {}

    static setWorldsEdge(scene: Phaser.Scene){
        const { worldView } = scene.cameras.main;
        const offset = new Phaser.Math.Vector2(worldView.width * .125, worldView.height * .125);

        Entity.worldsEdge = new Phaser.Geom.Rectangle(worldView.x - offset.x, worldView.y - offset.y, worldView.width * 1.25, worldView.height * 1.25);
    }

    create(){
        //this.setOnCollide(this.handleCollision);
        //console.log('bruh');
    }

    preUpdate(time: number, delta: number){
        this.preUpdateDelegate(time, delta);
    } 

    update() {
        this.updateDelegate();
    }

    updateTransform(point: IVectorPoint){
        this.setPosition(point.pos.x, point.pos.y);
        this.setRotation(point.theta);
        this.enableEntity(point.pos);
    }

    getBody(){
        return this.body as Phaser.Physics.Arcade.Body;
    }

    handleCollision(entity: Entity){
        console.log(entity);
    }

    enableEntity(pos: Phaser.Math.Vector2){
        this.setStatus(true);
        this.enableBody(true, pos.x, pos.y, true, true);
        this.updateDelegate = this.updateHere;
        this.preUpdateDelegate = this.preUpdateHere;

    }

    disableEntity(){
        this.setStatus(false);
        this.disableBody(true, true);
        this.updateDelegate = this.emptyFunction;
        this.preUpdateDelegate = this.emptyFunction;
        //this.removeInteractive();
    }

    setMode(mode: number){
        this.collisionCategory = mode;
    }
}