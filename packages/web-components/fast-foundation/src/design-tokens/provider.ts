import { ElementStyles, FASTElement } from "@microsoft/fast-element";
import {
    DesignTokenConfig,
    DesignTokens,
    FASTDesignTokenLibrary,
} from "../design-tokens";
import { DI, Registration } from "../di";
import { Constructable } from "../interfaces";
import {
    CSSCustomPropertyManager,
    FASTCustomPropertyManager,
} from "../css-custom-property-manager";

export default <TBase extends Constructable<FASTElement & HTMLElement>>(Base: TBase) => {
    const C = class extends Base {
        public designTokens: FASTDesignTokenLibrary<DesignTokenConfig>;
        private customPropertyManager: FASTCustomPropertyManager;
        private localSheets = new Map<string, ElementStyles>();

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
            this.customPropertyManager.alias("backgroundColor", "background-color");
            this.designTokens.subscribe(this);
            // How do I know what should be reflected to CSS custom properties?
        }

        /**
         * Handles changes to design tokens, detaching any stale custom property stylesheets
         * and attaching new ones
         * @internal
         * @param source the source library object
         * @param keys
         */
        public handleChange(
            source: FASTDesignTokenLibrary<DesignTokenConfig>,
            keys: Array<keyof DesignTokenConfig>
        ) {
            keys.forEach(key => {
                if (source.hasLocal(key)) {
                    const sheet = this.customPropertyManager.get(
                        key,
                        this.designTokens.get(key)
                    );
                    const prevSheet = this.localSheets.get(key);

                    if (prevSheet) {
                        this.$fastController.removeStyles(prevSheet);
                    }

                    this.$fastController.addStyles(sheet);
                    this.localSheets.set(key, sheet);
                }
            });
        }
    };

    DesignTokens(C.prototype, "designTokens");
    CSSCustomPropertyManager(C.prototype, "customPropertyManager");

    return C;
};
