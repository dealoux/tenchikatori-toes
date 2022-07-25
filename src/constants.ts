import { ITexture } from "./scenes/UI";

export const TITLE = 'Tenchikatori ~ Testament of Empyrean Songbird';
export const ALIAS = 'Tenchikatori-ToES';

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

export const EMPTY_TEXTURE: ITexture = { key: 'empty', path: 'assets/sprites/empty.png' };

export const GOD_SEES_ALL_BG: ITexture = { key: 'godseesall', path: 'assets/sprites/godseesall.png' };

export const TEXTURE_FLIXEL_BUTTON: ITexture = { key:'flixelButton', path: 'assets/sprites/flixelButton.png', frameWidth: 80, frameHeight: 20 };

export const FONT_INTER: ITexture = { key: 'inter', path: 'assets/fonts/inter/inter-regular-outline-2_0.png', json: 'assets/fonts/inter/inter-regular-outline-2.fnt' };
export const FONT_NOKIA: ITexture = { key: 'nokia', path: 'assets/fonts/nokia/nokia16black.png', json: 'assets/fonts/nokia/nokia16black.xml' };
export const TEXT_BOX: ITexture = { key: 'textbox', path: 'assets/sprites/textbox.png', };

export const YOUSEI_SPRITES: ITexture = { key: 'youseis', path: 'assets/sprites/touhou_test/youseis.png', json: 'assets/sprites/touhou_test/youseis.json' };

export const ENNA_TEXTURE: ITexture = { key: 'enna', path: 'assets/sprites/touhouenna.png', };
export const ENNA_STAND: ITexture = { key: 'enna_stand', path: 'assets/sprites/enna_stand.png', };

export const CHILNO_TEXTURE : ITexture = { key: 'chilno', path: 'assets/sprites/touhou_test/chilno.png', json: 'assets/sprites/touhou_test/chilno.json' };
export const CHILNO_STAND: ITexture = { key: 'chilno_Stand', path: 'assets/sprites/touhou_test/chilno_stand.png' };

export enum SCENE_NAMES {
	GameManager = 'GameManager',
	MainMenu = 'MainMenu',
	PauseMenu = 'PauseMenu',
	OverMenu = 'OverMenu',
	HUD = 'HUD',
	Stage1_Gameplay = 'Stage1_Gameplay',
	Stage2_Gameplay = 'Stage2_Gameplay',
}