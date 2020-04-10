import { DOM } from "../dom";
import { Behavior, BehaviorFactory } from "./behavior";

export abstract class Directive implements BehaviorFactory {
    public targetIndex: number = 0;
    public abstract createPlaceholder(index: number): string;
    public abstract createBehavior(target: any): Behavior;
}

export type AttachedBehaviorType<T = any> = new (target: any, options: T) => Behavior;

export class AttachedBehaviorDirective<T = any> extends Directive {
    constructor(
        private name: string,
        private behavior: AttachedBehaviorType<T>,
        private options: T
    ) {
        super();
    }

    public createPlaceholder(index: number): string {
        return DOM.createCustomAttributePlaceholder(this.name, index);
    }

    public createBehavior(target: any): Behavior {
        return new this.behavior(target, this.options);
    }
}
