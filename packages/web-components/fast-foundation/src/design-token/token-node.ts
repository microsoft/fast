import { FASTElement, Observable, observable, Subscriber } from "@microsoft/fast-element";
import { reverse } from "lodash-es";
import { DI, InterfaceSymbol, Registration } from "../di";
import { DesignToken } from "./design-token";

/**
 * Where a DesignTokeNode can be targeted
 */
type NodeTarget = HTMLElement & FASTElement;

const nodeCache = new WeakMap<NodeTarget, Map<DesignToken<any>, DesignTokenNode<any>>>();
const channelCache = new Map<DesignToken<any>, InterfaceSymbol<DesignTokenNode<any>>>();

export class DesignTokenNode<T> {
    private subscribers: Set<Subscriber> = new Set();

    @observable
    public parentNode: DesignTokenNode<T> | null;
    private parentNodeChanged(
        previous: DesignTokenNode<T> | null,
        next: DesignTokenNode<T> | null
    ) {
        if (previous) {
            previous.unsubscribe(this);
        }

        if (next) {
            next.subscribe(this);
        }
    }

    constructor(
        public readonly token: DesignToken<T>,
        public readonly target: NodeTarget
    ) {
        if (nodeCache.has(target) && nodeCache.get(target)!.has(token)) {
            throw new Error(
                `DesignTokenNode already created for ${token} and ${target}. Use DesignTokenNode.for() to ensure proper reuse`
            );
        }

        const container = DI.getOrCreateDOMContainer(this.target);
        const channel = DesignTokenNode.channel(token);
        container.register(Registration.instance(channel, this));
        this.parentNode = this.findParentNode();
    }

    private _value: T | undefined;

    public get value(): T {
        if (this._value !== void 0) {
            return this._value;
        } else if (this.parentNode) {
            return this.parentNode.value;
        }

        throw new Error("Value could not be retrieved. Ensure the value is set");
    }

    public set value(v: T) {
        this._value = v;

        if (this.parentNode) {
            this.parentNode.unsubscribe(this);
        }

        Observable.getNotifier(this).notify("value");
    }

    public static for<T>(token: DesignToken<T>, target: NodeTarget) {
        const targetCache = nodeCache.has(target)
            ? nodeCache.get(target)!
            : nodeCache.set(target, new Map()) && nodeCache.get(target)!;
        return targetCache.has(token)
            ? targetCache.get(token)!
            : targetCache.set(token, new DesignTokenNode(token, target)) &&
                  targetCache.get(token)!;
    }

    private static channel<T>(
        token: DesignToken<T>
    ): InterfaceSymbol<DesignTokenNode<T>> {
        return channelCache.has(token)
            ? channelCache.get(token)!
            : channelCache.set(token, DI.createInterface<DesignTokenNode<T>>()) &&
                  channelCache.get(token)!;
    }

    /**
     * Invoked when parent node's value changes
     */
    public handleChange(source: DesignTokenNode<T>, key: "value") {
        if (!this._value) {
            Observable.getNotifier(this).notify("value");
        }
    }

    public subscribe(subscriber: Subscriber) {
        Observable.getNotifier(this).subscribe(subscriber, "value");
    }

    public unsubscribe(subscriber: Subscriber) {
        Observable.getNotifier(this).unsubscribe(subscriber, "value");
    }

    private findParentNode() {
        if (this.target.parentNode) {
            const container = DI.getOrCreateDOMContainer(this.target.parentElement!);
            try {
                return container.get(DesignTokenNode.channel(this.token));
            } catch (e) {
                return null;
            }
        } else {
            return null;
        }
    }
}
