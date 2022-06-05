import Phaser from 'phaser';
import { IEntity } from '../entities/Entity';
import { Player, PlayersProjectileType } from '../entities/Player';

export enum projectileOwner{
    Player,
    Enemy,
}

export class Projectile extends Phaser.Physics.Arcade.Sprite{
    offset: Phaser.Math.Vector2;

    constructor(scene: Phaser.Scene, {pos, texture, frame}: IEntity){
        if(!pos)
            pos = new Phaser.Math.Vector2(0, 0);

        super(scene, pos.x, pos.y, texture , frame);

        this.offset = new Phaser.Math.Vector2(32, 0);
    }

    setStatus(status: boolean | false){
        this.setActive(status);
        this.setVisible(status);
    }

    update(x: number, y: number){
        this.body.reset(x + this.offset.x, y + this.offset.y);

        this.setStatus(true);

        this.setVelocityY(-300);
    }

    preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);

        if(this.y <= -32){
            this.setStatus(false);
        }
    }
}

export class ProjectileGroup extends Phaser.Physics.Arcade.Group{
    constructor(scene: Phaser.Scene, name: string, quantity: number | 30){
        super(scene.physics.world, scene);

        this.createMultiple({
            classType: Projectile,
            key: name,
            frameQuantity: quantity,
            active: false,
            visible: false,
        });
    }

    getProjectile(x: number, y: number){
        const projectile = this.getFirstDead(false);

        if(projectile){
            projectile.update(x, y);
        }
    }
}

export class ProjectileManager extends Phaser.GameObjects.Container{
    pList: Map<string, ProjectileGroup>;

    constructor(scene: Phaser.Scene){
        super(scene);

        this.pList = new Map;
    }
}