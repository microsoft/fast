import { Directive } from "./directive";
import { Expression } from "../interfaces";
import { Subscriber } from "../observation/subscriber-collection";
import {
    Observable,
    GetterInspector,
    inspectAndEvaluate,
} from "../observation/observable";
import { DOM } from "../dom";
import { Behavior } from "./behavior";

export const enum BindingType {
    attribute = 0,
    booleanAttribute = 1,
    text = 2,
    property = 3,
    trigger = 4,
}

export class BindingDirective extends Directive {
    public targetName?: string;
    public type: BindingType = BindingType.property;
    public createPlaceholder = DOM.createInterpolationPlaceholder;

    constructor(public expression: Expression) {
        super();
    }

    createBehavior(target: any) {
        return new BindingBehavior(target, this.expression, this.type, this.targetName);
    }
}

class ObservationRecord {
    constructor(private source: any, private propertyName: string) {}

    subscribe(subscriber: Subscriber) {
        Observable.getNotifier(this.source).subscribe(subscriber, this.propertyName);
    }

    unsubscribe(subscriber: Subscriber) {
        Observable.getNotifier(this.source).unsubscribe(subscriber, this.propertyName);
    }
}

const context = {} as any;

export class BindingBehavior implements Behavior, GetterInspector, Subscriber {
    private source: unknown;
    private record: ObservationRecord | null = null;
    private needsQueue = true;

    constructor(
        private target: any,
        private expression: Expression,
        private type: BindingType,
        private targetName?: string
    ) {}

    bind(source: unknown) {
        this.source = source;

        if (this.type === BindingType.trigger) {
            this.target.addEventListener(this.targetName!, this, true);
        } else {
            this.updateTarget(inspectAndEvaluate(this.expression, source, context, this));
        }
    }

    unbind() {
        if (this.type === BindingType.trigger) {
            this.target.removeEventListener(this.targetName!, this, true);
        } else if (this.record !== null) {
            this.record.unsubscribe(this);
        }

        this.source = null;
    }

    handleChange(source: any, propertyName: string): void {
        if (this.needsQueue) {
            this.needsQueue = false;
            DOM.queueUpdate(this);
        }
    }

    handleEvent(event: Event) {
        const context = { event };
        this.expression(this.source, context as any);
        event.preventDefault();
    }

    call() {
        this.needsQueue = true;
        this.updateTarget(this.expression(this.source, context));
    }

    inspect(source: any, propertyName: string) {
        if (this.record !== null) {
            this.record.unsubscribe(this);
        }

        this.record = new ObservationRecord(source, propertyName);
        this.record.subscribe(this);
    }

    updateTarget(value: unknown): void {
        switch (this.type) {
            case BindingType.attribute:
                (value as boolean)
                    ? (this.target as HTMLElement).setAttribute(this.targetName!, "")
                    : (this.target as HTMLElement).removeAttribute(this.targetName!);
                break;
            case BindingType.booleanAttribute:
                (value as boolean)
                    ? (this.target as HTMLElement).setAttribute(this.targetName!, "")
                    : (this.target as HTMLElement).removeAttribute(this.targetName!);
                break;
            case BindingType.text:
                this.target.textContent = value as string;
                break;
            case BindingType.property:
                this.target[this.targetName!] = value;
                break;
        }
    }
}
