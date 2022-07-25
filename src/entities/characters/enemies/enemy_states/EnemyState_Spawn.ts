import Phaser from "phaser";
import { ICharacterStateData } from "../../Character";
import { IVectorPoint } from "../../../Entity";
import { Enemy, EnemyWithSpawn, IEnemy } from "../Enemy";
import { EnemyState } from "./EnemyState";
import { emptyFunction } from "../../../../plugins/Utilities";

export interface IEnemyStateData_Spawn extends ICharacterStateData{
    spawnPoint: IVectorPoint;
    targetPoint: IVectorPoint;
    duration: number;
}

export class EnemyState_Spawn extends EnemyState{
    char: EnemyWithSpawn;
    sData: IEnemyStateData_Spawn;

    constructor(char: EnemyWithSpawn, data: IEnemy, sData: IEnemyStateData_Spawn){
        super(char, data, sData);
        this.char = char;
        this.sData = sData;
    }

    enter(){
        this.spawn(this.sData, () => this.nextState());
        this.char.createInvulnerableEffect(100, 24);
    }

    protected spawn(sData: IEnemyStateData_Spawn, onComplete = emptyFunction, onStart = emptyFunction){
        this.char.enableEntity(sData.spawnPoint.pos);
        this.char.tweenMovement(sData.targetPoint, sData.duration, onComplete, onStart );
    }

    protected nextState(){
        this.changeState(this.char.idleState);
        this.char.activeStartTime = this.char.time();
    }
}