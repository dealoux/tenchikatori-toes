import Phaser from 'phaser';
import { PoolGroup } from '../../../plugins/Pool';
import { Character } from '../../characters/Character';
import { Entity, IVectorPoint } from '../../Entity';
import { IPPatternData, PPattern, Projectile } from '../Projectile';

export interface IWavePatternData extends IPPatternData{
    wave: Array<number>;
    waveIndex: number;
}

export class PPatternWave extends PPattern{
    patternData: IWavePatternData;

    constructor(parent: Character, pPoint: IVectorPoint, p: PoolGroup<Projectile> | undefined, pData: IWavePatternData){
        super(parent, pPoint, p, pData);
        this.patternData = pData;
        
        this.updatePattern = Math.abs(pPoint.theta!) == 90 ? this.waveVertical : this.waveHorizontal;
    }

    private waveBase(gx = 0, gy = 0, target?: Entity){
        if(this.parent.time() < this.nextFire) { return; }

        const x = this.parent.x + this.pPoint.pos.x;
        const y = this.parent.y + this.pPoint.pos.y;
        this.projectile?.getFirstDead(false).updateProjectileE({ x: x, y: y, speed : this.patternData.pSpeed, angle: this.pPoint.theta, gx: gx, gy: gy, target });
        this.patternData.waveIndex++;
        if (this.patternData.waveIndex === this.patternData.wave.length) {
            this.patternData.waveIndex = 0;
        }

        this.nextFire = this.parent.time() + this.patternData.fireRate;
    }

    waveVertical(target?: Entity) {
        this.waveBase(this.patternData.wave[this.patternData.waveIndex], 0, target);
    }

    waveHorizontal(target?: Entity) {
        this.waveBase(0, this.patternData.wave[this.patternData.waveIndex], target);
    }

    static generateWaveArray(value: number, step : number){
        const s = value/step*2;
        return Phaser.Utils.Array.NumberArrayStep(-value, value, s).concat(Phaser.Utils.Array.NumberArrayStep(value, -value, -s));
    }
}