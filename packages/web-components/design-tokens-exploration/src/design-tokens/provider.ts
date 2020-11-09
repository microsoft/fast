import { FASTElement } from "@microsoft/fast-element";
import {
    DesignTokenConfig,
    DesignTokens,
    FASTDesignTokenLibrary,
} from "../design-tokens";
import { DI, Registration } from "../di";
import { Constructable } from "../interfaces";

export function DesignTokenProvider<
    TBase extends Constructable<FASTElement & HTMLElement>
>(Base: TBase) {
    const C = class extends Base {
        public designTokens: FASTDesignTokenLibrary<DesignTokenConfig>;

        constructor(...args: any[]) {
            super(...args);

            const container = DI.getOrCreateDOMContainer(this);
            container.register(
                Registration.callback(DesignTokens, () => {
                    const tokens = new FASTDesignTokenLibrary<DesignTokenConfig>();
                    tokens.upstream = this.designTokens;

                    return tokens;
                })
            );
        }

        connectedCallback() {
            super.connectedCallback();
            // Subscribe to changes in designTokens
            // How do I know what should be reflected to CSS custom properties?
        }
    };

    DesignTokens(C.prototype, "designTokens");

    return C;
}
