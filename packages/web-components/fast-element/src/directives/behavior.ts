export interface Behavior {
    bind(source: unknown): void;
    unbind(source: unknown): void;
}

export interface BehaviorFactory {
    targetIndex: number;
    createBehavior(target: any): Behavior;
}
