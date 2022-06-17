import { DEFAULT_DIALOG_LINE_CREATE_OPTS } from '../../objects/DialogLine';
import { GameplayScene } from '../Gameplay';
import { Yousei1 } from '../../entities/Enemy_Specific';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from '../../constants';
import { Characters } from '../../entities/Character';

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
	yousei1?: Yousei1;
	
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

		this.yousei1 = new Yousei1(this, { pos: new Phaser.Math.Vector2(WINDOW_WIDTH/2, WINDOW_HEIGHT/2-500), texture: Characters.YOUSEIS });
	}

	update() {
		super.update();

		this.yousei1?.update();
	}
}
