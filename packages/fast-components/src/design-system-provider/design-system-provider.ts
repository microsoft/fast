/* tslint:disable */
import { parseColorHexRGB } from "@microsoft/fast-colors";
import {
    createColorPalette,
    DesignSystem,
    DesignSystemDefaults,
} from "@microsoft/fast-components-styles-msft";
import {
    FastElement,
    observable,
    Observable,
    attr,
    FastElementDefinition,
} from "@microsoft/fast-element";
import { composedParent } from "../utilities";

export class DesignSystemProvider extends FastElement {
    private provider: DesignSystemProvider | null = null;

    public connectedCallback() {
        super.connectedCallback();

        const provider = this.findProvider();

        if (!!parent) {
            this.provider = provider;
            Observable.getNotifier(parent).subscribe(this, "designSystem");
        }
    }

    public handleChange(source, key) {
        console.log("Provider's design system changed");
    }

    public findProvider(): DesignSystemProvider | null {
        let parent = composedParent(this as HTMLElement);

        while (parent !== null) {
            if (parent instanceof DesignSystemProvider) {
                return parent;
            } else {
                parent = composedParent(parent);
            }
        }

        return null;
    }
}
