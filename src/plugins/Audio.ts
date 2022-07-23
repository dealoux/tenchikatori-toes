import Phaser from 'phaser';

export enum BGM {
	touhou_sees_all = 'touhou_sees_all',
	god_sees_wish_of_this_mystia = 'god_sees_wish_of_this_mystia',
}

export enum SFX {
	select = 'select',
	confirm = 'confirm',
	player_vanish = 'player_vanish',
	enemy_vanish = 'enemy_vanish',
	powerup = 'powerup',
	pause_resume = 'pause_resume',
	graze = 'graze',
	powereffect = 'powereffect'
}

function loadAudioHelper(scene: Phaser.Scene, name: string, urlBase: string, extension: string){
	scene.load.audio(name, urlBase + name + extension);
}

export function loadAudio(scene: Phaser.Scene){
	for(const bgm in BGM){
		loadAudioHelper(scene, bgm, 'assets/bgm/nowp/', '.ogg');
	}

	for(const sfx in SFX){
		loadAudioHelper(scene, sfx, 'assets/sounds/', '.wav');
	}
}

export function playAudio(scene: Phaser.Scene, name: string, volume = .8, loop = false){
	let audio = scene.sound.add(name, { volume: volume });
	audio.play({ loop: loop });
	return audio;
}