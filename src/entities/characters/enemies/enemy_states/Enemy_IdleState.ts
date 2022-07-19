import Phaser from "phaser";
import { IState, StateMachine } from "../../../../@types/StateMachine";
import { IEnemyBoss, EnemyBoss } from "../bosses/EnemyBoss";
import { Enemy_State, IStateData } from "./Enemy_State";

export interface IEnemyIdleStateData extends IStateData{
    maxIdleTime: number;
    attackRate: number;
}

export class Enemy_IdleState extends Enemy_State{
    sData: IEnemyIdleStateData;
    idleTime: number;

    // constructor(char: Enemy, stateMachine: StateMachine, data: IEnemyBoss, sData: IEnemyIdleStateData){
    //     super(char, stateMachine, data);
    //     this.sData = sData;
    //     this.restTime = 0;
    // }

    constructor(char: EnemyBoss, data: IEnemyBoss, sData: IEnemyIdleStateData){
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