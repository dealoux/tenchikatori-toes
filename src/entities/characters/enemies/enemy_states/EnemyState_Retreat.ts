import Phaser from "phaser";
import { ICharacterStateData } from "../../Character";
import { Entity, IVectorPoint } from "../../../Entity";
import { Enemy, EnemyWithSpawn, IEnemy } from "../Enemy";
import { EnemyState } from "./EnemyState";
import { emptyFunction } from "../../../../plugins/Utilities";

export interface IEnemyStateData_Retreat extends ICharacterStateData{
    activeDuration: number;
}

export class EnemyState_Retreat extends EnemyState{
    char: EnemyWithSpawn;
    sData: IEnemyStateData_Retreat;

    constructor(char: EnemyWithSpawn , data: IEnemy, sData: IEnemyStateData_Retreat){
        super(char, data, sData);
        this.char = char;
        this.sData = sData;
    }

    enter(){
        this.char.tweenMovement({ pos: new Phaser.Math.Vector2(this.char.x, Entity.worldsEdge.top-1) }, 2400, () => this.char.onRetreat() );
    }
}