import Phaser from "phaser";
import { IState, StateMachine } from "../../../../@types/StateMachine";
import { IVectorPoint } from "../../../Entity";
import { IEnemyBoss, EnemyBoss } from "../bosses/EnemyBoss";
import { Enemy_State, IStateData } from "./Enemy_State";

export interface IEnemyMoveStateData extends IStateData{
    locations: Array<IVectorPoint>
}

export class Enemy_MoveState extends Enemy_State{
    sData: IEnemyMoveStateData;
    currIndex: number

    // constructor(char: Enemy, stateMachine: StateMachine, entData: IEnemyBoss, sData: IEnemyMoveStateData){
    //     super(char, stateMachine, entData);
    //     this.sData = sData;
    // }

    constructor(char: EnemyBoss, entData: IEnemyBoss, sData: IEnemyMoveStateData){
        super(char, entData, sData);
        this.sData = sData;
        this.currIndex = 0;
    }

    enter(){
        super.enter();
        this.moveTo(this.getNextPos(), this.nextState.bind(this));
    }

    update(){
        super.update();
    }

    protected getNextPos() : IVectorPoint{
        let index = Phaser.Math.Between(0, this.sData.locations.length-1);
        while(index == this.currIndex){
            index = Phaser.Math.Between(0, this.sData.locations.length-1);
        }

        this.currIndex = index;
        return this.sData.locations[this.currIndex];
    }

    protected nextState(){
        this.changeState(this.char.idleState);
    }
    
    protected moveTo(point: IVectorPoint, completeFunc: Function){
        let distance = point.pos.distance(new Phaser.Math.Vector2(this.char.x, this.char.y));
        const movementDuration = (distance / this.entData.speed!) * 1000;
        // const { movementDuration } = this.entData;

        // console.log(movementDuration);

        return this.char.scene.tweens.add({
            targets: this.char,
            x: point.pos.x,
            y: point.pos.y,
            duration: movementDuration,
            ease: 'Sine.easeInOut',
            onComplete: completeFunc(),
        });

        // this.char.scene.physics.moveTo(this.char, point.pos.x, point.pos.y, this.entData.speed, movementDuration);
        // completeFunc();
    }
}