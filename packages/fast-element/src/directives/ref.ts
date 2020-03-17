import { Behavior } from "./behavior";
import { AttachedBehaviorDirective } from "./directive";
import { CaptureType } from "../template";

export class RefBehavior implements Behavior {
    constructor(private target: HTMLElement, private propertyName: string) {}

    bind(source: any) {
        source[this.propertyName] = this.target;
    }

    unbind() {}
}

export function ref<T = any>(propertyName: keyof T & string): CaptureType<T> {
    return new AttachedBehaviorDirective("ref", RefBehavior, propertyName);
}
