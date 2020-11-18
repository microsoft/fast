import { Constructable, ElementStyles, FASTElement } from "@microsoft/fast-element";
import {
    CustomPropertyManager,
    DICustomPropertyManager,
} from "../css-custom-property-manager";
import {
    DesignTokenLibraryImpl,
    InheritableDesignTokenLibrary,
} from "../design-tokens/library";
import { DI, Registration } from "../di";
import { DesignTokenRegistry, DIDesignTokenRegistry } from "./registration";
import { DIDesignTokens } from "./library";

export default <TBase extends Constructable<FASTElement & HTMLElement>>(Base: TBase) => {
    const C = class extends Base {
        public designTokens: InheritableDesignTokenLibrary<any>;
        private customPropertyManager: CustomPropertyManager;
        private localSheets = new Map<string, ElementStyles>();
        private designTokenRegistry: DesignTokenRegistry;

        constructor(...args: any[]) {
            super(...args);

            DI.getOrCreateDOMContainer(this).register(
                Registration.callback(DIDesignTokens, () => {
                    const tokens = new DesignTokenLibraryImpl<any>();
                    tokens.upstream = this.designTokens;

                    return tokens;
                })
            );
        }

        connectedCallback() {
            super.connectedCallback();
            this.designTokens.subscribe(this);
        }

        /**
         * Handles changes to design tokens, detaching any stale custom property stylesheets
         * and attaching new ones
         * @internal
         * @param source the source library object
         * @param keys
         */
        public handleChange(source: DesignTokenLibraryImpl<any>, keys: Array<any>) {
            keys.forEach(key => {
                const customProperty = this.designTokenRegistry.customProperty(key);

                if (source.hasLocal(key) && customProperty) {
                    const sheet = this.customPropertyManager.get(
                        customProperty,
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

    DIDesignTokenRegistry(C.prototype, "designTokenRegistry");
    DIDesignTokens(C.prototype, "designTokens");
    DICustomPropertyManager(C.prototype, "customPropertyManager");

    return C;
};
