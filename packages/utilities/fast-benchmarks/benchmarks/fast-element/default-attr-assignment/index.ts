import { attr, customElement, FASTElement, html } from "@microsoft/fast-element";

@customElement({
    name: "x-app",
    template: html<XApp>`
        <div>
            ${x => x.content}
        </div>
    `,
})
export class XApp extends FASTElement {
    @attr content = "value";
}
