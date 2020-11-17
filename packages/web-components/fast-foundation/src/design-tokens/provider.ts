import { Constructable, ElementStyles, FASTElement } from "@microsoft/fast-element";
import {
    CSSCustomPropertyManager,
    CustomPropertyManagerImpl,
} from "../css-custom-property-manager";
import { DesignTokenLibraryImpl } from "../design-tokens/library";
import { DI, Registration } from "../di";
import { DesignTokens } from "./tokens";

export default <TBase extends Constructable<FASTElement & HTMLElement>>(Base: TBase) => {
    const C = class extends Base {
        public designTokens: DesignTokenLibraryImpl<any>;
        private customPropertyManager: CustomPropertyManagerImpl;
        private localSheets = new Map<string, ElementStyles>();

        constructor(...args: any[]) {
            super(...args);

            DI.getOrCreateDOMContainer(this).register(
                Registration.callback(DesignTokens, () => {
                    const tokens = new DesignTokenLibraryImpl<any>();
                    tokens.upstream = this.designTokens;

                    return tokens;
                })
            );
        }

        connectedCallback() {
            super.connectedCallback();
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
        public handleChange(source: DesignTokenLibraryImpl<any>, keys: Array<any>) {
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
