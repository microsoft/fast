import {
    customElement,
    FASTElement,
    html,
    observable,
    repeat,
    ViewTemplate,
    when,
} from "@microsoft/fast-element";
import { data, RandomItem } from "../../../utils/index.js";
import { queryParams } from "../../../utils/query-params.js";

const contentTemplates = {
    first: html`
        <div>
            <span>This is the First Template</span>
            ${repeat(
                x => x.items,
                html<RandomItem>`
                    <ol>
                        ${x => x.label}
                    </ol>
                `
            )}
        </div>
    `,
    second: html`
        <div>
            <span>This is the Second Template</span>
            ${repeat(
                x => x.items,
                html<RandomItem>`
                    <li>${x => x.label}</li>
                `
            )}
        </div>
    `,
};

type Templates = {
    [TemplateName: string]: ViewTemplate;
};

const renderTemplates: Templates = {
    basic: html<XApp>`
        <div>
            ${when(x => x.value < 2, contentTemplates.second)}
        </div>
    `,
};

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
const clickTriggerTemplates: Templates = {
    conditional: html<XApp>`
        <div>
            <button @click="${x => x.update(false)}">Click Me</button>
            ${when(x => x.value < 2, contentTemplates.first)}
            ${when(x => x.value >= 2, contentTemplates.second)}
        </div>
    `,
    switch: html<XApp>`
        <div>
            <button @click="${x => x.update(true)}">Click Me</button>
            ${when(x => x.value <= 1, emotionalTemplates.depressed)}
            ${when(x => x.value === 2 || x.value === 3, emotionalTemplates.sad)}
            ${when(x => x.value === 4 || x.value === 5, emotionalTemplates.indifferent)}
            ${when(x => x.value >= 6 && x.value < 9, emotionalTemplates.happy)}
            ${when(x => x.value === 9 || x.value === 10, emotionalTemplates.ecstatic)}
        </div>
    `,
};
@customElement({
    name: "x-app",
    template: html<XApp>`
        ${x => x.getTemplateType()}
    `,
})
class XApp extends FASTElement {
    @observable items: Array<RandomItem> = data;
    @observable value: number = 0;
    @observable template: string = <string>queryParams.template;

    getTemplateType() {
        return renderTemplates[this.template]
            ? renderTemplates[this.template]
            : clickTriggerTemplates[this.template];
    }
    update(increment: boolean) {
        if (increment) {
            this.value = this.value === 10 ? 0 : this.value + 1;
        } else {
            this.value = this.value < 2 ? 2 : 0;
        }
    }
}
