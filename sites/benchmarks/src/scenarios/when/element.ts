import { FASTElement } from "@microsoft/fast-element";
import { when } from "@microsoft/fast-element/directives/when.js";
import { html } from "@microsoft/fast-element/html.js";
import { observable } from "@microsoft/fast-element/observable.js";
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
