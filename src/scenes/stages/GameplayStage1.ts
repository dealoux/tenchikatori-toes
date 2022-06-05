import { DEFAULT_DIALOG_LINE_CREATE_OPTS } from '../../objects/DialogLine';
import GameplayScene from '../Gameplay';

//#region Dialogues
const chant = [
	'JINZOU FIRE FAIBO WAIPAA', 
	'TAIGA TAIGA TTTTAIGA', 
	'CHAPE APE KARA KINA' ,
	'CHAPE APE KARA KINA' ,
	'MYOHHONTUSUKE' ,
	'*CLAP* WAIPAA!!', 
	'FIRE FIRE' ,
	'TORA TORA KARA KINA',
	'CHAPE APE BABA',
	'AMA AMA JYASUPA!',
	'TORA TAIGA, DARE TAIGA!',
	'JINZOU SENI YA TAIGA!'
];
//#endregion

export default class GameplayStage1 extends GameplayScene {
	constructor() {
		super('Stage1_Gameplay');
	}

	preload() {
		super.preload();
	}

	create() {
		super.create();

		this.dialog = this.add.dialog({
			...DEFAULT_DIALOG_LINE_CREATE_OPTS,
			text: chant,
		});

		// let x = 100

		// for(let i = 0; i<16; i++){
		// 	this.add.image(x, 400, 'cards', i);
		// 	x+=20;
		// }
	}

	update() {
		super.update();
	}
}
