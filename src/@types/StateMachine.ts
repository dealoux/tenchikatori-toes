import Phaser from "phaser";
import { Character, ICharacter } from "../entities/characters/Character";

// declare global { interface Array<T> { seek() : void; } }
// Array.prototype.seek = function() { return this[this.length-1]; }

export interface IState{
    enter(): void;
    exit(): void;
    update(): void;
}

export interface IStateData{
    animKey?: string,
}

export abstract class State implements IState{
    char: Character;
    // stateMachine: StateMachine;
    entData: ICharacter;
    enterTime: number;
    sData: IStateData;

    // constructor(char: Enemy, stateMachine: StateMachine, entData: IEnemyBoss){
    //     this.char = char;
    //     this.stateMachine = stateMachine;
    //     this.entData = entData;
    //     this.enterTime = 0;
    // }

    constructor(char: Character, entData: ICharacter, sData: IStateData){
        this.char = char;
        this.entData = entData;
        this.enterTime = 0;
        this.sData = sData;
    }

    enter(): void {
        this.enterTime = this.char.time();
        this.char.anims.play(this.sData.animKey || '');
    }

    exit(): void {
        
    }

    update(): void {
        
    }

    protected changeState(nextState: IState, savePrevious = false){
        this.char.stateMachine.changeState(nextState, savePrevious);
    }
}

// Pushdown automata
export class StateMachine{
    states : Array<IState>;
    parent: Character

    constructor(parent: Character){
        this.states = new Array;
        this.parent = parent;
    }

    currState() : IState{
        //console.log(this.states[this.states.length-1]);
        return this.states[this.states.length-1];
        // return this.States.seek();
    }

    initialize(startingState: IState){
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