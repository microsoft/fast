import { FASTElement, observable } from "@microsoft/fast-element";

export class ControlPane extends FASTElement {
    @observable
    componentType: string;

    @observable
    accentColor: string;

    @observable
    neutralColor: string;

    @observable
    showOnlyLayerBackgrounds: boolean = true;

    updateFormValue(field: string, value: any) {
        this.$emit("formvaluechange", { field: field, value: value });
    }
}
