import Phaser from "phaser";
import { Character } from "../entities/characters/Character";
import { IEntity } from "../entities/Entity";

// declare global { interface Array<T> { seek() : void; } }
// Array.prototype.seek = function() { return this[this.length-1]; }

export interface IState{
    enter(): void;
    exit(): void;
    update(): void;
}

export class State implements IState{
    stateMachine: StateMachine;
    data: IEntity;

    constructor(stateMachine: StateMachine, data: IEntity){
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

// Pushdown automata
export class StateMachine{
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