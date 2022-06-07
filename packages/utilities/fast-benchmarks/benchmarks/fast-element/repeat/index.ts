import {
    customElement,
    FASTElement,
    html,
    ItemViewTemplate,
    observable,
    repeat,
    ViewTemplate,
} from "@microsoft/fast-element";
import { data, nestedData, NestedRandomData, RandomItem } from "../../../utils/index.js";
import { queryParams } from "../../../utils/query-params.js";

const { method, ce } = queryParams;

const templates = {
    repeatBasic: html<XApp>`
        ${repeat(
            x => x.items,
            html<RandomItem>`
                <li>${x => x.label}</li>
            `
        )}
    `,
    repeatNoRecycleBasic: html<XApp>`
        ${repeat(
            x => x.items,
            html<RandomItem>`
                <li>${x => x.label}</li>
            ` as ItemViewTemplate,
            { positioning: true, recycle: false }
        )}
    `,
    repeatNested: html<XApp>`
        ${repeat(
            x => x.nestedItems,
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
    repeatNoRecycleNested: html<XApp>`
        ${repeat(
            x => x.nestedItems,
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
            ${x => x.getTemplateByMethod()}
        </div>
    `,
})
class XApp extends FASTElement {
    @observable items: RandomItem[] = data;
    @observable nestedItems: NestedRandomData[] = nestedData;
    @observable method: string = <string>method;

    private isNested: boolean = false;
    constructor() {
        super();
        this.isNested = this.method.toLowerCase().includes("nested");
    }

    getTemplateByMethod() {
        return templates[this.method] as ViewTemplate;
    }

    getClickEvent() {
        switch (ce) {
            case "inplace-replace":
                this.inplaceReplace();
                break;
            case "inplace-reverse":
                this.inplaceReverse();
                break;
            case "append":
                this.append();
                break;
            case "combo":
                this.combo();
                break;
        }
    }

    inplaceReplace() {
        if (this.isNested) {
            for (let i = 0; i < this.nestedItems.length; i++) {
                this.nestedItems.splice(i, 1, this.nestedItems[i] as NestedRandomData);
            }
        } else {
            for (let i = 0; i < this.items.length; i++) {
                this.items.splice(i, 1, this.items[i] as RandomItem);
            }
        }
    }

    inplaceReverse() {
        if (this.isNested) {
            for (let i = 0; i < this.nestedItems.length / 2; i++) {
                this.nestedItems.reverse();
            }
        } else {
            for (let i = 0; i < this.items.length / 2; i++) {
                this.items.reverse();
            }
        }
    }

    append() {
        if (this.isNested) {
            for (let i = 0; i < this.nestedItems.length / 2; i++) {
                this.nestedItems.push(...this.nestedItems);
                this.nestedItems = [];
            }
        } else {
            for (let i = 0; i < this.items.length / 2; i++) {
                this.items.push(...this.items);
                this.items = [];
            }
        }
    }

    combo() {
        for (let i = 0; i < 5; i++) {
            this.append();
            this.inplaceReverse();
            this.inplaceReplace();
            this.items = [];
        }
    }
}
