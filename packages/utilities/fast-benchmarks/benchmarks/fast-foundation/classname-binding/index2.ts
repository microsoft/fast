import { attr, customElement, FASTElement, html } from "@microsoft/fast-element";

class Button extends FASTElement {}
@customElement({
    name: "x-button",
    template: html`
        <button
            class="${x =>
                [x.open && "open", x.disabled && "disabled", x.position]
                    .filter(Boolean)
                    .join(" ")}"
        ></button>
    `,
    styles: "",
})
export class FluentButton extends Button {
    @attr foo: boolean = false;

    @attr bar: boolean = true;

    @attr baz: "A" | "B" = "A";
}

const xAppTemplate = html<XApp>`
    <x-button></x-button>
`;
@customElement({
    name: "x-app",
    template: xAppTemplate,
})
class XApp extends FASTElement {}
