import { ExecutionContext } from "../observation/observable";

export interface Behavior {
    bind(source: unknown, context: ExecutionContext): void;
    unbind(source: unknown): void;
}

export interface BehaviorFactory {
    targetIndex: number;
    createBehavior(target: any): Behavior;
}
