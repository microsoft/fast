import { Behavior } from "../behaviors/behavior";
import { Directive } from "./directive";
import { CaptureType } from "../template";

export class RefDirective extends Directive {
    behavior = RefBinding;

    constructor(public propertyName: string) {
        super();
    }

    public createPlaceholder(index: number) {
        return `ref="${super.createPlaceholder(index)}"`;
    }
}

export class RefBinding implements Behavior {
    constructor(private directive: RefDirective, private target: HTMLElement) {}

    bind(source: any) {
        source[this.directive.propertyName] = this.target;
    }

    unbind() {}
}

export function ref<T = any>(propertyName: keyof T & string): CaptureType<T> {
    return new RefDirective(propertyName);
}
