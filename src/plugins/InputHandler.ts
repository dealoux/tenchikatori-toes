import { eventsCenter } from "./EventsCentre";

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
    [key: string]: string,
}

export enum INPUT_STRINGS{
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

export enum INPUT_EVENTS{
    Up_down = 'Up_down',
    Up_up = 'Up_up',

    Down_down = 'Down_down',
    Down_up = 'Down_up',

    Left_down = 'Left_down',
    Left_up = 'Left_up',

    Right_down = 'Right_down',
    Right_up = 'Right_up',

    Shot_down = 'Shot_down',
    Shot_up = 'Shot_up',

    Special_down = 'Special_down',
    Special_up = 'Special_up',

    Switch_down = 'Switch_down',
    Switch_up = 'Switch_up',

    Focus_down = 'Focus_down',
    Focus_up = 'Focus_up',

    Pause_down = 'Pause_down',
    Pause_up = 'Pause_up',
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

        this.keys.set(INPUT_STRINGS.Up, [keyboard.addKey(KeyCodes.UP), keyboard.addKey(KeyCodes.W)]);
        this.keys.set(INPUT_STRINGS.Down, [keyboard.addKey(KeyCodes.DOWN), keyboard.addKey(KeyCodes.S)]);
        this.keys.set(INPUT_STRINGS.Left, [keyboard.addKey(KeyCodes.LEFT), keyboard.addKey(KeyCodes.A)]);
        this.keys.set(INPUT_STRINGS.Right, [keyboard.addKey(KeyCodes.RIGHT), keyboard.addKey(KeyCodes.D)]);
        this.keys.set(INPUT_STRINGS.Shot, [keyboard.addKey(KeyCodes.Z), keyboard.addKey(KeyCodes.J), keyboard.addKey(KeyCodes.ENTER)]);
        this.keys.set(INPUT_STRINGS.Special, [keyboard.addKey(KeyCodes.X), keyboard.addKey(KeyCodes.K), keyboard.addKey(KeyCodes.SPACE)]);
        this.keys.set(INPUT_STRINGS.Switch, [keyboard.addKey(KeyCodes.C), keyboard.addKey(KeyCodes.L)]);
        this.keys.set(INPUT_STRINGS.Focus, [keyboard.addKey(KeyCodes.SHIFT)]);
        this.keys.set(INPUT_STRINGS.Pause, [keyboard.addKey(KeyCodes.ESC)]);

        this.inputEvents();
    }

    private inputEvents(){
        for(let [inputKey, keyRows] of this.keys){
            for(let key of keyRows){
                key.on(Phaser.Input.Keyboard.Events.DOWN, () => {
                    this.inputs[inputKey] = true;
                    eventsCenter.emit(inputKey + '_' + Phaser.Input.Keyboard.Events.DOWN);
                });
                key.on(Phaser.Input.Keyboard.Events.UP, () => {
                    this.inputs[inputKey] = false
                    eventsCenter.emit(inputKey + '_' + Phaser.Input.Keyboard.Events.UP);
                });
            }
        }
    }

    reset(){
        let index: keyof typeof this.inputs;
        for(index in this.inputs){
            this.inputs[index] = false;
            eventsCenter.emit(index + '_' + Phaser.Input.Keyboard.Events.UP);
        }
    }
}