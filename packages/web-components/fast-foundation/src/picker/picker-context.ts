import { observable } from "@microsoft/fast-element";
import { Context } from "@microsoft/fast-element/context.js";

export interface PickerContext {
    disabled: boolean;
}

export const PickerContext = Context.create<PickerContext>("picker-context");

export class DefaultPickerContext implements PickerContext {
    /**
     * The disabled state of the picker
     *
     * @internal
     */
    @observable
    public disabled: boolean = false;
}
