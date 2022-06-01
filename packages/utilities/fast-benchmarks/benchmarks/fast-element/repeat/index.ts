import {
    customElement,
    FASTElement,
    html,
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
        ${(repeat(
            x => x.items,
            html<RandomItem>`
                <li>${x => x.label}</li>
            `
        ),
        { recycle: false })}
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
        ${(repeat(
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
        ),
        { recycle: false })}
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
        }
    }

    inplaceReplace() {
        this.items.splice(0, 1, this.items[0]);
    }

    inplaceReverse() {
        this.items.reverse();
    }

    append() {
        this.items.push(...data);
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
