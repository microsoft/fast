import { DOM } from "./dom.js";
import { ExecutionContext } from "./observation/observable.js";
import type { HostBehavior, HostController } from "./styles/host.js";
import type {
    CompiledViewBehaviorFactory,
    ViewBehavior,
    ViewBehaviorFactory,
    ViewBehaviorTargets,
    ViewController,
} from "./templating/html-directive.js";
import { nextId } from "./templating/markup.js";

/**
 * Retrieves the "composed parent" element of a node, ignoring DOM tree boundaries.
 * When the parent of a node is a shadow-root, it will return the host
 * element of the shadow root. Otherwise it will return the parent node or null if
 * no parent node exists.
 * @param element - The element for which to retrieve the composed parent
 *
 * @public
 */
export function composedParent<T extends HTMLElement>(element: T): HTMLElement | null {
    const parentNode = element.parentElement;

    if (parentNode) {
        return parentNode;
    } else {
        const rootNode = element.getRootNode();

        if ((rootNode as ShadowRoot).host instanceof HTMLElement) {
            // this is shadow-root
            return (rootNode as ShadowRoot).host as HTMLElement;
        }
    }

    return null;
}

/**
 * Determines if the reference element contains the test element in a "composed" DOM tree that
 * ignores shadow DOM boundaries.
 *
 * Returns true of the test element is a descendent of the reference, or exists in
 * a shadow DOM that is a logical descendent of the reference. Otherwise returns false.
 * @param reference - The element to test for containment against.
 * @param test - The element being tested for containment.
 *
 * @public
 */
export function composedContains(reference: HTMLElement, test: HTMLElement): boolean {
    let current: HTMLElement | null = test;

    while (current !== null) {
        if (current === reference) {
            return true;
        }

        current = composedParent(current);
    }

    return false;
}

/**
 * An extension of MutationObserver that supports unobserving nodes.
 * @internal
 */
export class UnobservableMutationObserver extends MutationObserver {
    private observedNodes: Set<Node> = new Set();

    /**
     * Creates an instance of UnobservableMutationObserver.
     * @param callback - The callback to invoke when observed nodes are changed.
     */
    constructor(private readonly callback: MutationCallback) {
        function handler(mutations: MutationRecord[]) {
            this.callback.call(
                null,
                mutations.filter(record => this.observedNodes.has(record.target))
            );
        }

        super(handler);
    }

    public observe(target: Node, options?: MutationObserverInit | undefined): void {
        this.observedNodes.add(target);
        super.observe(target, options);
    }

    public unobserve(target: Node): void {
        this.observedNodes.delete(target);

        if (this.observedNodes.size < 1) {
            this.disconnect();
        }
    }
}

/**
 * Bridges between ViewBehaviors and HostBehaviors, enabling a host to
 * control ViewBehaviors.
 * @public
 */
export interface ViewBehaviorOrchestrator<TSource = any, TParent = any>
    extends ViewController<TSource, TParent>,
        HostBehavior<TSource> {
    /**
     *
     * @param nodeId - The structural id of the DOM node to which a behavior will apply.
     * @param target - The DOM node associated with the id.
     */
    addTarget(nodeId: string, target: Node): void;

    /**
     * Adds a behavior.
     * @param behavior - The behavior to add.
     */
    addBehavior(behavior: ViewBehavior): void;

    /**
     * Adds a behavior factory.
     * @param factory - The behavior factory to add.
     * @param target - The target the factory will create behaviors for.
     */
    addBehaviorFactory(factory: ViewBehaviorFactory, target: Node): void;
}

/**
 * Bridges between ViewBehaviors and HostBehaviors, enabling a host to
 * control ViewBehaviors.
 * @public
 */
export const ViewBehaviorOrchestrator = Object.freeze({
    /**
     * Creates a ViewBehaviorOrchestrator.
     * @param source - The source to to associate behaviors with.
     * @returns A ViewBehaviorOrchestrator.
     */
    create<TSource = any, TParent = any>(
        source: TSource
    ): ViewBehaviorOrchestrator<TSource, TParent> {
        const behaviors: ViewBehavior[] = [];
        const targets: ViewBehaviorTargets = {};
        let unbindables: { unbind(controller: ViewController<TSource>) }[] | null = null;
        let isConnected = false;

        return {
            source,
            context: ExecutionContext.default,
            targets,
            get isBound() {
                return isConnected;
            },
            addBehaviorFactory(factory: ViewBehaviorFactory, target: Node): void {
                const compiled = factory as CompiledViewBehaviorFactory;

                compiled.id = compiled.id ?? nextId();
                compiled.targetNodeId = compiled.targetNodeId ?? nextId();
                compiled.targetTagName = (target as HTMLElement).tagName ?? null;
                compiled.policy = compiled.policy ?? DOM.policy;

                this.addTarget(compiled.targetNodeId, target);
                this.addBehavior(compiled.createBehavior());
            },
            addTarget(nodeId: string, target: Node) {
                targets[nodeId] = target;
            },
            addBehavior(behavior: ViewBehavior): void {
                behaviors.push(behavior);

                if (isConnected) {
                    behavior.bind(this);
                }
            },
            onUnbind(unbindable: { unbind(controller: ViewController<TSource>) }) {
                if (unbindables === null) {
                    unbindables = [];
                }

                unbindables.push(unbindable);
            },
            connectedCallback(controller: HostController<TSource>) {
                if (!isConnected) {
                    isConnected = true;
                    behaviors.forEach(x => x.bind(this));
                }
            },
            disconnectedCallback(controller: HostController<TSource>) {
                if (isConnected) {
                    isConnected = false;

                    if (unbindables !== null) {
                        unbindables.forEach(x => x.unbind(this));
                    }
                }
            },
        };
    },
});
