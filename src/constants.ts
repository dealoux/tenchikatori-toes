import { ITexture } from "./@types/UI";

export const TITLE = "Tenchikatori ~ Testament of Empyrean Songbird";
export const ALIAS = "Tenchikatori-ToES";

export const WINDOW_WIDTH = 1920;
export const WINDOW_HEIGHT = 1080;

export const GAMEPLAY_SIZE = {
	WIDTH: WINDOW_WIDTH * .7,
	HEIGHT: WINDOW_HEIGHT * .9,
	OFFSET: 50,
}

export const HUD_SIZE = {
	width: WINDOW_WIDTH-GAMEPLAY_SIZE.OFFSET-GAMEPLAY_SIZE.WIDTH,
	height: WINDOW_HEIGHT * .9,
	offset: new Phaser.Math.Vector2(GAMEPLAY_SIZE.WIDTH + GAMEPLAY_SIZE.OFFSET + 30, GAMEPLAY_SIZE.OFFSET),
};

export const EMPTY_TEXTURE : ITexture = { key: 'empty', path: 'assets/sprites/empty.png' };

export const GOD_SEES_ALL_BG : ITexture = { key: 'godseesall', path: 'assets/sprites/godseesall.png' };

export const TEXTURE_FLIXEL_BUTTON: ITexture = { key:'flixelButton', path: 'assets/sprites/flixelButton.png', frameWidth: 80, frameHeight: 20 };

export const FONT_INTER : ITexture = { key: 'inter', path: 'assets/fonts/inter/inter-regular-outline-2_0.png', json: 'assets/fonts/inter/inter-regular-outline-2.fnt' };

export const FONT_NOKIA : ITexture = { key: 'nokia', path: 'assets/fonts/nokia/nokia16black.png', json: 'assets/fonts/nokia/nokia16black.xml' };

export enum SCENE_NAMES {
	GameManager = 'GameManager',
	MainMenu = 'MainMenu',
	PauseMenu = 'PauseMenu',
	OverMenu = 'OverMenu',
	HUD = 'HUD',
	Stage1_Gameplay = 'Stage1_Gameplay',
}