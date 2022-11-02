import { css, FASTElement, html, repeat } from "@microsoft/fast-element";

export class MyElement extends FASTElement {
    items = ["foo", "bar", "bat"];
}

const template = html`
    <h1>Hello World</h1>
    <ul>
        ${repeat(
            x => x.items,
            html`
                <li>${x => x}</li>
            `
        )}
    </ul>
`;
const styles = css`
    :host {
        color: red;
    }
`;
MyElement.define({
    name: "my-element",
    template: template,
    styles: styles,
});
