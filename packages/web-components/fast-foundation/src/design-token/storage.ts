import {
    Controller,
    FASTElement,
    observable,
    Observable,
    Subscriber,
} from "@microsoft/fast-element";
import { Container, DI, Registration } from "../di/di";
import { DerivedDesignTokenValue, DesignToken } from "./design-token";

export type DesignTokenStorageTarget = FASTElement & HTMLElement;

export interface DesignTokenStorage {
    readonly owner: DesignTokenStorageTarget;
    parentNode: DesignTokenStorage | null;
    get<T>(token: DesignToken<T>): DesignTokenStorageValue<T>;
    set<T>(
        token: DesignToken<T>,
        value: T | ((target: DesignTokenStorageTarget) => T)
    ): void;
    connect(subscriber: DesignTokenStorage): DesignTokenStorage;
    disconnect(): DesignTokenStorage;
}

class DesignTokenStorageValue<T> implements Subscriber {
    @observable
    public value: T;

    constructor(initialValue?: T) {
        if (initialValue) {
            this.value = initialValue;
        }
    }

    public handleChange(source, key) {
        this.value = source[key];
    }
}

export class DesignTokenStorageImpl implements DesignTokenStorage, Subscriber {
    private container: Container;
    private tokens: Map<DesignToken<any>, DesignTokenStorageValue<any>> = new Map();
    private connections: Set<DesignTokenStorage> = new Set();

    /**
     * @internal
     */
    @observable
    public parentNode: DesignTokenStorage | null = null;
    public parentNodeChanged(
        previous: DesignTokenStorage | null,
        next: DesignTokenStorage | null
    ) {
        if (previous) {
            for (const [token, value] of this.tokens) {
                const upstreamValue = previous.get(token);

                Observable.getNotifier(upstreamValue).unsubscribe(value, "value");
            }
        }

        if (next) {
            for (const [token, value] of this.tokens) {
                const upstreamValue = next.get(token);

                Observable.getNotifier(upstreamValue).subscribe(value, "value");
                value.value = upstreamValue.value; // This isn't right
            }
        }
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
        this.container = DI.getOrCreateDOMContainer(owner);

        if (this.container.has(DesignTokenStorage, false)) {
            throw new Error(
                "DesignTokenStorageImpl was constructed with an owner element that already has an associated DesignTokenStorage. Use DesignTokenStorageImpl.for() to safely create new DesignTokenStorageImpl instances."
            );
        }

        this.container.register(Registration.instance(DesignTokenStorage, this));

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

    public get<T>(token: DesignToken<T>): DesignTokenStorageValue<T> {
        const local = this.getOrCreateLocalStorageValue(token);

        if (local.value !== void 0) {
            return local;
        } else if (this.parentNode) {
            const upstream = this.parentNode.get(token);
            local.value = upstream.value;
            Observable.getNotifier(upstream).subscribe(local);

            return local;
        }

        throw new Error(
            `Cannot get token ${token}. Ensure that token's value has been set.`
        );
    }

    public set<T>(token: DesignToken<T>, value: T): void {
        this.getOrCreateLocalStorageValue(token).value = value;
    }

    /**
     * Sets the provided node as a downstream node of the node.
     * @param node - The {@link DesignTokenStorage} being connected to
     */
    public connect(node: DesignTokenStorage) {
        node.parentNode = this;

        this.connections.forEach(connection => {
            if (node.parentNode!.owner.contains(connection.owner)) {
                node.connect(connection.disconnect());
            }
        });

        this.connections.add(node);

        return this;
    }

    public disconnect(): this {
        this.parentNode = null;

        return this;
    }

    private getOrCreateLocalStorageValue<T>(
        token: DesignToken<T>
    ): DesignTokenStorageValue<T> {
        if (this.tokens.has(token)) {
            return this.tokens.get(token)!;
        }

        const value = new DesignTokenStorageValue<T>();
        this.tokens.set(token, value);

        return value;
    }
}

// When set upstream, we also need to subscribe to the upstream. When values are set,
// the tokenStorage will notify all subscribers of the change (we should probably batch this).

export const DesignTokenStorage = DI.createInterface<DesignTokenStorage>();
