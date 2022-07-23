import Phaser from "phaser";
import { SCENE_NAMES } from "../constants";
import { IVectorPoint } from "../entities/Entity";
import { eventsCenter, GAMEPLAY_EVENTS } from "../plugins/EventsCentre";
import { InputHandler } from "../plugins/InputHandler";
import GameManager from "../scenes/GameManager";
import { playAudio, SFX } from "../plugins/Audio";

export interface IAsset{
    key: string,
    path: string,
    json?: string,
}

export interface ITexture extends IAsset{
    frameWidth?: number,
    frameHeight?: number,
}

export interface IText{
    text: string,
    font: string,
    point: IVectorPoint,
    textSize?: number,
    textTint?: number,
}

export function addText(scene: Phaser.Scene, textData: IText): Phaser.GameObjects.BitmapText;
export function addText(scene: Phaser.Scene, { text, font, point, textSize: size, textTint: tint }: IText): Phaser.GameObjects.BitmapText;
export function addText(scene: Phaser.Scene, textData: IText){
    return scene.add.bitmapText(textData.point.pos.x, textData.point.pos.y, textData.font, textData.text, textData.textSize).setTintFill(textData.textTint);
};

export interface IButton extends IText{
    buttonTexture: ITexture,
    buttonScale: Phaser.Types.Math.Vector2Like;
}

export class Button extends Phaser.GameObjects.Image{
    buttonData: IButton;
    action: Function;

    constructor(scene: Phaser.Scene, buttonData: IButton, action: Function, frame?: number){
        super(scene, buttonData.point.pos.x, buttonData.point.pos.y, buttonData.buttonTexture.key, frame);
        this.setScale(buttonData.buttonScale.x!, buttonData.buttonScale.y!);
        this.setInteractive();
        scene.add.existing(this);

        let textDisplay = addText(scene, { text: buttonData.text, font: buttonData.font, textSize: buttonData.textSize, textTint: buttonData.textTint, point: { pos: new Phaser.Math.Vector2(buttonData.point.pos.x-buttonData.buttonTexture.frameWidth!/2, buttonData.point.pos.y-buttonData.textSize!/2) }});
		textDisplay.x += (this.width - textDisplay.width)/2;
        
        this.buttonData = buttonData;
        this.action = action;
    }
}

export abstract class UIScene extends Phaser.Scene {
	buttons: Array<Button>;
	currSelected: number;

	constructor(sceneName: string) {
		super(sceneName);
		this.buttons = new Array();
		this.currSelected = 0;
	}

	preload() {
	}

	create() {
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.onShutdown, this);
	}

	update() {
		const {inputs} = InputHandler.Instance();

		if (inputs.Up) {
            playAudio(this, SFX.select);
			this.buttons[this.currSelected--].setFrame(1);
			this.currSelected = this.currSelected == -1 ? this.buttons.length-1 : this.currSelected;
			this.buttons[this.currSelected].setFrame(0);
			inputs.Up = false;
        }
        else if (inputs.Down) {
            playAudio(this, SFX.select);
			this.buttons[this.currSelected++].setFrame(1);
			this.currSelected = this.currSelected == this.buttons.length ? 0 : this.currSelected;
			this.buttons[this.currSelected].setFrame(0);
			inputs.Down = false;
        }

		if(inputs.Shot) {
            playAudio(this, SFX.confirm);
			this.buttons[this.currSelected].setFrame(2);
			this.buttons[this.currSelected].action();
		}
	}
    
    protected onShutdown(){
        this.buttons = new Array();
        this.currSelected = 0;
        InputHandler.Instance().reset();
    }

    protected restartButton(){
		this.scene.stop();
		this.scene.start(GameManager.currStage);
	}

    protected mainMenuButton(){
		this.scene.stop(GameManager.currStage);
		this.scene.start(SCENE_NAMES.MainMenu);
	}
}