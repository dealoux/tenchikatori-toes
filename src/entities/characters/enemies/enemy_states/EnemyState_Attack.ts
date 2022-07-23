import Phaser from "phaser";
import { ICharacterStateData } from "../../Character";
import { IVectorPoint } from "../../../Entity";
import { PPattern } from "../../../projectiles/Projectile";
import { Enemy, IEnemy } from "../Enemy";
import { EnemyState } from "./EnemyState";

export interface IEnemyStateData_Attack extends ICharacterStateData{
}

export class EnemyState_Attack extends EnemyState{
    sData: IEnemyStateData_Attack;
    shootPoint: IVectorPoint;
    currAttack?: PPattern;

    constructor(char: Enemy, entData: IEnemy, sData: IEnemyStateData_Attack){
        super(char, entData, sData);
        this.sData = sData;

        this.shootPoint = { pos: new Phaser.Math.Vector2(0, 30), theta: 90 };
    }

    enter(){
        super.enter();
        this.currAttack = this.char.attacks.get('key');
    }

    update(time: number, delta: number){
        super.update(time, delta);

        this.currAttack?.updatePattern();

        if(this.char.time() >= this.enterTime + this.currAttack?.patternData.duration!){
            this.changeState(this.char.idleState)
        }
    }
}