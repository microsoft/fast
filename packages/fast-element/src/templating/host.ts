import type { Binding } from "../binding/binding.js";
import { normalizeBinding } from "../binding/normalize.js";
import { oneTime } from "../binding/one-time.js";
import type { DOMPolicy } from "../dom-policy.js";
import type { Expression } from "../observation/observable.js";
import { HTMLBindingDirective } from "./html-binding-directive.js";
import {
    type AddViewBehaviorFactory,
    HTMLDirective,
    type ViewBehavior,
    type ViewBehaviorFactory,
    type ViewController,
} from "./html-directive.js";
import { nextId } from "./markup.js";
import type { CaptureType } from "./template.js";

/**
 * Attributes, properties, and events to bind on a template's host element.
 * Keys use the same aspect prefixes as HTML template bindings.
 * @public
 */
export type HostBindings<TSource = any, TParent = any> = Record<
    string,
    | Expression<TSource, any, TParent>
    | Binding<TSource, any, TParent>
    | string
    | number
    | boolean
    | null
    | undefined
>;

/**
 * A directive that binds attributes, properties, and events on a view's host.
 * @public
 */
export class HostDirective<TSource = any, TParent = any>
    implements HTMLDirective, ViewBehaviorFactory
{
    /** The unique id assigned when the directive is registered in a template. */
    public id: string;
    /** The structural id of the view's host binding target. */
    public targetNodeId: string;
    /** The tag name used when applying the view's DOM policy. */
    public targetTagName: string | null;
    /** The DOM policy supplied by the containing template. */
    public policy: DOMPolicy;

    /**
     * Creates a host directive.
     * @param bindings - The bindings to apply to the host.
     */
    public constructor(private readonly bindings: HostBindings<TSource, TParent>) {}

    /**
     * Registers the host behavior without adding nodes to the template.
     * @param add - Registers the directive's behavior factory.
     */
    public createHTML(add: AddViewBehaviorFactory): string {
        add(this);
        return "";
    }

    /** @internal */
    public createBindingFactories(): HTMLBindingDirective[] {
        return Object.keys(this.bindings).map(aspect => {
            const value = this.bindings[aspect];
            const directive = new HTMLBindingDirective(
                normalizeBinding<TSource, any, TParent>(value ?? oneTime(() => value)),
            );
            HTMLDirective.assignAspect(directive, aspect);
            directive.id = nextId();
            directive.targetNodeId = this.targetNodeId;
            directive.targetTagName = this.targetTagName;
            directive.policy = this.policy;
            return directive;
        });
    }

    /**
     * Creates binding behaviors for the host element.
     */
    public createBehavior(): ViewBehavior<TSource, TParent> {
        const behaviors = this.createBindingFactories().map(directive =>
            directive.createBehavior(),
        );

        return {
            bind(controller: ViewController<TSource, TParent>): void {
                for (const behavior of behaviors) {
                    behavior.bind(controller);
                }
            },
        };
    }
}

HTMLDirective.define(HostDirective);

/**
 * Applies bindings to a template's host element without a wrapping template tag.
 * @param bindings - Host bindings keyed by attribute name or binding aspect.
 * @returns A directive to interpolate into an HTML template.
 * @public
 */
export function host<TSource = any, TParent = any>(
    bindings: HostBindings<TSource, TParent>,
): CaptureType<TSource, TParent> {
    return new HostDirective(bindings);
}
