import { parseColorHexRGB } from "@microsoft/fast-colors";
import {
    createColorPalette,
    DesignSystem,
    DesignSystemDefaults,
} from "@microsoft/fast-components-styles-msft";
import { FastElement, observable, Observable } from "@microsoft/fast-element";
import { provider } from "../context";

@provider
export class DesignSystemProvider extends FastElement {
    @observable
    public context: DesignSystem = DesignSystemDefaults;
}
