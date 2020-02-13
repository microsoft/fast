import { IBehavior } from "./behaviors/behavior";

export interface ITargetedInstruction {
    hydrate(target: any, bindings: IBehavior[]): void;
}

export class CompositeInstruction implements ITargetedInstruction {
    public readonly instructions: ITargetedInstruction[];

    constructor(...instructions: ITargetedInstruction[]) {
        this.instructions = instructions;
    }

    public hydrate(target: any, bindings: IBehavior[]): void {
        const instructions = this.instructions;

        for (let i = 0, ii = instructions.length; i < ii; ++i) {
            instructions[i].hydrate(target, bindings);
        }
    }
}
