import { Controller, FASTElement, Observable, Subscriber } from "@microsoft/fast-element";
import { Container, DI, Registration } from "../di/di";

export interface DesignTokenStorage {
    readonly upstream: DesignTokenStorage | null;
}

export class DesignTokenStorageImpl implements DesignTokenStorage, Subscriber {
    #upstream: DesignTokenStorage | null = null;
    #container: Container;
    #owner: HTMLElement & FASTElement;

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
}

export const DesignTokenStorage = DI.createInterface<DesignTokenStorage>();
