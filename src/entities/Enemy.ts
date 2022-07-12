import Phaser from 'phaser';
import {IEntity, IVectorPoint } from './Entity';
import { PoolManager } from '../@types/Pool';
import { SHOTPOOL_ENEMY, EnemyPBlue, EnemyPRed, DATA_SHOTBLUE, DATA_SHOTRED } from '../objects/Projectile_Enemy';
import { Character, Characters } from './Character';
import eventsCenter from '../plugins/EventsCentre';

export class Enemy extends Character{
    static bluePManager : PoolManager;
    static redPManager : PoolManager;

    constructor(scene: Phaser.Scene, { pos, texture, frame, offset }: IEntity, hp: number, speed: number){
        super(scene, { pos, texture, hitRadius: 0, frame, offset }, hp, speed);
    }

    static preload(scene: Phaser.Scene) {
        scene.load.image(DATA_SHOTBLUE.entData.texture, 'assets/sprites/touhou_test/shotBlue.png');
        scene.load.image(DATA_SHOTRED.entData.texture, 'assets/sprites/touhou_test/shotRed.png');
        scene.load.atlas(Characters.YOUSEIS, 'assets/sprites/touhou_test/youseis.png', 'assets/sprites/touhou_test/youseis.json');
	}

    static initPManager(scene: Phaser.Scene){
        Enemy.bluePManager = new PoolManager(scene, Enemy);
        Enemy.redPManager = new PoolManager(scene, Enemy);

        Enemy.bluePManager.addGroup(DATA_SHOTBLUE.entData.texture, EnemyPBlue, SHOTPOOL_ENEMY);
        Enemy.redPManager.addGroup(DATA_SHOTRED.entData.texture, EnemyPRed, SHOTPOOL_ENEMY);
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

    public handleCollision() {
        this.setStatus(false);
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