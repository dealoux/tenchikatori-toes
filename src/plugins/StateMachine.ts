import Phaser from "phaser";
import { Character, ICharacter } from "../entities/characters/Character";

// declare global { interface Array<T> { seek() : void; } }
// Array.prototype.seek = function() { return this[this.length-1]; }

export interface IState{
    enter(): void;
    exit(): void;
    update(time: number, delta: number): void;
    preUpdate(time: number, delta: number): void;
}

// Pushdown automata
export class StateMachine{
    states : Array<IState>;

    constructor(){
        this.states = new Array;
    }

    currState() : IState{
        //console.log(this.states[this.states.length-1]);
        return this.states[this.states.length-1];
        // return this.States.seek();
    }

    initialize(startingState: IState){
        this.states = new Array;
        this.states.push(startingState);
        this.currState().enter();
    }

    changeState(newState: IState, savePrevious = false){
        this.currState().exit();

        if(!savePrevious)
            this.states.pop();

        this.states.push(newState);

        this.currState().enter();

        // console.log(this.states);
    }

    changeStatePrevious(backUpState: IState){
        if(this.states.length > 1){
            this.currState().exit();
            this.states.pop();
        }
        else{
            this.states.push(backUpState);
        }

        try{
            this.currState().enter();
        }
        catch{
            console.log("No previous state available");
        }
    }
}