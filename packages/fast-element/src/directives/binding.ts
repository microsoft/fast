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
    DOM.setAttribute(this.target, this.targetName!, value);
}

function updateBooleanAttributeTarget(this: BindingBehavior, value: unknown): void {
    DOM.setBooleanAttribute(this.target, this.targetName!, value as boolean);
}

function updateTextTarget(this: BindingBehavior, value: unknown): void {
    this.target.textContent = value as string;
}

function updatePropertyTarget(this: BindingBehavior, value: unknown): void {
    this.target[this.targetName!] = value;
}

export class BindingDirective extends Directive {
    private _cleanedTargetName?: string;
    private _targetName?: string;

    public createPlaceholder = DOM.createInterpolationPlaceholder;
    private bind: typeof normalBind = normalBind;
    private unbind: typeof normalUnbind = normalUnbind;
    private updateTarget: typeof updateAttributeTarget = updateAttributeTarget;

    constructor(public expression: Expression) {
        super();
    }

    public get targetName() {
        return this._targetName;
    }

    public set targetName(value: string | undefined) {
        this._targetName = value;

        if (value === void 0) {
            return;
        }

        switch (value[0]) {
            case ":":
                this._cleanedTargetName = value.substr(1);
                this.updateTarget = updatePropertyTarget;
                if (this._cleanedTargetName === "innerHTML") {
                    const expression = this.expression;
                    this.expression = (s, c) => DOM.createHTML(expression(s, c));
                }
                break;
            case "?":
                this._cleanedTargetName = value.substr(1);
                this.updateTarget = updateBooleanAttributeTarget;
                break;
            case "@":
                this._cleanedTargetName = value.substr(1);
                this.bind = triggerBind;
                this.unbind = triggerUnbind;
                break;
            default:
                if (value === "class") {
                    this._cleanedTargetName = "className";
                    this.updateTarget = updatePropertyTarget;
                } else {
                    this._cleanedTargetName = value;
                }
                break;
        }
    }

    public makeIntoTextBinding() {
        this.updateTarget = updateTextTarget;
    }

    createBehavior(target: any) {
        return new BindingBehavior(
            target,
            this.expression,
            this.bind,
            this.unbind,
            this.updateTarget,
            this._cleanedTargetName
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
        const result = this.expression(this.source, context as any);

        if (result !== true) {
            event.preventDefault();
        }
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
