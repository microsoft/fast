import { Directive } from "./directive";
import { Expression } from "../interfaces";
import { Subscriber } from "../observation/subscriber-collection";
import {
    Observable,
    GetterInspector,
    inspectAndEvaluate,
} from "../observation/observable";
import { DOM } from "../dom";
import { BehaviorType, Behavior } from "./behavior";

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
    public behavior: BehaviorType = BindingBehavior;

    constructor(public expression: Expression) {
        super();
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
    private target: Node;

    constructor(private directive: BindingDirective, target: HTMLElement) {
        if (directive.type === BindingType.text) {
            this.target = DOM.convertMarkerToLocation(target) as Text;
        } else {
            this.target = target;
        }
    }

    bind(source: unknown) {
        this.source = source;

        if (this.directive.type === BindingType.trigger) {
            this.target.addEventListener(this.directive.targetName!, this, true);
        } else {
            this.updateTarget(
                inspectAndEvaluate(this.directive.expression, source, context, this)
            );
        }
    }

    unbind() {
        if (this.directive.type === BindingType.trigger) {
            this.target.removeEventListener(this.directive.targetName!, this, true);
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
        this.directive.expression(this.source, context as any);
        event.preventDefault();
    }

    call() {
        this.needsQueue = true;
        this.updateTarget(this.directive.expression(this.source, context));
    }

    inspect(source: any, propertyName: string) {
        if (this.record !== null) {
            this.record.unsubscribe(this);
        }

        this.record = new ObservationRecord(source, propertyName);
        this.record.subscribe(this);
    }

    updateTarget(value: unknown): void {
        const directive = this.directive;

        switch (this.directive.type) {
            case BindingType.attribute:
                (value as boolean)
                    ? (this.target as HTMLElement).setAttribute(directive.targetName!, "")
                    : (this.target as HTMLElement).removeAttribute(directive.targetName!);
                break;
            case BindingType.booleanAttribute:
                (value as boolean)
                    ? (this.target as HTMLElement).setAttribute(
                          this.directive.targetName!,
                          ""
                      )
                    : (this.target as HTMLElement).removeAttribute(
                          this.directive.targetName!
                      );
                break;
            case BindingType.text:
                this.target.textContent = value as string;
                break;
            case BindingType.property:
                this.target[this.directive.targetName!] = value;
                break;
        }
    }
}
