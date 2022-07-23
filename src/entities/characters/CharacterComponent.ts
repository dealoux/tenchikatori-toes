import Phaser from 'phaser';
import { IComponent } from '../../plugins/Component';
import { Character } from './Character';

export abstract class CharacterComponent implements IComponent{
    protected char!: Character;

    init(go: Phaser.GameObjects.GameObject){
        this.char = go as Character;
    }
}

export interface IUIBar{
    size: Phaser.Types.Math.Vector2Like,
    offset: Phaser.Types.Math.Vector2Like,
    fillColour?: number,
}

export class UIBarComponent extends CharacterComponent{
    graphics?: Phaser.GameObjects.Graphics;
    barData: IUIBar;

    constructor(barData: IUIBar){
        super();
        this.barData = barData;
    }

    display(currValue = 0, maxValue = 1){
        if(!this.graphics) { return; }

        this.graphics.clear();

        this.graphics.fillStyle(0xcfcfcf);
        this.graphics.fillRect(0, 0, this.barData.size.x!, this.barData.size.y!);

        let currBarSize = (this.barData.size.x!-4) * (currValue/maxValue);
        this.graphics.fillStyle(this.barData.fillColour!);
        this.graphics.fillRect(2, 2, currBarSize, this.barData.size.y!-4);
    }

    start(){
        const {scene} = this.char;
        this.graphics = scene.add.graphics();
    }

    update(time: number, delta: number){
        if(!this.graphics){ return; }

        this.graphics.x = this.char.x + this.barData.offset.x!;
        this.graphics.y = this.char.y + this.barData.offset.y!;
    }

    enable(){
        if(!this.graphics){ return; }

        this.graphics.setActive(true);
        this.graphics.setVisible(true);
    }

    disable(){
        if(!this.graphics){ return; }

        this.graphics.setActive(false);
        this.graphics.setVisible(false);
    }
}