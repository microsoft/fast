import { attr, customElement } from "@microsoft/fast-element";
import { Disclosure, DisclosureTemplate as template } from "@microsoft/fast-foundation";
import { DisclosureStyles as styles } from "./disclosure.styles";
/**
 * Animation event types for {@link Disclosure}
 */
const EVENT = {
    TRANSITION_END: "transitionend",
    TRANSITION_START: "transitionstart",
};
/**
 * The FAST Disclosure Element. Implements {@link @microsoft/fast-foundation#Disclosure},
 * {@link @microsoft/fast-foundation#DisclosureTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-Disclosure\>
 *
 */
@customElement({
    name: "fast-disclosure",
    template,
    styles,
})
export class FASTDisclosure extends Disclosure {
    /**
     * During the transition period
     *
     */
    @attr({ mode: "boolean" })
    public transitioning: boolean;

    public connectedCallback(): void {
        super.connectedCallback();
        this.contentNode.style.setProperty(
            "transition",
            "max-height 0.35s, padding 0.35s, opacity 0.35s"
        );
    }

    /**
     * Trigger show animation and wait for transition to be finished.
     * @param options - element node and its options
     * @override
     */
    async showAnimation({ contentNode }: any) {
        const expectedHeight = await this.calculateHeight(contentNode);
        contentNode.style.setProperty("opacity", "1");
        contentNode.style.setProperty("max-height", "0px");
        await this.nextFrame();
        contentNode.style.setProperty("max-height", `${expectedHeight}px`);
        await this.waitForTransition({ contentNode });
    }

    /**
     * Trigger hide animation and wait for transition to be finished.
     * @param options - element node and its options
     * @override
     */
    async hideAnimation({ contentNode }: any) {
        if (this.contentHeight !== 0) {
            ["opacity", "max-height"].map(prop => contentNode.style.setProperty(prop, 0));
            await this.waitForTransition({ contentNode });
        }
    }

    /**
     *  Wait until the transition event is finished.
     * @param options - element node and its options
     * @returns transition event promise
     */
    private waitForTransition({ contentNode }: any): Promise<any> {
        return new Promise(resolve => {
            const transitionStarted = () => {
                contentNode.removeEventListener(
                    EVENT.TRANSITION_START,
                    transitionStarted
                );
                this.transitioning = true;
            };
            contentNode.addEventListener(EVENT.TRANSITION_START, transitionStarted);

            const transitionEnded = () => {
                contentNode.removeEventListener(EVENT.TRANSITION_END, transitionEnded);
                this.transitioning = false;
                resolve();
            };
            contentNode.addEventListener(EVENT.TRANSITION_END, transitionEnded);
        });
    }

    /**
     * Calculate total content height after Disclosure opens
     * @param contentNode - content node
     * @returns content node height
     */
    private async calculateHeight(contentNode: any): Promise<number> {
        contentNode.style.setProperty("max-height", "");
        await this.nextFrame();
        return this.contentHeight; // Expected height i.e. actual size once collapsed after animation
    }

    /**
     * Resolves after requestAnimationFrame
     * @returns Promise that is resolved after requestAnimationFrame
     */
    private nextFrame = async (): Promise<void> =>
        new Promise(resolve => requestAnimationFrame(() => resolve()));
}

/**
 * Styles for Disclosure
 * @public
 */
export const DisclosureStyles = styles;
