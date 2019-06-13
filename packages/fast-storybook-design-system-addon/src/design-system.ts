class DesignSystemManager<T> {
    private storagekey: string = "design-system";
    private defaultValue: T;

    public get(): T {
        return JSON.parse(this.readStorage());
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

export default new DesignSystemManager();
