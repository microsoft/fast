import { FASTElement, html, observable, when } from "@microsoft/fast-element";

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
