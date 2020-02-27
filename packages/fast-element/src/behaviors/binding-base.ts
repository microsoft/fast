import { Behavior } from "./behavior";
import { GetterInspector, Observable } from "../observation/observable";
import { BindingDirective } from "../directives/bind";
import { DOM } from "../dom";
import { Subscriber } from "../observation/subscriber-collection";

class ObservationRecord {
    constructor(private source: any, private propertyName: string) {}

    subscribe(subscriber: Subscriber) {
        Observable.getNotifier(this.source).subscribe(subscriber, this.propertyName);
    }

    unsubscribe(subscriber: Subscriber) {
        Observable.getNotifier(this.source).unsubscribe(subscriber, this.propertyName);
    }
}

export abstract class BindingBase implements Behavior, GetterInspector, Subscriber {
    protected source: unknown;
    private record: ObservationRecord | null = null;
    private needsQueue = true;

    constructor(protected directive: BindingDirective) {}

    bind(source: unknown) {
        this.source = source;
        this.updateTarget(this.directive.inspectAndEvaluate(source, this));
    }

    unbind() {
        if (this.record !== null) {
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

    call() {
        this.needsQueue = true;
        this.updateTarget(this.directive.evaluate(this.source));
    }

    inspect(source: any, propertyName: string) {
        if (this.record !== null) {
            this.record.unsubscribe(this);
        }

        this.record = new ObservationRecord(source, propertyName);
        this.record.subscribe(this);
    }

    abstract updateTarget(value: unknown): void;
}
