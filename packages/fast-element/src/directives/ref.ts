import { Behavior } from "../behaviors/behavior";
import { AttachedBehaviorDirective } from "./directive";
import { CaptureType } from "../template";

export class RefBehavior implements Behavior {
    constructor(
        private directive: AttachedBehaviorDirective<string>,
        private target: HTMLElement
    ) {}

    bind(source: any) {
        source[this.directive.options] = this.target;
    }

    unbind() {}
}

export function ref<T = any>(propertyName: keyof T & string): CaptureType<T> {
    return new AttachedBehaviorDirective("ref", RefBehavior, propertyName);
}
