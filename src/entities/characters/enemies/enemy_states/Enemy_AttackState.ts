import Phaser from "phaser";
import { IState, StateMachine } from "../../../../@types/StateMachine";
import { IEnemyBoss, EnemyBoss } from "../bosses/EnemyBoss";
import { Enemy_State } from "./Enemy_State";

export interface IEnemyAttackStateData{

}

export class Enemy_AttackState extends Enemy_State{
    sData: IEnemyAttackStateData;

    // constructor(char: Enemy, stateMachine: StateMachine, entData: IEnemyBoss, sData: IEnemyAttackStateData){
    //     super(char, stateMachine, entData);
    //     this.sData = sData;
    // }

    constructor(char: EnemyBoss, entData: IEnemyBoss, sData: IEnemyAttackStateData){
        super(char, entData);
        this.sData = sData;
    }

    enter(){
        super.enter();

    }

    update(){
        super.update()
    }
}