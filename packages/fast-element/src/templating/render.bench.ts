import { attr, css, FASTElement, html, oneTime, repeat } from "../index.js";
import { data, RandomItem } from "../__test__/utilities.js";

const xItemTemplate = html<XItem>`
    <div @click="${x => x.onClick}" class="item">${x => x.value}</div>
`;

const styles = css`
    .item {
        display: flex;
    }
`;

class XItem extends FASTElement {
    @attr
    value: string | undefined;

    onClick(e: MouseEvent) {
        console.log(e.type);
    }
}
XItem.define({
    name: "x-item",
    template: xItemTemplate,
    styles,
});

const xAppTemplate = html<XApp>`
    <div id="test-container">
        ${repeat(
            x => x.items,
            html<RandomItem>`
                <x-item :value="${oneTime((x: { label: string }) => x.label)}"></x-item>
            `
        )}
    </div>
`;
class XApp extends FASTElement {
    items: RandomItem[] = data;
}
XApp.define({
    name: "x-app",
    template: xAppTemplate,
});

const itemRenderer = (): HTMLElement => {
    const testRender = document.createElement("x-app");

    return testRender;
};

export default itemRenderer;
export { tests } from "@tensile-perf/web-components";
