import { attr, FASTElement, html, when } from "../index.js";

class TestWhen extends FASTElement {
    @attr({
        mode: "boolean",
    })
    try: boolean = false;
}
TestWhen.define({
    name: "test-when",
    template: html`
        ${when(
            x => x.try,
            html`
                <span>Yes</span>
            `
        )}
        ${when(
            x => !x.try,
            html`
                <span>No</span>
            `
        )}
    `,
});

const itemRenderer = (): HTMLElement => {
    const testWhen = document.createElement("test-when");

    return testWhen;
};

export default itemRenderer;
export { tests } from "@tensile-perf/web-components";
