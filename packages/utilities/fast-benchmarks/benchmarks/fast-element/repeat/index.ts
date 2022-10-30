import {
    customElement,
    FASTElement,
    html,
    observable,
    repeat,
    ViewTemplate,
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
    itemCount: count = "11",
    deleteCount: count2 = "1",
    addCount: count3 = "10",
    startIndex: count4 = "0",
} = queryParams;

const itemCount = parseInt(count as string),
    deleteCount = parseInt(count2 as string),
    addCount = parseInt(count3 as string),
    startIndex = parseInt(count4 as string);

type Templates = {
    [TemplateName: string]: ViewTemplate;
};
const templates: Templates = {
    basic: html<XApp>`
        ${repeat(
            x => x.items,
            html<RandomItem, XApp>`
                <li>
                    ${x => x.label}
                </li>
            `
        )}
    `,
    basicNoRecycle: html<XApp>`
        ${repeat(
            x => x.items,
            html<RandomItem>`
                <li>${x => x.label}</li>
            `,
            { recycle: false }
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
                                    `,
                                    { recycle: false }
                                )}
                            </ul>
                            <ul>
                                ${repeat(
                                    x => x.randomItemGroup2,
                                    html<RandomItem>`
                                        <li>${x => x.label}</li>
                                    `,
                                    { recycle: false }
                                )}
                            </ul>
                            <ol>
                                ${repeat(
                                    x => x.nestedGroup.randomItemGroup1,
                                    html<RandomItem>`
                                        <li>${x => x.label}</li>
                                    `,
                                    { recycle: false }
                                )}
                            </ol>
                        `}
                </li>
            `,
            { recycle: false }
        )}
    `,
};

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
    public template: string = <string>template;
    public otherItems: Array<RandomItem | NestedRandomData> = [];

    private isNested: boolean = false;
    constructor() {
        super();
        this.isNested = this.template.toLowerCase().includes("nested");
        this.items = this.isNested
            ? generateNestedData(itemCount)
            : generateData(itemCount);
        this.otherItems = generateData(addCount);
    }

    getTemplateType() {
        return templates[this.template];
    }

    getClickEvent() {
        switch (method) {
            case "splice":
                this.items.splice(startIndex, deleteCount, ...this.otherItems);
                break;
            case "reverse":
                this.items.reverse();
                break;
            case "push":
                this.items.push(...this.otherItems);
                break;
            case "unshift":
                this.items.unshift(...this.otherItems);
                break;
            case "shift":
                this.items.shift();
                break;
            case "sort":
                this.items.sort();
                break;
            case "filter":
                this.items = this.items.filter(item => item !== this.items[0]);
                break;
            default:
                this.items.push(...this.otherItems);
                break;
        }
    }
}
