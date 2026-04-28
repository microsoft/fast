import type { Binding, BindingDirective } from "../binding/binding.js";
import type { Subscriber } from "../observation/notifier.js";
import type { ExpressionObserver } from "../observation/observable.js";
import { AddBehavior, CSSDirective } from "./css-directive.js";
import type { ComposableStyles } from "./element-styles.js";
import type { HostBehavior, HostController } from "./host.js";

type CSSBindingEntry = {
    observer: ExpressionObserver;
    controller: HostController;
};

function handleChange(
    directive: CSSBindingDirective,
    controller: HostController<HTMLElement>,
    observer: ExpressionObserver
): void {
    controller.source.style.setProperty(
        directive.targetAspect,
        observer.bind(controller)
    );
}

/**
 * Enables bindings in CSS.
 *
 * @public
 */
export class CSSBindingDirective
    implements HostBehavior, Subscriber, CSSDirective, BindingDirective
{
    /**
     * Creates an instance of CSSBindingDirective.
     * @param dataBinding - The binding to use in CSS.
     * @param targetAspect - The CSS property to target.
     */
    public constructor(
        public readonly dataBinding: Binding,
        public readonly targetAspect: string
    ) {}

    /**
     * Creates a CSS fragment to interpolate into the CSS document.
     * @returns - the string to interpolate into CSS
     */
    createCSS(add: AddBehavior): ComposableStyles {
        add(this);
        return `var(${this.targetAspect})`;
    }

    /**
     * Executed when this behavior is attached to a controller.
     * @param controller - Controls the behavior lifecycle.
     */
    addedCallback(
        controller: HostController<
            HTMLElement & { $cssBindings: Map<CSSBindingDirective, CSSBindingEntry> }
        >
    ) {
        const element = controller.source;

        if (!element.$cssBindings) {
            element.$cssBindings = new Map();
            const setAttribute = element.setAttribute;
            element.setAttribute = (attr, value) => {
                setAttribute.call(element, attr, value);

                if (attr === "style") {
                    element.$cssBindings.forEach((v, k) =>
                        handleChange(k, v.controller, v.observer)
                    );
                }
            };
        }

        const observer: ExpressionObserver =
            (controller as any)[this.targetAspect] ??
            ((controller as any)[this.targetAspect] = this.dataBinding.createObserver(
                this,
                this
            ));

        (observer as any).controller = controller;
        controller.source.$cssBindings.set(this, { controller, observer });
    }

    /**
     * Executed when this behavior's host is connected.
     * @param controller - Controls the behavior lifecycle.
     */
    connectedCallback(
        controller: HostController<
            HTMLElement & { $cssBindings: Map<CSSBindingDirective, CSSBindingEntry> }
        >
    ): void {
        handleChange(this, controller, (controller as any)[this.targetAspect]);
    }

    /**
     * Executed when this behavior is detached from a controller.
     * @param controller - Controls the behavior lifecycle.
     */
    removedCallback(
        controller: HostController<
            HTMLElement & { $cssBindings: Map<CSSBindingDirective, CSSBindingEntry> }
        >
    ) {
        if (controller.source.$cssBindings) {
            controller.source.$cssBindings.delete(this);
        }
    }

    /**
     * Called when a subject this instance has subscribed to changes.
     * @param subject - The subject of the change.
     * @param args - The event args detailing the change that occurred.
     *
     * @internal
     */
    handleChange(_: any, observer: ExpressionObserver): void {
        handleChange(this, (observer as any).controller, observer);
    }
}

CSSDirective.define(CSSBindingDirective);
