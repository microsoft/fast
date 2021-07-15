import type { Behavior } from "../observation/behavior";
import { Binding, BindingObserver, ExecutionContext } from "../observation/observable";
import { TargetedHTMLDirective } from "./html-directive";
declare function normalBind(
    this: BindingBehavior,
    source: unknown,
    context: ExecutionContext
): void;
declare function normalUnbind(this: BindingBehavior): void;
declare function updatePropertyTarget(this: BindingBehavior, value: unknown): void;
/**
 * A directive that configures data binding to element content and attributes.
 * @public
 */
export declare class HTMLBindingDirective extends TargetedHTMLDirective {
    binding: Binding;
    private cleanedTargetName?;
    private originalTargetName?;
    private bind;
    private unbind;
    private updateTarget;
    private isBindingVolatile;
    /**
     * Creates an instance of BindingDirective.
     * @param binding - A binding that returns the data used to update the DOM.
     */
    constructor(binding: Binding);
    /**
     * Gets/sets the name of the attribute or property that this
     * binding is targeting.
     */
    get targetName(): string | undefined;
    set targetName(value: string | undefined);
    /**
     * Makes this binding target the content of an element rather than
     * a particular attribute or property.
     */
    targetAtContent(): void;
    /**
     * Creates the runtime BindingBehavior instance based on the configuration
     * information stored in the BindingDirective.
     * @param target - The target node that the binding behavior should attach to.
     */
    createBehavior(target: Node): BindingBehavior;
}
/**
 * A behavior that updates content and attributes based on a configured
 * BindingDirective.
 * @public
 */
export declare class BindingBehavior implements Behavior {
    /** @internal */
    source: unknown;
    /** @internal */
    context: ExecutionContext | null;
    /** @internal */
    bindingObserver: BindingObserver | null;
    /** @internal */
    classVersions: Record<string, number>;
    /** @internal */
    version: number;
    /** @internal */
    target: any;
    /** @internal */
    binding: Binding;
    /** @internal */
    isBindingVolatile: boolean;
    /** @internal */
    updateTarget: typeof updatePropertyTarget;
    /** @internal */
    targetName?: string;
    /**
     * Bind this behavior to the source.
     * @param source - The source to bind to.
     * @param context - The execution context that the binding is operating within.
     */
    bind: typeof normalBind;
    /**
     * Unbinds this behavior from the source.
     * @param source - The source to unbind from.
     */
    unbind: typeof normalUnbind;
    /**
     * Creates an instance of BindingBehavior.
     * @param target - The target of the data updates.
     * @param binding - The binding that returns the latest value for an update.
     * @param isBindingVolatile - Indicates whether the binding has volatile dependencies.
     * @param bind - The operation to perform during binding.
     * @param unbind - The operation to perform during unbinding.
     * @param updateTarget - The operation to perform when updating.
     * @param targetName - The name of the target attribute or property to update.
     */
    constructor(
        target: any,
        binding: Binding,
        isBindingVolatile: boolean,
        bind: typeof normalBind,
        unbind: typeof normalUnbind,
        updateTarget: typeof updatePropertyTarget,
        targetName?: string
    );
    /** @internal */
    handleChange(): void;
    /** @internal */
    handleEvent(event: Event): void;
}
export {};
