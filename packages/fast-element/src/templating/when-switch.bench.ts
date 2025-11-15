import { attr, FASTElement, html, nullableNumberConverter, when } from "../index.js";

const emotionalTemplates = {
    depressed: html`
        <div>
            <span>I'm so depressed :O</span>
        </div>
    `,
    sad: html`
        <div>
            <span>I'm so sad :(</span>
        </div>
    `,
    happy: html`
        <div>
            <span>I'm so happy :)</span>
        </div>
    `,
    ecstatic: html`
        <div>
            <span>I'm so ecstatic :D</span>
        </div>
    `,
    indifferent: html`
        <div>
            <span>I'm indifferent :|</span>
        </div>
    `,
};
class TestWhen extends FASTElement {
    @attr({
        mode: "fromView",
        converter: nullableNumberConverter,
    })
    value: number = 0;
}
TestWhen.define({
    name: "test-when",
    template: html`
        <button @click="${x => x.update(true)}">Click Me</button>
        ${when(x => x.value <= 1, emotionalTemplates.depressed)}
        ${when(x => x.value === 2 || x.value === 3, emotionalTemplates.sad)}
        ${when(x => x.value === 4 || x.value === 5, emotionalTemplates.indifferent)}
        ${when(x => x.value >= 6 && x.value < 9, emotionalTemplates.happy)}
        ${when(x => x.value === 9 || x.value === 10, emotionalTemplates.ecstatic)}
    `,
});

const itemRenderer = (): HTMLElement => {
    const testWhen = document.createElement("test-when");

    testWhen.click();

    return testWhen;
};

export default itemRenderer;
export { tests } from "@tensile-perf/web-components";
