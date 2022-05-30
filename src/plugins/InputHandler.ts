export enum InputStrings{
    Up = 'Up',
    Down = 'Down',
    Left = 'Left',
    Right = 'Right',
    Shot = 'Shot', // interact
    Special = 'Special', // cancel
    Focus = 'Shift',
    Pause = 'Pause' // escape
}

export class InputHandler{
    private static instance: InputHandler;

    keys: Map<string, Phaser.Input.Keyboard.Key[]>;

    inputs = {
		up: false,
		down: false,
		left: false,
		right: false,
		shot: false,
		special: false,
        focus: false,
        pause: false,
    }

    constructor (scene: Phaser.Scene, pluginManager?: Phaser.Plugins.PluginManager) {
        //super(scene, pluginManager, 'InputHandler');
        this.keys = new Map();
        InputHandler.instance = this;
    }

    public static Instance(): InputHandler{
        return InputHandler.instance;
    }

    create(scene: Phaser.Scene){
        const { KeyCodes } = Phaser.Input.Keyboard;
        const { keyboard } = scene.input;

        this.keys.set(InputStrings.Up, [keyboard.addKey(KeyCodes.UP), keyboard.addKey(KeyCodes.W)]);
        this.keys.set(InputStrings.Down, [keyboard.addKey(KeyCodes.DOWN), keyboard.addKey(KeyCodes.S)]);
        this.keys.set(InputStrings.Left, [keyboard.addKey(KeyCodes.LEFT), keyboard.addKey(KeyCodes.A)]);
        this.keys.set(InputStrings.Right, [keyboard.addKey(KeyCodes.RIGHT), keyboard.addKey(KeyCodes.D)]);
        this.keys.set(InputStrings.Shot, [keyboard.addKey(KeyCodes.Z), keyboard.addKey(KeyCodes.J), keyboard.addKey(KeyCodes.ENTER)]);
        this.keys.set(InputStrings.Special, [keyboard.addKey(KeyCodes.X), keyboard.addKey(KeyCodes.K), keyboard.addKey(KeyCodes.SPACE)]);
        this.keys.set(InputStrings.Focus, [keyboard.addKey(KeyCodes.SHIFT)]);
        this.keys.set(InputStrings.Pause, [keyboard.addKey(KeyCodes.ESC)]);
    }

    getInput(inputKey: string) : boolean{
        let result = false;
        let keysRow = this.keys.get(inputKey);

        if(keysRow){
            for(let key of keysRow){
                if(key.isDown){
                    result = true;
                    break;
                }
            }
        }

        return result;
    }

    update (scene: Phaser.Scene) {
        this.inputs.up = this.getInput(InputStrings.Up);
		this.inputs.down = this.getInput(InputStrings.Down);
		this.inputs.left = this.getInput(InputStrings.Left);
		this.inputs.right = this.getInput(InputStrings.Right);
        this.inputs.shot = this.getInput(InputStrings.Shot);
        this.inputs.special = this.getInput(InputStrings.Special);
		this.inputs.focus = this.getInput(InputStrings.Focus);
        this.inputs.pause = this.getInput(InputStrings.Pause);

        // for(let keysRow of this.keys){
        //     this.emitKeyEvent(scene, keysRow[0], keysRow[1]);
        // }
    }

    // emitKeyEvent (scene: Phaser.Scene, eventName: string, keys?: Phaser.Input.Keyboard.Key[]) {
    //     if(keys){
    //         for(let key of keys){
    //             if (Phaser.Input.Keyboard.JustDown(key)){
    //                 scene.events.emit(eventName, scene);
    //             }
    //             else{}
    //         }
    //     }
    // }
}