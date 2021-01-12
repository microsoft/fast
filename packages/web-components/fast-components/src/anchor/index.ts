import {
    attr,
    customElement,
    FASTElement,
    html,
    observable,
    repeat,
    when,
} from "@microsoft/fast-element";
import { Anchor, AnchorTemplate as template } from "@microsoft/fast-foundation";
import { ButtonAppearance } from "../button";
import { AnchorStyles as styles } from "./anchor.styles";

/**
 * Types of anchor appearance.
 * @public
 */
export type AnchorAppearance = ButtonAppearance | "hypertext";

/**
 * The FAST Anchor Element. Implements {@link @microsoft/fast-foundation#Anchor},
 * {@link @microsoft/fast-foundation#AnchorTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-anchor\>
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus | delegatesFocus}
 */
@customElement({
    name: "fast-anchor",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class FASTAnchor extends Anchor {
    /**
     * The appearance the anchor should have.
     *
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    @attr
    public appearance: AnchorAppearance;
    public appearanceChanged(
        oldValue: AnchorAppearance,
        newValue: AnchorAppearance
    ): void {
        if (oldValue !== newValue) {
            this.classList.add(newValue);
            this.classList.remove(oldValue);
        }
    }

    public connectedCallback() {
        super.connectedCallback();

        if (!this.appearance) {
            this.appearance = "neutral";
        }
    }

    /**
     * Applies 'icon-only' class when there is only an SVG in the default slot
     *
     * @internal
     *
     */
    public defaultSlottedContentChanged(oldValue, newValue): void {
        const slottedElements = this.defaultSlottedContent.filter(
            x => x.nodeType === Node.ELEMENT_NODE
        );
        if (slottedElements.length === 1 && slottedElements[0] instanceof SVGElement) {
            this.control.classList.add("icon-only");
        } else {
            this.control.classList.remove("icon-only");
        }
    }
}

/**
 * Styles for Anchor
 * @public
 */
export const AnchorStyles = styles;

debugger;
const myCounterTemplate = html<MyCounter>`
    ${when(
        x => x.item.int !== 0,
        () => html`
            <div>${x => x.item.int}</div>
        `
    )}
    <button @click=${x => x.change(1)}>+</button>
    <button @click=${x => x.change(-1)}>-</button>
    <p><b>Repro instructions</b></p>
    <ol>
        <li>Click the "+" button and observe a list item appears with the content "1"</li>
        <li>Click the "+" button and observe a list item appears with the content "2"</li>
        <li>Click the "-" button twice and observe the list item disapears</li>
        <li>Click the "+" button and observe a list item appears with the content "1"</li>
        <li>
            Click the "+" button and
            <i>observe the list item content doesn't change.</i>
            <br />
            <b>Expected: the list item should have the content "2"</b>
        </li>
    </ol>
`;

class Item {
    @observable
    int = 0;
}

@customElement({
    name: "my-counter",
    template: myCounterTemplate,
})
export class MyCounter extends FASTElement {
    @observable
    item = new Item();

    @observable
    count = this.item.int;

    change(delta) {
        this.item.int += delta;
        this.count = this.item.int;
    }
}
