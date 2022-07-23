import Phaser from "phaser";
import short from 'short-uuid';

export type Constructor<T extends {} = {}> = new (...args: any[]) => T;

export interface IComponent{
    init(gobj: Phaser.GameObjects.GameObject) : void;

    awake?: () => void;
    start?: () => void;
    update?: (time: number, delta: number) => void;

    enable?: () => void;
    disable?: () => void;
    destroy?: () => void;
}

export class ComponentService{
    private componentsByGameObject = new Map<string, IComponent[]>();
    private queuedForStart: IComponent[] = [];

    addComponents(gobj: Phaser.GameObjects.GameObject, component: IComponent){
        if(!gobj.name || this.componentsByGameObject.has(gobj.name)){
            gobj.name = short.generate();
        }

        this.componentsByGameObject.set(gobj.name, []);

        const list = this.componentsByGameObject.get(gobj.name) as IComponent[];
        list.push(component);

        component.init(gobj);

        if(component.awake){
            component.awake();
        }

        if(component.start){
            this.queuedForStart.push(component);
        }
    }

    findComponents<ComponentType>(gobj: Phaser.GameObjects.GameObject, componentType: Constructor<ComponentType>){
        const components = this.componentsByGameObject.get(gobj.name);
        if(!components){
            return null;
        }

        return components.find(component => component instanceof componentType);
    }

    update(time: number, delta: number){
        while(this.queuedForStart.length > 0){
            const component = this.queuedForStart.shift();

            if(component?.start){
                component.start();
            }
        }

        const entires = this.componentsByGameObject.entries();
        for(const [, components] of entires){
            components.forEach(component => {
                if(component.update){
                    component.update(time, delta);
                }
            });
        }
    }

    enable(){
        const entires = this.componentsByGameObject.entries();
        for(const [, components] of entires){
            components.forEach(component => {
                if(component.enable){
                    component.enable();
                }
            });
        }
    }

    disable(){
        const entires = this.componentsByGameObject.entries();
        for(const [, components] of entires){
            components.forEach(component => {
                if(component.disable){
                    component.disable();
                }
            });
        }
    }

    destroy(){
        const entires = this.componentsByGameObject.entries();
        for(const [, components] of entires){
            components.forEach(component => {
                if(component.destroy){
                    component.destroy();
                }
            });
        }
    }
}