import Phaser from 'phaser';
import { PoolGroup } from '../../../plugins/Pool';
import { Character } from '../../characters/Character';
import { Entity, IVectorPoint } from '../../Entity';
import { IPPatternData, PPattern, Projectile } from '../Projectile';

export interface IScalePatternData extends IPPatternData{
    scaleSpeed: number;
}

export class PPatternScale extends PPattern{
    patternData: IScalePatternData;

    constructor(parent: Character, pPoint: IVectorPoint, p: PoolGroup<Projectile> | undefined, pData: IScalePatternData){
        super(parent, pPoint, p, pData);
        this.patternData = pData;
        this.updatePattern = this.scaleBase;
    }

    scaleBase(target?: Entity){
        if(this.parent.time() < this.nextFire) { return; }
        const x = this.parent.x + this.pPoint.pos.x;
        const y = this.parent.y + this.pPoint.pos.y;
        this.projectile?.getFirstDead(false).updateProjectileE({ x: x, y: y, speed : this.patternData.pSpeed, angle: this.pPoint.theta, scaleSpeed: this.patternData.scaleSpeed, target });
        this.nextFire = this.parent.time() + this.patternData.fireRate;
    }
}