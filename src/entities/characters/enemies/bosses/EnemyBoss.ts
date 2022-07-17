import Phaser from 'phaser';
import { Projectile } from '../../../projectiles/Projectile';
import { Enemy, IEnemy } from '../Enemy';
import { IEntity, ITexture } from '../../../Entity';
import { IState } from '../../../../@types/StateMachine';

export const YOUSEI1_TEXTURE : ITexture = {
    key: 'yousei1', path: 'assets/sprites/touhou_test/youseis.png', json: 'assets/sprites/touhou_test/youseis.json'
}

export interface IEnemyBoss extends IEnemy{
    maxIdleTime: number,
}

export class EnemyBoss extends Enemy{
    stateSequence : Array<IState>;

    constructor(scene: Phaser.Scene, data: IEnemyBoss){
        super(scene, data);
        this.stateSequence = new Array;
    }

    static preload(scene: Phaser.Scene) {
        // scene.load.atlas(YOUSEI1_TEXTURE.key, YOUSEI1_TEXTURE.path, YOUSEI1_TEXTURE.json);
	}

    static initPManagers(scene: Phaser.Scene){
        // Enemy.bluePManager = new PoolManager(scene);
        // Enemy.redPManager = new PoolManager(scene);

        // Enemy.bluePManager.addGroup(DATA_SHOTBLUE.texture.key, EnemyPBlue, ENEMY_PROJECTILE_POOL);
        // Enemy.redPManager.addGroup(DATA_SHOTRED.texture.key, EnemyPRed, ENEMY_PROJECTILE_POOL);
    }
    
    protected updateHere (){
        //super.updateHere();
    }

    handleCollision(p: Projectile) {
        
    }
}