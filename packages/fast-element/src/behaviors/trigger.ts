import { Behavior } from "./behavior";
import { BindingDirective } from "../directives/bind";

export class TriggerBinding implements Behavior {
    private source: unknown = null;

    constructor(private directive: BindingDirective, private target: HTMLElement) {}

    bind(source: unknown) {
        this.source = source;
        this.target.addEventListener(this.directive.targetName!, this, true);
    }

    unbind() {
        this.source = null;
        this.target.removeEventListener(this.directive.targetName!, this, true);
    }

    handleEvent(event: Event) {
        const context = { event };
        this.directive.expression.evaluate(this.source, context as any);
        event.preventDefault();
    }
}
