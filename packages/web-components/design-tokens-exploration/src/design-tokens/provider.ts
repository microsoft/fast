import { FASTElement } from "@microsoft/fast-element";
import { DesignTokens, FASTDesignTokenLibrary, IDesignTokens } from "../design-tokens";
import { DI, Registration } from "../di";

export type FASTElementConstructor<T = FASTElement & HTMLElement> = new (
    ...args: any[]
) => T;

export function DesignTokenProvider<TBase extends FASTElementConstructor>(Base: TBase) {
    const c = class extends Base {
        designTokens: FASTDesignTokenLibrary<IDesignTokens>;

        connectedCallback() {
            super.connectedCallback();
            const container = DI.getOrCreateDOMContainer(this);
            container.register(
                Registration.callback(DesignTokens, () => {
                    const tokens = new FASTDesignTokenLibrary<IDesignTokens>();
                    tokens.upstream = this.designTokens;

                    return tokens;
                })
            );
        }
    };

    DesignTokens(c.prototype, "designTokens");

    return c;
}
