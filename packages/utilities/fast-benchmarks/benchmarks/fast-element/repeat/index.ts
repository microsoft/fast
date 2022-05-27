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

const { method, ce } = queryParams;

const templates = {
    repeat: html<XApp>`
        ${repeat(
            x => x.items,
            html<RandomItem>`
                <li>${x => x.label}</li>
            `
        )}
    `,
    repeatNoRecycle: html<XApp>`
        ${(repeat(
            x => x.items,
            html<RandomItem>`
                <li>${x => x.label}</li>
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
        }
    }

    inplaceReplace() {
        this.items.splice(0, 1, this.items[0]);
    }

    inplaceReverse() {
        this.items.reverse();
    }
}
