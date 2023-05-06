import { observable } from "@microsoft/fast-element";

export class PickerContext {
    @observable
    public disabled: boolean = false;
}
