import type { Binding, ExecutionContext } from "../observation/observable.js";
import { isString } from "../interfaces.js";
import { BindingConfig, BindingMode, UpdateBinding } from "./binding.js";
import type { ViewBehaviorTargets } from "./html-directive.js";

const signals: Record<string, undefined | Function | Function[]> = Object.create(null);

/**
 * A binding behavior for signal bindings.
 * @public
 */
export class SignalBinding extends UpdateBinding {
    private handlerProperty = `${this.directive.id}-h`;

    /**
     * Bind this behavior to the source.
     * @param source - The source to bind to.
     * @param context - The execution context that the binding is operating within.
     * @param targets - The targets that behaviors in a view can attach to.
     */
    bind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        const directive = this.directive;
        const target = targets[directive.nodeId];
        const signal = this.getSignal(source, context);
        const handler = (target[this.handlerProperty] = () => {
            this.updateTarget(
                target,
                directive.targetAspect!,
                directive.binding(source, context),
                source,
                context
            );
        });

        handler();

        const found = signals[signal];

        if (found) {
            Array.isArray(found)
                ? found.push(handler)
                : (signals[signal] = [found, handler]);
        } else {
            signals[signal] = handler;
        }
    }

    /**
     * Unbinds this behavior from the source.
     * @param source - The source to unbind from.
     * @param context - The execution context that the binding is operating within.
     * @param targets - The targets that behaviors in a view can attach to.
     */
    unbind(source: any, context: ExecutionContext, targets: ViewBehaviorTargets): void {
        const signal = this.getSignal(source, context);
        const found = signals[signal];

        if (found && Array.isArray(found)) {
            const directive = this.directive;
            const target = targets[directive.nodeId];
            const handler = target[this.handlerProperty];
            const index = found.indexOf(handler);
            if (index !== -1) {
                found.splice(index, 1);
            }
        } else {
            signals[signal] = void 0;
        }
    }

    private getSignal(source: any, context: ExecutionContext): string {
        const options = this.directive.options;
        return isString(options) ? options : options(source, context);
    }

    /**
     * Sends the specified signal to signaled bindings.
     * @param signal - The signal to send.
     * @public
     */
    public static send(signal: string): void {
        const found = signals[signal];
        if (found) {
            Array.isArray(found) ? found.forEach(x => x()) : found();
        }
    }
}

const signalMode: BindingMode = BindingMode.define(SignalBinding);

/**
 * Creates a signal binding configuration with the supplied options.
 * @param options - The signal name or a binding to use to retrieve the signal name.
 * @returns A binding configuration.
 * @public
 */
export const signal = <T = any>(
    options: string | Binding<T>
): BindingConfig<string | Binding<T>> => {
    return { mode: signalMode, options };
};
