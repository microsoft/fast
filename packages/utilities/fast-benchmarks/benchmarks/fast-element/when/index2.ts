import {
    customElement,
    FASTElement,
    html,
    observable,
    repeat,
    ViewTemplate,
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

const templates = {
    basic: html`
        <div>
            ${x => x.contentLength < 2 && contentTemplates.second}
        </div>
    `,
    conditional: html<XApp>`
        <div>
            <button @click="${x => x.updateContentLength()}">Click Me</button>
            ${x =>
                x.contentLength < 2 ? contentTemplates.first : contentTemplates.second}
        </div>
    `,
} as any;
@customElement({
    name: "x-app",
    template: html<XApp>`
        ${x => x.getTemplateType()}
    `,
})
class XApp extends FASTElement {
    @observable items: Array<RandomItem> = data;
    @observable contentLength: number = 1;
    @observable template: string = <string>queryParams.template;

    getTemplateType() {
        return templates[this.template] as ViewTemplate;
    }
    updateContentLength() {
        this.contentLength = this.contentLength < 2 ? 2 : 1;
    }
}
