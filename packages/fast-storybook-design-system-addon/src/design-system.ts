import {
    DesignSystemDefaults,
    DesignSystem,
} from "@microsoft/fast-components-styles-msft";

export default class DesignSystemManager<T> {
    constructor(defaultValue: T) {
        this.defaultValue = defaultValue;
    }

    private designSystem: DesignSystem;
    private storagekey: string = "design-system";
    private defaultValue: T;

    public get(): T {
        let stored: string = this.readStorage();

        if (!stored) {
            this.set(this.defaultValue);
            stored = this.readStorage();
        }

        return JSON.parse(stored);
    }

    public update(updates: Partial<T>): void {
        this.set({ ...this.get(), ...updates });
    }

    public set(value: T): void {
        window.localStorage.setItem(this.storagekey, JSON.stringify(value));
    }

    private readStorage(): string {
        return window.localStorage.getItem(this.storagekey);
    }
}
