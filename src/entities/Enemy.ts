import Phaser from 'phaser';
import { Entity, IEntity, ITexture, IVectorPoint } from './Entity';
import { PoolManager } from '../@types/Pool';
import { ENEMY_PROJECTILE_POOL, EnemyPBlue, EnemyPRed, DATA_SHOTBLUE, DATA_SHOTRED } from '../objects/Projectile_Enemy';
import { Character } from './Character';
import { IUpdateArgs, PPatternWave, Projectile } from '../objects/Projectile';
import eventsCenter from '../plugins/EventsCentre';
import { DATA_POWER_ITEM, DATA_SCORE_ITEM } from './items/Item';

export const YOUSEI1_TEXTURE : ITexture = {
    key: 'yousei1', path: 'assets/sprites/touhou_test/youseis.png', json: 'assets/sprites/touhou_test/youseis.json'
}

export class Enemy extends Character{
    static bluePManager : PoolManager;
    static redPManager : PoolManager;
    
    constructor(scene: Phaser.Scene, { pos = Phaser.Math.Vector2.ZERO, texture, frame, offset = Phaser.Math.Vector2.ZERO }: IEntity, hp: number, speed: number){
        super(scene, { pos, texture, frame, offset }, hp, speed);
    }

    static preload(scene: Phaser.Scene) {
        scene.load.image(DATA_SHOTBLUE.texture.key, DATA_SHOTBLUE.texture.path);
        scene.load.image(DATA_SHOTRED.texture.key, DATA_SHOTRED.texture.path);
        scene.load.atlas(YOUSEI1_TEXTURE.key, YOUSEI1_TEXTURE.path, YOUSEI1_TEXTURE.json);
	}

    static initPManagers(scene: Phaser.Scene){
        Enemy.bluePManager = new PoolManager(scene);
        Enemy.redPManager = new PoolManager(scene);

        Enemy.bluePManager.addGroup(DATA_SHOTBLUE.texture.key, EnemyPBlue, ENEMY_PROJECTILE_POOL);
        Enemy.redPManager.addGroup(DATA_SHOTRED.texture.key, EnemyPRed, ENEMY_PROJECTILE_POOL);
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

    protected updateHere (){
        //super.updateHere();
        this.actionHandling();
    }

    handleCollision(p: Projectile) {
        this.hp -= p.entData.value || 0;

        if(this.hp <= 0){
            Character.itemManager.emitItems(this.x, this.y);
            this.disableEntity();
        }
        
        // console.log(this.hp);
    }

    handleCollisionChar(char: Character){
        super.handleCollisionChar(char);
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