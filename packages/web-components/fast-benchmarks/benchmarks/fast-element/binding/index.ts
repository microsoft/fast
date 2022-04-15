import {
    attr,
    css,
    customElement,
    FASTElement,
    html,
    observable,
    repeat,
} from "@microsoft/fast-element";

import { _random, adjectives, colours, nouns } from "../../utils/constants.js";
import runBenchmark from "./shared.js";

const itemCount = 250;
let id = 0;

export class RandomItem {
    @observable label: string;

    constructor(public readonly id: number) {
        this.label =
            adjectives[_random(adjectives.length)] +
            " " +
            colours[_random(colours.length)] +
            " " +
            nouns[_random(nouns.length)];
    }
}

function generateData(count: number) {
    const data = [];

    for (let i = 0; i < count; i++) {
        data.push(new RandomItem(++id));
    }

    return data;
}
const data: RandomItem[] = generateData(itemCount);

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
    <div id="container">
        ${repeat(
            x => x.items,
            html`
                <x-item :value="${x => x.label}"></x-item>
            `
        )}
    </div>
`;
@customElement({
    name: "x-app",
    template: xAppTemplate,
})
class XApp extends FASTElement {
    @observable items: RandomItem[] = data;
}

runBenchmark();
