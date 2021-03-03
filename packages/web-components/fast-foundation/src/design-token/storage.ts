import { Controller, FASTElement, Observable, Subscriber } from "@microsoft/fast-element";
import { Container, DI, Registration } from "../di/di";
import { CustomPropertyManager } from "./custom-property-manager";
import { DesignToken } from "./design-token";

export interface DesignTokenStorage {
    readonly upstream: DesignTokenStorage | null;
    get<T>(token: DesignToken<T>): T;
    set<T>(
        token: DesignToken<T>,
        value: T | ((target: HTMLElement & FASTElement) => T)
    ): void;
}

export class DesignTokenStorageImpl implements DesignTokenStorage, Subscriber {
    #upstream: DesignTokenStorage | null = null;
    #container: Container;
    #owner: HTMLElement & FASTElement;
    #tokens: Map<DesignToken<any>, any> = new Map();

    public get upstream() {
        return this.#upstream;
    }

    constructor(owner: HTMLElement & FASTElement) {
        this.#owner = owner;
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

    static for(element: FASTElement & HTMLElement): DesignTokenStorage {
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
                this.#upstream = DI.getOrCreateDOMContainer(
                    source.element.parentElement!
                ).get(DesignTokenStorage);
            } catch (e) {
                this.#upstream = null;
            }
        }
    }

    public get<T>(token: DesignToken<T>): T {
        if (this.#tokens.has(token)) {
            return this.#tokens.get(token);
        } else if (this.upstream) {
            return this.upstream.get(token);
        } else {
            throw new Error(
                `Cannot get token ${token}. Ensure that token's value has been set.`
            );
        }
    }

    public set<T>(token: DesignToken<T>, value: T): void {
        this.#tokens.set(token, value);
    }
}

export const DesignTokenStorage = DI.createInterface<DesignTokenStorage>();
