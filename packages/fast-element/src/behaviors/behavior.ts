export interface Behavior {
    bind(source: unknown): void;
    unbind(): void;
}

export type BehaviorType<T = any> = new (directive: T, target: any) => Behavior;
