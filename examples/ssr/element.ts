import { css, customElement, FASTElement, html, when } from "@microsoft/fast-element";

@customElement({
    name: "fast-element",
    template: html<MyElement>`
        <ul>
            <li>Inline content</li>
            <li>
                Initialized string binding:
                ${(x: MyElement): string => x.initializedString}
            </li>
            ${when(
                (x: MyElement): boolean => x.initializedBool,
                html`
                    <li>When directive: should be emitted</li>
                `
            )}
            ${when(
                (x: MyElement): boolean => !x.initializedBool,
                html`
                    <li>When directive: should not be emitted</li>
                `
            )}
        </ul>
    `,
    styles: css`
        :host {
            display: "block";
        }
    `,
    shadowOptions: {
        mode: "closed",
    },
})
export class MyElement extends FASTElement {
    public initializedString: string = "bar";
    public initializedBool: boolean = true;
}
