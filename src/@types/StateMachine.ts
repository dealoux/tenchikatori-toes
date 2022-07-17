import Phaser from "phaser";
import { Character } from "../entities/Character";
import { IEntity } from "../entities/Entity";

// declare global { interface Array<T> { seek() : void; } }
// Array.prototype.seek = function() { return this[this.length-1]; }

export interface IState{
    enter(): void;
    exit(): void;
    update(): void;
}

export class State implements IState{
    stateMachine: PushDownAutomata;
    data: IEntity;

    constructor(stateMachine: PushDownAutomata, data: IEntity){
        this.stateMachine = stateMachine;
        this.data = data;
    }

    enter(): void {
        
    }

    exit(): void {
    }

    update(): void {
    }
}

export class PushDownAutomata{
    States : Array<State>;
    parent: Character

    constructor(parent: Character){
        this.States = new Array;
        this.parent = parent;
    }

    currState() : State{
        return this.States[this.States.length-1];
        // return this.States.seek();
    }

    initialize(startingState: State){
        this.States.push(startingState);
    }

    changeState(newState: State, savePrevious = false){
        this.currState().exit();

        if(!savePrevious)
            this.States.pop();

        this.States.push(newState);
        this.currState().enter();
    }

    changeStatePrevious(backUpState: State){
        if(this.States.length > 1){
            this.currState().exit();
            this.States.pop();
        }
        else{
            this.States.push(backUpState);
        }

        try{
            this.currState().enter();
        }
        catch{
            console.log("No previous state available");
        }
    }
}