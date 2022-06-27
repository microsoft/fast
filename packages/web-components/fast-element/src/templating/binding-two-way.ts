import { Message } from "../interfaces.js";
import type { ExecutionContext, ObservationRecord } from "../observation/observable.js";
import { FAST } from "../platform.js";
import {
    BindingConfig,
    BindingMode,
    ChangeBinding,
    DefaultBindingOptions,
    HTMLBindingDirective,
} from "./binding.js";
import type { ViewBehaviorTargets } from "./html-directive.js";

/**
 * The settings required to enable two-way binding.
 * @public
 */
export interface TwoWaySettings {
    /**
     * Determines which event to listen to, to detect changes in the view.
     * @param directive - The directive to determine the change event for.
     * @param target - The target element to determine the change event for.
     */
    determineChangeEvent(directive: HTMLBindingDirective, target: HTMLElement): string;
}

let twoWaySettings: TwoWaySettings = {
    determineChangeEvent() {
        return "change";
    },
};

/**
 * A binding behavior for bindings that update in two directions.
 * @public
 */
export class TwoWayBinding extends ChangeBinding {
    private changeEvent: string;

    /**
     * Bind this behavior to the source.
     * @param source - The source to bind to.
     * @param context - The execution context that the binding is operating within.
     * @param targets - The targets that behaviors in a view can attach to.
     */
    bind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        super.bind(source, context, targets);

        const directive = this.directive;
        const target = targets[directive.nodeId] as HTMLElement;

        if (!this.changeEvent) {
            this.changeEvent =
                directive.options.changeEvent ??
                twoWaySettings.determineChangeEvent(directive, target);
        }

        target.addEventListener(this.changeEvent, this);
    }

    /**
     * Unbinds this behavior from the source.
     * @param source - The source to unbind from.
     * @param context - The execution context that the binding is operating within.
     * @param targets - The targets that behaviors in a view can attach to.
     */
    unbind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        super.unbind(source, context, targets);
        (targets[this.directive.nodeId] as HTMLElement).removeEventListener(
            this.changeEvent,
            this
        );
    }

    /** @internal */
    public handleEvent(event: Event): void {
        const directive = this.directive;
        const target = event.currentTarget as HTMLElement;
        const observer = this.getObserver(target);
        const last = (observer as any).last as ObservationRecord; // using internal API!!!

        if (!last) {
            FAST.warn(Message.twoWayBindingRequiresObservables);
            return;
        }

        let value;

        switch (directive.aspectType) {
            case 1:
                value = target.getAttribute(directive.targetAspect);
                break;
            case 2:
                value = target.hasAttribute(directive.targetAspect);
                break;
            case 4:
                value = target.innerText;
                break;
            default:
                value = target[directive.targetAspect];
                break;
        }

        last.propertySource[last.propertyName] = directive.options.fromView(value);
    }

    /**
     * Configures two-way binding.
     * @param settings - The settings to use for the two-way binding system.
     */
    public static configure(settings: TwoWaySettings) {
        twoWaySettings = settings;
    }
}

/**
 * The default twoWay binding options.
 * @public
 */
export type DefaultTwoWayBindingOptions = DefaultBindingOptions & {
    changeEvent?: string;
    fromView?: (value: any) => any;
};

/**
 * The default twoWay binding configuration.
 * @public
 */
export const twoWay = BindingConfig.define(BindingMode.define(TwoWayBinding), {
    fromView: v => v,
} as DefaultTwoWayBindingOptions);
