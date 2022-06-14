import {
    customElement,
    FASTElement,
    html,
    ItemViewTemplate,
    observable,
    repeat,
} from "@microsoft/fast-element";
import {
    generateData,
    generateNestedData,
    NestedRandomData,
    RandomItem,
} from "../../../utils/index.js";
import { queryParams } from "../../../utils/query-params.js";

const {
    template,
    method,
    itemCount: count = 10,
    loopCount: count2 = 1,
    deleteCount: count3 = 1,
    addCount: count4 = 1,
    startIndex: count5 = 0,
} = queryParams;

const itemCount = parseInt(count as string);
const loopCount = parseInt(count2 as string);
const deleteCount = parseInt(count3 as string);
const addCount = parseInt(count4 as string);
const startIndex = parseInt(count5 as string);

const templates = {
    basic: html<XApp>`
        ${repeat(
            x => x.items,
            html<RandomItem>`
                <li>${x => x.label}</li>
            `
        )}
    `,
    basicNoRecycle: html<XApp>`
        ${repeat(
            x => x.items,
            html<RandomItem>`
                <li>${x => x.label}</li>
            ` as ItemViewTemplate,
            { positioning: true, recycle: false }
        )}
    `,
    nested: html<XApp>`
        ${repeat(
            x => x.items,
            html<NestedRandomData>`
                <li>
                    ${x =>
                        html`
                            <b>ID: ${x.id}</b>
                            <li>one: ${x.randomItem1.label}</li>
                            <li>two: ${x.randomItem2.label}</li>
                            <li>three: ${x.randomItem3.label}</li>
                            <ul>
                                ${repeat(
                                    x => x.randomItemGroup1,
                                    html<RandomItem>`
                                        <li>${x => x.label}</li>
                                    `
                                )}
                            </ul>
                            <ul>
                                ${repeat(
                                    x => x.randomItemGroup2,
                                    html<RandomItem>`
                                        <li>${x => x.label}</li>
                                    `
                                )}
                            </ul>
                            <ol>
                                ${repeat(
                                    x => x.nestedGroup.randomItemGroup1,
                                    html<RandomItem>`
                                        <li>${x => x.label}</li>
                                    `
                                )}
                            </ol>
                        `}
                </li>
            `
        )}
    `,
    nestedNoRecycle: html<XApp>`
        ${repeat(
            x => x.items,
            html<NestedRandomData>`
                <li>
                    ${x =>
                        html`
                            <b>ID: ${x.id}</b>
                            <li>one: ${x.randomItem1.label}</li>
                            <li>two: ${x.randomItem2.label}</li>
                            <li>three: ${x.randomItem3.label}</li>
                            <ul>
                                ${repeat(
                                    x => x.randomItemGroup1,
                                    html<RandomItem>`
                                        <li>${x => x.label}</li>
                                    `
                                )}
                            </ul>
                            <ul>
                                ${repeat(
                                    x => x.randomItemGroup2,
                                    html<RandomItem>`
                                        <li>${x => x.label}</li>
                                    `
                                )}
                            </ul>
                            <ol>
                                ${repeat(
                                    x => x.nestedGroup.randomItemGroup1,
                                    html<RandomItem>`
                                        <li>${x => x.label}</li>
                                    `
                                )}
                            </ol>
                        `}
                </li>
            ` as ItemViewTemplate,
            { positioning: true, recycle: false }
        )}
    `,
} as any;

@customElement({
    name: "x-app",
    template: html<XApp>`
        <div>
            <button @click="${x => x.getClickEvent()}">Click Me</button>
            ${x => x.getTemplateType()}
        </div>
    `,
})
class XApp extends FASTElement {
    @observable items: Array<RandomItem | NestedRandomData> = [];
    @observable template: string = <string>template;

    private isNested: boolean = false;
    constructor() {
        super();
        this.isNested = this.template.toLowerCase().includes("nested");
        this.items = this.isNested
            ? generateNestedData(itemCount)
            : generateData(itemCount);
    }

    getTemplateType() {
        return templates[this.template];
    }

    getClickEvent() {
        switch (method) {
            case "splice":
                this.splice();
                break;
            case "reverse":
                this.reverse();
                break;
            case "push":
                this.push();
                break;
            case "unshift":
                this.unshift();
                break;
            case "shift":
                this.shift();
                break;
            case "sort":
                this.sort();
                break;
            case "filter":
                this.filter();
                break;
            case "combo":
                this.combo();
                break;
            default:
                this.push();
                break;
        }
    }

    splice() {
        const otherData: Array<RandomItem | NestedRandomData> = generateData(addCount);
        for (let i = startIndex; i < loopCount; i++) {
            this.items.splice(i, deleteCount, ...otherData);
        }
    }

    reverse() {
        for (let i = startIndex; i <= loopCount; i++) {
            this.items.reverse();
        }
    }

    push() {
        const otherData: Array<RandomItem | NestedRandomData> = generateData(addCount);
        for (let i = startIndex; i < loopCount; i++) {
            this.items.push(...otherData);
        }
    }

    unshift() {
        const otherData: Array<RandomItem | NestedRandomData> = generateData(addCount);
        for (let i = startIndex; i < loopCount; i++) {
            this.items.unshift(...otherData);
        }
    }

    shift() {
        for (let i = startIndex; i <= loopCount; i++) {
            this.items.shift();
        }
    }

    sort() {
        for (let i = startIndex; i < loopCount; i++) {
            this.items.sort();
        }
    }

    filter() {
        for (let i = startIndex; i < loopCount - 1; i++) {
            this.items = this.items.filter(item => item !== this.items[0]);
        }
    }

    combo() {
        for (let i = startIndex; i < loopCount; i++) {
            this.push();
            this.reverse();
            this.splice();
            this.items = [];
        }
    }
}
