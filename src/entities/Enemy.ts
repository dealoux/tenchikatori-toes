import Phaser from 'phaser';
import { Entity, IEntity, ITexture, IVectorPoint } from './Entity';
import { PoolManager } from '../@types/Pool';
import { ENEMY_PROJECTILE_POOL, EnemyPBlue, EnemyPRed, DATA_SHOTBLUE, DATA_SHOTRED } from '../objects/Projectile_Enemy';
import { Character } from './Character';
import { Projectile } from '../objects/Projectile';
import eventsCenter from '../plugins/EventsCentre';
import { DATA_POWER_ITEM, DATA_SCORE_ITEM, ITEM_POOL, PowerItem, ScoreItem } from './consumables/Consumable';

export const YOUSEI1_TEXTURE : ITexture = {
    key: 'yousei1', path: 'assets/sprites/touhou_test/youseis.png', json: 'assets/sprites/touhou_test/youseis.json'
}

export class Enemy extends Character{
    static bluePManager : PoolManager;
    static redPManager : PoolManager;
    static itemManager : PoolManager;

    constructor(scene: Phaser.Scene, { pos, texture, frame, offset }: IEntity, hp: number, speed: number){
        super(scene, { pos, texture, frame, offset }, hp, speed);
    }

    static preload(scene: Phaser.Scene) {
        scene.load.image(DATA_SHOTBLUE.texture.key, DATA_SHOTBLUE.texture.path);
        scene.load.image(DATA_SHOTRED.texture.key, DATA_SHOTRED.texture.path);
        scene.load.atlas(YOUSEI1_TEXTURE.key, YOUSEI1_TEXTURE.path, YOUSEI1_TEXTURE.json);
	}

    static initPManagers(scene: Phaser.Scene){
        Enemy.bluePManager = new PoolManager(scene, Enemy);
        Enemy.redPManager = new PoolManager(scene, Enemy);

        Enemy.itemManager = new PoolManager(scene, Enemy);

        Enemy.bluePManager.addGroup(DATA_SHOTBLUE.texture.key, EnemyPBlue, ENEMY_PROJECTILE_POOL);
        Enemy.redPManager.addGroup(DATA_SHOTRED.texture.key, EnemyPRed, ENEMY_PROJECTILE_POOL);
        Enemy.itemManager.addGroup(DATA_POWER_ITEM.texture.key, PowerItem, ITEM_POOL);
        Enemy.itemManager.addGroup(DATA_SCORE_ITEM.texture.key, ScoreItem, ITEM_POOL);
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

    public handlePCollision(p: Projectile){
        this.hp -= p.damage;

        if(this.hp <= 0){
            this.disableEntity();
        }
        
        console.log(this.hp);
    }

    public handleCollision(entity: Entity) {
        this.disableEntity();
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