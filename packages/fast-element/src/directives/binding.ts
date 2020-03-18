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

function normalBind(this: BindingBehavior, source: unknown) {
    this.source = source;
    this.updateTarget(inspectAndEvaluate(this.expression, source, context, this));
}

function triggerBind(this: BindingBehavior, source: unknown) {
    this.source = source;
    this.target.addEventListener(this.targetName!, this, true);
}

function normalUnbind(this: BindingBehavior) {
    if (this.record !== null) {
        this.record.unsubscribe(this);
    }

    this.source = null;
}

function triggerUnbind(this: BindingBehavior) {
    this.target.removeEventListener(this.targetName!, this, true);
    this.source = null;
}

function updateAttributeTarget(this: BindingBehavior, value: unknown): void {
    if (value === null || value === void 0) {
        this.target.removeAttribute(this.targetName!);
    } else {
        this.target.setAttribute(this.targetName!, value as string);
    }
}

function updateBooleanAttributeTarget(this: BindingBehavior, value: unknown): void {
    (value as boolean)
        ? (this.target as HTMLElement).setAttribute(this.targetName!, "")
        : (this.target as HTMLElement).removeAttribute(this.targetName!);
}

function updateTextTarget(this: BindingBehavior, value: unknown): void {
    this.target.textContent = value as string;
}

function updatePropertyTarget(this: BindingBehavior, value: unknown): void {
    this.target[this.targetName!] = value;
}

export class BindingDirective extends Directive {
    public targetName?: string;
    public createPlaceholder = DOM.createInterpolationPlaceholder;
    private bind: typeof normalBind = normalBind;
    private unbind: typeof normalUnbind = normalUnbind;
    private updateTarget: typeof updatePropertyTarget = updatePropertyTarget;

    constructor(public expression: Expression) {
        super();
    }

    setType(type: BindingType) {
        switch (type) {
            case BindingType.trigger:
                this.bind = triggerBind;
                this.unbind = triggerUnbind;
                break;
            default:
                this.bind = normalBind;
                this.unbind = normalUnbind;
                break;
        }

        switch (type) {
            case BindingType.attribute:
                this.updateTarget = updateAttributeTarget;
                break;
            case BindingType.booleanAttribute:
                this.updateTarget = updateBooleanAttributeTarget;
                break;
            case BindingType.text:
                this.updateTarget = updateTextTarget;
                break;
            case BindingType.property:
                this.updateTarget = updatePropertyTarget;
                break;
        }
    }

    createBehavior(target: any) {
        return new BindingBehavior(
            target,
            this.expression,
            this.bind,
            this.unbind,
            this.updateTarget,
            this.targetName
        );
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
    public source: unknown;
    public record: ObservationRecord | null = null;
    private needsQueue = true;

    constructor(
        public target: any,
        public expression: Expression,
        public bind: typeof normalBind,
        public unbind: typeof normalUnbind,
        public updateTarget: typeof updatePropertyTarget,
        public targetName?: string
    ) {}

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
}
