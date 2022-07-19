import Phaser from 'phaser';
import { PoolManager } from '../../../@types/Pool';
import { ENEMY_PROJECTILE_POOL, EnemyPBlue, EnemyPRed, DATA_SHOTBLUE, DATA_SHOTRED } from '../../projectiles/Projectile_Enemy';
import { Character, ICharacter } from '../Character';
import { Projectile } from '../../projectiles/Projectile';
import eventsCenter from '../../../plugins/EventsCentre';

export interface IEnemy extends ICharacter{

}

export class Enemy extends Character{
    static bluePManager : PoolManager;
    static redPManager : PoolManager;
    
    constructor(scene: Phaser.Scene, data: ICharacter){
        super(scene, data);
    }

    static preload(scene: Phaser.Scene) {
        scene.load.image(DATA_SHOTBLUE.texture.key, DATA_SHOTBLUE.texture.path);
        scene.load.image(DATA_SHOTRED.texture.key, DATA_SHOTRED.texture.path);
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
    }

    handleCollision(p: Projectile) {
        this.hp -= p.entData.value || 0;

        if(this.hp <= 0){
            Character.itemManager.emitItems(this.x, this.y);
            this.disableEntity();
        }
        
        // console.log(this.hp);
    }

    public getBlueGroup(key: string){
        return Enemy.bluePManager.getGroup(key);
    }

    public getRedGroup(key: string){
        return Enemy.redPManager.getGroup(key);
    }
}