import { DOM } from "../dom";
import { IBehavior, BehaviorType } from "../behaviors/behavior";
import { ITargetedInstruction } from "../instructions";

export abstract class Directive implements ITargetedInstruction {
    public abstract behavior: BehaviorType;

    public createPlaceholder(instructionIndex: number) {
        return DOM.createInterpolationPlaceholder(instructionIndex);
    }

    public hydrate(target: any, behaviors: IBehavior[]): void {
        behaviors.push(new this.behavior!(this, target));
    }
}
