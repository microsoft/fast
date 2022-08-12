import {
    attr,
    customElement,
    FASTElement,
    html,
    nullableNumberConverter,
} from "@microsoft/fast-element";

@customElement({
    name: "x-app",
    template: html<XApp>`
        <div>
            ${x => x.s} ${x => x.b} ${x => x.n}
        </div>
    `,
})
export class XApp extends FASTElement {
    @attr s = "string";
    @attr({ mode: "boolean" }) b = true;
    @attr({ converter: nullableNumberConverter }) n = 1;
}
