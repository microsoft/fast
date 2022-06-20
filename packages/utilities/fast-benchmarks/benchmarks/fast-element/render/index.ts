import {
    attr,
    css,
    customElement,
    FASTElement,
    html,
    observable,
    repeat,
} from "@microsoft/fast-element";
import { data, RandomItem } from "../../../utils/index.js";

@customElement({
    name: "x-item",
    template: html<XItem>`
        <div @click="${x => x.onClick}" class="item">
            ${(x: XItem) => x.value}
        </div>
    `,
    styles: css`
        .item {
            display: flex;
        }
    `,
})
class XItem extends FASTElement {
    @attr value: string | undefined;
    onClick(e: MouseEvent) {
        console.log(e.type);
    }
}

@customElement({
    name: "x-app",
    template: html<XApp>`
        <div>
            ${repeat(
                x => x.items,
                html`
                    <x-item :value="${(x: RandomItem) => x.label}"></x-item>
                `
            )}
        </div>
    `,
})
class XApp extends FASTElement {
    @observable items: RandomItem[] = data;
}
