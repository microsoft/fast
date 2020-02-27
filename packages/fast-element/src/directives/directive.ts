import { DOM } from "../dom";
import { Behavior, BehaviorType } from "../behaviors/behavior";
import { TargetedInstruction } from "../instructions";

export abstract class Directive implements TargetedInstruction {
    public abstract behavior: BehaviorType;

    public createPlaceholder(instructionIndex: number) {
        return DOM.createInterpolationPlaceholder(instructionIndex);
    }

    public hydrate(target: any, behaviors: Behavior[]): void {
        behaviors.push(new this.behavior!(this, target));
    }
}
