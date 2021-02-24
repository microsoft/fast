import {
    Controller,
    FASTElement,
    html,
    Observable,
    repeat,
    Subscriber,
} from "@microsoft/fast-element";
import { DI, Registration } from "../di/di";

export interface DesignTokenStorage {
    readonly upstream: DesignTokenStorage | null;
    connect(element: HTMLElement): void;
    disconnect(): void;
}

export class DesignTokenStorageImpl implements DesignTokenStorage, Subscriber {
    #upstream: DesignTokenStorage | null = null;

    private trackConnection(target: FASTElement) {}

    public get upstream() {
        return this.#upstream;
    }

    /**
     *
     * @param element - Connects the storage service to an Element
     */
    public connect(element: HTMLElement & FASTElement): DesignTokenStorage {
        const container = DI.getOrCreateDOMContainer(element);

        if (container.has(DesignTokenStorage, false)) {
            throw new Error(
                `A DesignTokenStorage has already been connected to ${element}.`
            );
        } else if (container.has(DesignTokenStorage, true)) {
            this.#upstream = container.get(DesignTokenStorage);
        }

        container.register(Registration.instance(DesignTokenStorage, this));

        Observable.getNotifier(element.$fastController).subscribe(this, "isConnected");

        return this;
    }

    public disconnect(): DesignTokenStorage {
        return this;
    }

    static getOrCreateTokenStorage(
        element: FASTElement & HTMLElement
    ): DesignTokenStorage {
        const container = DI.getOrCreateDOMContainer(element);

        return container.has(DesignTokenStorage, false)
            ? container.get<DesignTokenStorage>(DesignTokenStorage)
            : new DesignTokenStorageImpl().connect(element);
    }

    /**
     * @internal
     */
    public handleChange(source: Controller, key: "isConnected") {
        if (source[key]) {
            this.#upstream = DI.getOrCreateDOMContainer(
                source.element.parentElement!
            ).get(DesignTokenStorage);
        }
    }
}

export const DesignTokenStorage = DI.createInterface<DesignTokenStorage>();
