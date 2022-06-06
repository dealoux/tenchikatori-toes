import Phaser from 'phaser';
import { IEntity, Entity } from '../entities/Entity';
import { Player } from '../entities/Player';

export interface PPoint{
    pos: Phaser.Math.Vector2;
    theta: number;
}

export class Projectile extends Phaser.Physics.Arcade.Sprite{
    offset: Phaser.Math.Vector2;

    constructor(scene: Phaser.Scene, { pos = new Phaser.Math.Vector2(0, 0), texture, frame }: IEntity, offset: Phaser.Math.Vector2){
        super(scene, pos.x, pos.y, texture , frame);
        this.offset = offset;
        this.active = false;
        this.visible = false;
    }

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
        this.body.reset(point.pos.x + this.offset.x, point.pos.y + this.offset.y);
        this.setAngle(point.theta - 90);
        //this.setRotation(point.theta - Math.PI/2);
        this.setStatus(true);
    }
}

export class ProjectileGroup extends Phaser.Physics.Arcade.Group{
    constructor(scene: Phaser.Scene, name: string, type: Function, quantity: number = 1){
        super(scene.physics.world, scene);

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
}

export class ProjectileManager extends Phaser.Physics.Arcade.Factory{
    pList : Map<string, ProjectileGroup>;
    owner: Function;

    constructor(scene: Phaser.Scene, owner: Function){
        super(scene.physics.world);

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
}