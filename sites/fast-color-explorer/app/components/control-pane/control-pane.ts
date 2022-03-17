import { attr } from "@microsoft/fast-element";
import { FoundationElement } from "@microsoft/fast-foundation";

export class ControlPane extends FoundationElement {
    @attr({ attribute: "component-type" })
    componentType: string;

    @attr({ attribute: "accent-color" })
    accentColor: string;

    @attr({ attribute: "neutral-color" })
    neutralColor: string;

    @attr({ attribute: "show-only-layer-backgrounds", mode: "boolean" })
    showOnlyLayerBackgrounds: boolean = true;

    updateFormValue(field: string, value: any) {
        this.$emit("formvaluechange", { field: field, value: value });
    }
}
