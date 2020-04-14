import { CaptureType } from "../template";
import { Behavior } from "./behavior";
import { AttachedBehaviorDirective } from "./directive";

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
