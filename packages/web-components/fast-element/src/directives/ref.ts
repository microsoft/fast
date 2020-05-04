import { CaptureType } from "../template.js";
import { Behavior } from "./behavior.js";
import { AttachedBehaviorDirective } from "./directive.js";

export class RefBehavior implements Behavior {
    constructor(private target: HTMLElement, private propertyName: string) {}

    bind(source: any): void {
        source[this.propertyName] = this.target;
    }

    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    unbind(): void {}
}

export function ref<T = any>(propertyName: keyof T & string): CaptureType<T> {
    return new AttachedBehaviorDirective("fast-ref", RefBehavior, propertyName);
}
