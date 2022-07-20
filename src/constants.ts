import { ITexture } from "./entities/Entity";

export const TITLE = "Tenchikatori ~ Testament of Empyrean Songbird";
export const ALIAS = "Tenchikatori-ToES";

export const WINDOW_WIDTH = 1920;
export const WINDOW_HEIGHT = 1080;

export const EMPTY_TEXTURE : ITexture = { key: 'empty', path: 'assets/sprites/empty.png' };

export const GOD_SEES_ALL_BG : ITexture = { key: 'godseesall', path: 'assets/sprites/godseesall.png' };

export const TEXTURE_FLIXEL_BUTTON: ITexture = { key:'flixelButton', path: 'assets/spirtes/flixelButton.png', };

export const FONT_INTER : ITexture = { key: 'inter', path: 'assets/fonts/inter-regular-outline-2_0.png', json: 'assets/fonts/inter-regular-outline-2.fnt' };

export const FONT_NOKIA : ITexture = { key: 'nokia', path: 'assets/fonts/bitmap/nokia16black.png', json: 'assets/fonts/bitmap/nokia16black.xml' };

export enum SCENE_NAMES {
	GameManager = 'GameManager',
	MainMenu = 'MainMenu',
	HUD = 'HUD',
	Stage1_Gameplay = 'Stage1_Gameplay',
}