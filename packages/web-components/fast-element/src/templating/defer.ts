import { Behavior, ContentView, normalizeBinding } from "../index.js";
import type { Subscriber } from "../observation/notifier.js";
import { ExecutionContext, observable } from "../observation/observable.js";
import {
    AddViewBehaviorFactory,
    Binding,
    HTMLDirective,
    ViewBehavior,
    ViewBehaviorFactory,
    ViewBehaviorTargets,
} from "./html-directive.js";
import { Markup, nextId } from "./markup.js";
import type { CaptureType, ViewTemplate } from "./template.js";

type DeferRenderable<TSource = any, TParent = any> =
    | ViewTemplate<TSource, TParent>
    | Promise<ViewTemplate<TSource, TParent>>
    | Binding<
          TSource,
          | ViewTemplate<TSource, TParent>
          | Binding<TSource, Promise<ViewTemplate<TSource>>>
      >;

type DeferBinding<TSource = any> =
    | Binding<TSource, ViewTemplate<TSource>>
    | Binding<TSource, Promise<ViewTemplate<TSource>>>;

class DeferBehavior<TSource = any> implements Behavior {
    /**
     * Track the index of the rendered value
     */
    private lastRenderedIndex: number;

    @observable
    private template: ContentView | null = null;
    private templateChanged(prev: ContentView | null, next: ContentView | null) {
        if (prev) {
            prev.unbind();
            prev.remove();
        }

        if (next) {
            next.bind(this.source, ExecutionContext.default);
            next.insertBefore(this.location);
        }
    }

    private source: TSource | null = null;

    constructor(private values: DeferRenderable[], private location: Node) {
        this.lastRenderedIndex = this.values.length;
    }

    bind(source: TSource, context: ExecutionContext<any>): void {
        this.source = source;
        this.refreshView();
    }

    unbind(source: TSource, context: ExecutionContext<any>): void {
        this.source = null;
    }

    private refreshView() {
        for (let i = 0; i < this.lastRenderedIndex; i++) {
            const value = this.values[i];
            Promise.resolve(value).then(template => {
                if (i < this.lastRenderedIndex && this.source !== null) {
                    this.lastRenderedIndex = i;
                    this.template = template.create(this.source as any);
                }
            });
        }
    }
}

/**
 *
 */
export class DeferDirective implements HTMLDirective, ViewBehaviorFactory {
    /**
     * The unique id of the factory.
     */
    id: string = nextId();

    /**
     * The structural id of the DOM node to which the created behavior will apply.
     */
    nodeId: string;

    /**
     * Creates a placeholder
     */
    public createHTML(add: AddViewBehaviorFactory): string {
        return Markup.comment(add(this));
    }

    public createBehavior(
        targets: ViewBehaviorTargets
    ): Behavior<any, any> | ViewBehavior<any, any> {
        return new DeferBehavior(this.bindings, targets[this.nodeId]);
    }

    constructor(private bindings: DeferBinding[]) {}
}

HTMLDirective.define(DeferDirective);
/**
 *
 * @beta
 */
export function defer<TSource = any>(...args: DeferRenderable[]): CaptureType<TSource> {
    return new DeferDirective(args.map(normalizeBinding));
}
