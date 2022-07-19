import Phaser from "phaser";
import { IState, StateMachine } from "../../../../@types/StateMachine";
import { IVectorPoint } from "../../../Entity";
import { PPattern } from "../../../projectiles/Projectile";
import { Enemy, IEnemy } from "../Enemy";
import { Enemy_State, IStateData } from "./Enemy_State";

export interface IEnemyAttackStateData extends IStateData{
}

export class Enemy_AttackState extends Enemy_State{
    sData: IEnemyAttackStateData;
    shootPoint: IVectorPoint;
    currAttack?: PPattern;

    // constructor(char: Enemy, stateMachine: StateMachine, entData: IEnemyBoss, sData: IEnemyAttackStateData){
    //     super(char, stateMachine, entData);
    //     this.sData = sData;
    // }

    constructor(char: Enemy, entData: IEnemy, sData: IEnemyAttackStateData){
        super(char, entData, sData);
        this.sData = sData;

        this.shootPoint = { pos: new Phaser.Math.Vector2(0, 30), theta: 90 };
    }

    enter(){
        super.enter();
        this.currAttack = this.char.attacks.get('key');
    }

    update(){
        super.update();

        this.currAttack?.updatePattern();

        if(this.char.time() >= this.enterTime + this.currAttack?.patternData.duration!){
            this.changeState(this.char.idleState)
        }
    }

    protected randomEnum(){}
}