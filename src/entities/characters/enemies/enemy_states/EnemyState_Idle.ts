import Phaser from "phaser";
import { IState, IStateData, State, StateMachine } from "../../../../@types/StateMachine";
import { Enemy, IEnemy } from "../Enemy";
import { EnemyState } from "./EnemyState";

export interface IEnemyStateData_Idle extends IStateData{
    maxIdleTime: number;
    attackRate: number;
}

export class EnemyState_Idle extends EnemyState{
    sData: IEnemyStateData_Idle;
    idleTime: number;

    // constructor(char: Enemy, stateMachine: StateMachine, data: IEnemyBoss, sData: IEnemyIdleStateData){
    //     super(char, stateMachine, data);
    //     this.sData = sData;
    //     this.restTime = 0;
    // }

    constructor(char: Enemy, data: IEnemy, sData: IEnemyStateData_Idle){
        super(char, data, sData);
        this.sData = sData;
        this.idleTime = 0;
    }

    enter(){
        super.enter();

        this.idleTime = Phaser.Math.Between(1, this.sData.maxIdleTime);

        // if(this.char.stateSequence.length == 0){
            
        // }
    }

    update(){
        super.update()

        if(this.char.time() >= this.enterTime + this.idleTime){
            if(Math.random() > this.sData.attackRate){
                this.changeState(this.char.moveState);
            }
            else{
                this.changeState(this.char.attackState);
            }
        }
    }
}