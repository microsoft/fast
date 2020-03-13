export interface Behavior {
    bind(source: unknown): void;
    unbind(): void;
}

export interface BehaviorFactory {
    targetIndex: number;
    createBehavior(target: any): Behavior;
}
