import Phaser from "phaser";
import { IStateData } from "../../../../plugins/StateMachine";
import { IVectorPoint } from "../../../Entity";
import { Enemy, IEnemy } from "../Enemy";
import { EnemyState } from "./EnemyState";

export interface IEnemyStateData_Spawn extends IStateData{
    spawnPoint: IVectorPoint;
    targetPoint: IVectorPoint;
    duration: number;
}

export class EnemyState_Spawn extends EnemyState{
    sData: IEnemyStateData_Spawn;

    constructor(char: Enemy, data: IEnemy, sData: IEnemyStateData_Spawn){
        super(char, data, sData);
        this.sData = sData;
    }

    enter(){
        this.char.enableEntity(this.sData.spawnPoint.pos);
        this.char.createInvulnerableEffect(100, 24);

        this.char.scene.tweens.add({
            targets: this.char,
            x: this.sData.targetPoint.pos.x,
            y: this.sData.targetPoint.pos.y,
            duration: this.sData.duration,
            onStart: () => { },
            onComplete: () => { this.changeState(this.char.idleState); },
        });
    }
}