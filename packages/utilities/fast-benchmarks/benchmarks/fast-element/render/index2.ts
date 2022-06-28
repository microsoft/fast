import {
    attr,
    bind,
    css,
    customElement,
    FASTElement,
    html,
    oneTime,
    repeat,
} from "@microsoft/fast-element";
import { data, RandomItem } from "../../../utils/index.js";

const xItemTemplate = html<XItem>`
    <div @click="${x => x.onClick}" class="item">
        ${x => x.value}
    </div>
`;

const styles = css`
    .item {
        display: flex;
    }
`;
@customElement({
    name: "x-item",
    template: xItemTemplate,
    styles,
})
class XItem extends FASTElement {
    @attr value: string | undefined;

    onClick(e: MouseEvent) {
        console.log(e.type);
    }
}

const xAppTemplate = html<XApp>`
    <div id="test-container">
        ${repeat(
            x => x.items,
            html<RandomItem>`
                <x-item
                    :value="${bind((x: { label: string }) => x.label, oneTime)}"
                ></x-item>
            `
        )}
    </div>
`;
@customElement({
    name: "x-app",
    template: xAppTemplate,
})
class XApp extends FASTElement {
    items: RandomItem[] = data;
}
