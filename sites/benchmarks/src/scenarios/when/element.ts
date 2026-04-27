import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { html } from "@microsoft/fast-element/html.js";
import { observable } from "@microsoft/fast-element/observable.js";
import { when } from "@microsoft/fast-element/when.js";
export class BenchElement extends FASTElement {
    @observable show = true;
}

export const template = html<BenchElement>`
    ${when(
        x => x.show,
        html`
            <span>Visible</span>
        `,
    )}
    ${when(
        x => !x.show,
        html`
            <span>Hidden</span>
        `,
    )}
`;
