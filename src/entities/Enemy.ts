import Phaser from 'phaser';
import {IEntity, IVectorPoint, COLLISION_GROUPS } from './Entity';
import { PoolGroup, PoolManager } from '../@types/Pool';
import { Projectile, IProjectileData } from '../objects/Projectile';
import eventsCenter from '../plugins/EventsCentre';
import { SHOTPOOL_ENEMY, EnemyShotBlue, EnemyShotRed, DATA_SHOTBLUE as DATA_SHOTBLUE, DATA_SHOTRED as DATA_SHOTRED } from '../objects/Projectile_Enemy';
import { Character, Characters } from './Character';

export class Enemy extends Character{
    constructor(scene: Phaser.Scene, { pos, texture, frame, offset }: IEntity, hp: number, speed: number, projectileManager: PoolManager){
        super(scene, { pos, texture, hitRadius: 0, frame, offset }, hp, speed, projectileManager);

        this.projectileManager?.addPGroup(DATA_SHOTBLUE.entData.texture, EnemyShotBlue, SHOTPOOL_ENEMY);
        this.projectileManager?.addPGroup(DATA_SHOTRED.entData.texture, EnemyShotRed, SHOTPOOL_ENEMY);
        //this.projectileManager.pList.set(PlayersProjectileType.special, new ProjectileGroup(scene, PlayersProjectileType.special, 2));
    }

    static preload(scene: Phaser.Scene) {
        scene.load.image(DATA_SHOTBLUE.entData.texture, 'assets/sprites/touhou_test/shotBlue.png');
        scene.load.image(DATA_SHOTRED.entData.texture, 'assets/sprites/touhou_test/shotRed.png');
        scene.load.atlas(Characters.YOUSEIS, 'assets/sprites/touhou_test/youseis.png', 'assets/sprites/touhou_test/youseis.json');
	}
    
    getDamage(value?: number): void {
        this.scene.tweens.add({
            targets: this,
            duration: 100,
            repeat: 3,
            yoyo: true,
            alpha: 0.5,
            onStart: () => {
                if (value) {
                    this.hp = this.hp - value;
                }
            },
            onComplete: () => {
                this.setAlpha(1);
            },
        });
    }

    // create(){
    //     super.create();

    // }

    update(){
        //super.update();
        this.actionHandling();
    }

    protected actionHandling(){

    }

    protected shoot(){
    }

    protected special(){
        // const shot = this.projectileManager.pList.get(PlayersProjectileType.special);

        // if(shot){
        //     this.castingSpecial = true;
        //     eventsCenter.emit(PlayerEvents.special);
        //     shot.getProjectile(this.getBody().x, this.getBody().y);
        //     this.specials--; 
        // }
    }
}

export class EnemyGroup extends Phaser.GameObjects.Group{
    constructor(scene: Phaser.Scene, name: string, type: Function, quantity: number = 1){
        super(scene);

        this.createMultiple({
            key: name,
            classType: type,
            frameQuantity: quantity,
            active: false,
            visible: false,
        });
    }

    getProjectile(point : IVectorPoint){
        const projectile = this.getFirstDead(false);

        if(projectile){
            projectile.updateTransform(point);
        }
    }
}

export class EnemyManager extends Phaser.Physics.Matter.Factory{
    pList : Map<string, EnemyGroup>;
    owner: Function;

    constructor(scene: Phaser.Scene, owner: Function){
        super(scene.matter.world);

        this.pList = new Map;
        this.owner = owner;
    }

    getP(name:string, point : IVectorPoint){
        const group = this.pList.get(name);

        if(group){
            group.getProjectile(point);
        }
    }

    addPGroup(name: string, type: Function, quantity: number = 1){
        if(!this.pList.has(name))
            this.pList.set(name, new EnemyGroup(this.scene, name, type, quantity));
    }
}