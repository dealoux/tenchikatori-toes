import Phaser from 'phaser';

export enum BGM {
	touhou_sees_all = '2huseesall',
	god_sees_wish_of_this_mystia = 'godseeswishofthismystia'
}

export function loadBGM(scene: Phaser.Scene){
	scene.load.audio(BGM.touhou_sees_all, 'assets/bgm/god_sees_all/touhou_sees_all.ogg');
	scene.load.audio(BGM.god_sees_wish_of_this_mystia, 'assets/bgm/god_sees_all/god_sees_wish_of_this_mystia.ogg');
}

export function playAudio(scene: Phaser.Scene, name: string, loop = false, volume = .2){
	let audio = scene.sound.add(name, { volume: volume });
	audio.play({loop: loop});

	return audio;
}