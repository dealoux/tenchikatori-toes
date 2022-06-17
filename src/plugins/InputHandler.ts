export enum INPUTSTRINGS{
    Up = 'Up',
    Down = 'Down',
    Left = 'Left',
    Right = 'Right',
    Shot = 'Shot', // interact
    Special = 'Special', // cancel
    Switch = 'Switch',
    Focus = 'Focus',
    Pause = 'Pause' // escape
}

export interface IInputPoll{
    Up: boolean,
	Down: boolean,
	Left: boolean,
	Right: boolean,
	Shot: boolean,
	Special: boolean,
    Switch: boolean,
    Focus: boolean,
    Pause: boolean,
    [key: string]: boolean,
}

export class InputHandler{
    private static instance: InputHandler;

    keys: Map<string, Phaser.Input.Keyboard.Key[]>;
    inputs: IInputPoll;

    constructor() {        
        this.keys = new Map();

        this.inputs = {
            Up: false,
            Down: false,
            Left: false,
            Right: false,
            Shot: false,
            Special: false,
            Switch: false,
            Focus: false,
            Pause: false,
        }

        InputHandler.instance = this;
    }

    public static Instance(): InputHandler{
        return InputHandler.instance;
    }

    create(scene: Phaser.Scene){
        const { KeyCodes } = Phaser.Input.Keyboard;
        const { keyboard } = scene.input;

        this.keys.set(INPUTSTRINGS.Up, [keyboard.addKey(KeyCodes.UP), keyboard.addKey(KeyCodes.W)]);
        this.keys.set(INPUTSTRINGS.Down, [keyboard.addKey(KeyCodes.DOWN), keyboard.addKey(KeyCodes.S)]);
        this.keys.set(INPUTSTRINGS.Left, [keyboard.addKey(KeyCodes.LEFT), keyboard.addKey(KeyCodes.A)]);
        this.keys.set(INPUTSTRINGS.Right, [keyboard.addKey(KeyCodes.RIGHT), keyboard.addKey(KeyCodes.D)]);
        this.keys.set(INPUTSTRINGS.Shot, [keyboard.addKey(KeyCodes.Z), keyboard.addKey(KeyCodes.J), keyboard.addKey(KeyCodes.ENTER)]);
        this.keys.set(INPUTSTRINGS.Special, [keyboard.addKey(KeyCodes.X), keyboard.addKey(KeyCodes.K), keyboard.addKey(KeyCodes.SPACE)]);
        this.keys.set(INPUTSTRINGS.Switch, [keyboard.addKey(KeyCodes.C), keyboard.addKey(KeyCodes.L)]);
        this.keys.set(INPUTSTRINGS.Focus, [keyboard.addKey(KeyCodes.SHIFT)]);
        this.keys.set(INPUTSTRINGS.Pause, [keyboard.addKey(KeyCodes.ESC)]);

        this.inputEvents();
    }

    private inputEvents(){
        for(let [inputKey, keyRows] of this.keys){
            for(let key of keyRows){
                key.on('down', () => this.inputs[inputKey] = true);
                key.on('up', () => this.inputs[inputKey] = false);
            }
        }
    }

    reset(){
        let index: keyof typeof this.inputs;
        for(index in this.inputs){
            this.inputs[index] = false;
        }
    }
}