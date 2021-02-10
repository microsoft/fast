import { observable } from "@microsoft/fast-element";
import { Container, DI, Key, Registration } from "@microsoft/fast-foundation";

export interface SimpleDesignToken<T> {
    /** @observable */
    value: T;
}

export interface DerivedDesignToken<T> {
    readonly value: T;
}

export type DesignToken<T> = SimpleDesignToken<T> | DerivedDesignToken<T>;

export class SimpleDesignTokenImpl<T> {
    @observable
    public value: T;
    constructor(value: T) {
        this.value = value;
    }
}

export interface DesignTokens {
    set<T>(key: Key, token: DesignToken<T>);
}

export class DesignTokensImpl implements DesignTokens {
    private container: Container;
    constructor(private target: HTMLElement) {
        this.container = DI.getOrCreateDOMContainer(target);
    }

    set<T>(key: Key, token: DesignToken<T>) {
        if (this.container.has(key, false)) {
            const value = this.container.get(key);
            value.value = token.value;
        } else {
            this.container.register(Registration.instance(key, token));
        }
    }
}
