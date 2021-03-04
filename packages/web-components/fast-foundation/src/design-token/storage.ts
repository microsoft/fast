import { Controller, FASTElement, Observable, Subscriber } from "@microsoft/fast-element";
import { Container, DI, Registration } from "../di/di";
import { DerivedDesignTokenValue, DesignToken } from "./design-token";

export type DesignTokenStorageTarget = FASTElement & HTMLElement;

export interface DesignTokenStorage {
    readonly owner: DesignTokenStorageTarget;
    parentNode: DesignTokenStorage | null;
    get<T>(token: DesignToken<T>): T;
    set<T>(
        token: DesignToken<T>,
        value: T | ((target: DesignTokenStorageTarget) => T)
    ): void;
    connect(subscriber: DesignTokenStorage): void;
    disconnect(subscriber: DesignTokenStorage): void;
    observe(token: DesignToken<any>, cb: () => void);
}

type Observer = (storage: DesignTokenStorage) => void;

export class DesignTokenStorageImpl implements DesignTokenStorage, Subscriber {
    /**
     * @internal
     */
    parentNode: DesignTokenStorage | null = null;
    #container: Container;
    #tokens: Map<DesignToken<any>, any> = new Map();
    #children: Set<DesignTokenStorage> = new Set();
    #observers: Map<DesignToken<any>, Set<Observer>> = new Map();

    private getOrCreateObserverSet(token: DesignToken<any>): Set<Observer> {
        if (this.#observers.has(token)) {
            return this.#observers.get(token)!;
        }

        const set = new Set<Observer>();
        this.#observers.set(token, set);

        return set;
    }

    /**
     * The Custom Element for which the token is associated
     */
    public readonly owner: DesignTokenStorageTarget;

    /**
     * The upstream {@link DesignTokenStorage}
     */
    constructor(owner: DesignTokenStorageTarget) {
        this.owner = owner;
        this.#container = DI.getOrCreateDOMContainer(owner);

        if (this.#container.has(DesignTokenStorage, false)) {
            throw new Error(
                "DesignTokenStorageImpl was constructed with an owner element that already has an associated DesignTokenStorage. Use DesignTokenStorageImpl.for() to safely create new DesignTokenStorageImpl instances."
            );
        }

        this.#container.register(Registration.instance(DesignTokenStorage, this));

        Observable.getNotifier(owner.$fastController).subscribe(this, "isConnected");
        this.handleChange(owner.$fastController, "isConnected");
    }

    static for(element: DesignTokenStorageTarget): DesignTokenStorage {
        const container = DI.getOrCreateDOMContainer(element);

        return container.has(DesignTokenStorage, false)
            ? container.get<DesignTokenStorage>(DesignTokenStorage)
            : new DesignTokenStorageImpl(element);
    }

    /**
     * @internal
     */
    public handleChange(source: Controller, key: "isConnected") {
        if (source[key]) {
            try {
                const upstream = DI.getOrCreateDOMContainer(
                    source.element.parentElement!
                ).get(DesignTokenStorage);
                upstream.connect(this);
            } catch (e) {
                this.parentNode = null;
            }
        }
    }

    /**
     * @internal
     */
    public notify(...tokens: DesignToken<any>[]) {}

    public get<T>(token: DesignToken<T>): T {
        if (this.#tokens.has(token)) {
            return this.#tokens.get(token);
        } else if (this.parentNode) {
            return this.parentNode.get(token);
        } else {
            throw new Error(
                `Cannot get token ${token}. Ensure that token's value has been set.`
            );
        }
    }

    public set<T>(token: DesignToken<T>, value: T | DerivedDesignTokenValue<T>): void {
        this.#tokens.set(token, value);

        if (this.#observers.has(token)) {
            this.#observers.get(token)!.forEach(observer => {
                observer(this);
            });
        }

        // TODO: how do we notify downstream?
    }

    /**
     * Sets the provided node as a downstream node of the node.
     * @param node - The {@link DesignTokenStorage} being connected to
     */
    public connect(node: DesignTokenStorage) {
        node.parentNode = this;
        this.#children.forEach(ownSubscriber => {
            if (node.owner.contains(ownSubscriber.owner)) {
                // If a subscriber is attaching itself and there is a subscriber that is a child
                // of the new subscriber, it means the new subscriber  is an intermediary
                // that isn't in the tree yet, and we need to re-parent the subscriber.
                this.disconnect(ownSubscriber);
                node.connect(ownSubscriber);
            }
        });

        if (!this.#children.has(node)) {
            this.#children.add(node);
        }
    }

    public disconnect(node: DesignTokenStorage) {
        if (node.parentNode === this) {
            this.#children.delete(node);
            node.parentNode = null;
        }
    }

    /**
     * Observers a token and any dependent tokens for changes
     * @param token - The token to observe
     * @param observer - The callback to invoke when the token or any dependent tokens change
     */
    public observe(token: DesignToken<any>, observer: Observer) {
        const observers = this.getOrCreateObserverSet(token);
        observers.add(observer);

        observer(this);
    }
}

// When set upstream, we also need to subscribe to the upstream. When values are set,
// the tokenStorage will notify all subscribers of the change (we should probably batch this).

export const DesignTokenStorage = DI.createInterface<DesignTokenStorage>();
