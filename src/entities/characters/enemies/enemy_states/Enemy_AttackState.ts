import Phaser from "phaser";
import { IState, StateMachine } from "../../../../@types/StateMachine";
import { IVectorPoint } from "../../../Entity";
import { IWavePatternData, PPattern, PPatternWave } from "../../../projectiles/Projectile";
import { DATA_SHOTBLUE, DATA_SHOTRED } from "../../../projectiles/Projectile_Enemy";
import { IEnemyBoss, EnemyBoss } from "../bosses/EnemyBoss";
import { Enemy_State, IStateData } from "./Enemy_State";

export interface IEnemyAttackStateData extends IStateData{
}

const WAVEPATTERN_CHILNO : IWavePatternData = {
    pSpeed : 250,
    fireRate : 30,
    wave: PPatternWave.generateWaveArray(400, 16),
    waveIndex: 0,
    duration: 250,
}

export class Enemy_AttackState extends Enemy_State{
    sData: IEnemyAttackStateData;
    attacks: Map<string, PPattern>;
    shootPoint: IVectorPoint;
    currAttack?: PPattern;

    // constructor(char: Enemy, stateMachine: StateMachine, entData: IEnemyBoss, sData: IEnemyAttackStateData){
    //     super(char, stateMachine, entData);
    //     this.sData = sData;
    // }

    constructor(char: EnemyBoss, entData: IEnemyBoss, sData: IEnemyAttackStateData){
        super(char, entData, sData);
        this.sData = sData;

        this.shootPoint = { pos: new Phaser.Math.Vector2(0, 30), theta: 90 };
        this.attacks = new Map([
            ['key', new PPatternWave(this.char, this.shootPoint, this.char.getBlueGroup(DATA_SHOTBLUE.texture.key), WAVEPATTERN_CHILNO)]
        ]);
    }

    enter(){
        super.enter();
        this.currAttack = this.attacks.get('key');
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