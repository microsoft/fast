import { Behavior } from "./behaviors/behavior";

export interface TargetedInstruction {
    hydrate(target: any, bindings: Behavior[]): void;
}

export class CompositeInstruction implements TargetedInstruction {
    public readonly instructions: TargetedInstruction[];

    constructor(...instructions: TargetedInstruction[]) {
        this.instructions = instructions;
    }

    public hydrate(target: any, bindings: Behavior[]): void {
        const instructions = this.instructions;

        for (let i = 0, ii = instructions.length; i < ii; ++i) {
            instructions[i].hydrate(target, bindings);
        }
    }
}
