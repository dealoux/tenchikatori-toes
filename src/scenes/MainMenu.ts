import Phaser, { Scene } from 'phaser';
import { eventsCenter } from '../plugins/EventsCentre';
import { SCENE_NAMES, TEXTURE_FLIXEL_BUTTON } from '../constants';

export class MainMenu extends Scene {
	constructor() {
		super(SCENE_NAMES.MainMenu);
	}

	preload() {
		this.load.spritesheet(TEXTURE_FLIXEL_BUTTON.key, TEXTURE_FLIXEL_BUTTON.path, { frameWidth: 80, frameHeight: 20 });
	}

	create() {
		this.stage1();
		
		// this.makeButton
	}

	update() {
	}
	
	private stage1(){
		this.scene.start(SCENE_NAMES.Stage1_Gameplay);
		this.scene.start(SCENE_NAMES.HUD);
	}

	private createButton(text: string, index: number){
		var button = this.add.image(680, 115 + index*40, TEXTURE_FLIXEL_BUTTON.key, 1).setInteractive();
		button.setScale(2, 1.5);

		var textDisplay = this.add.bitmapText(button.x - 40, button.y - 8, 'nokia', text, 16);
		textDisplay.x += (button.width - textDisplay.width)/2;
	}
	
	private setButtonFrame(button: Phaser.GameObjects.Image, frame: number){
		button.frame = button.scene.textures.getFrame(TEXTURE_FLIXEL_BUTTON.key, frame);
	}
}