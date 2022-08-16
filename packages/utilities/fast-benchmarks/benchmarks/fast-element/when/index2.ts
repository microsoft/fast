import {
    customElement,
    FASTElement,
    html,
    observable,
    repeat,
} from "@microsoft/fast-element";
import { data, RandomItem } from "../../../utils/index.js";

const templates = {
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
@customElement({
    name: "x-app",
    template: html<XApp>`
        <div>
            <button @click="${x => x.updateContentLength()}">Click Me</button>
            ${x => (x.contentLength < 2 ? templates.first : templates.second)}
        </div>
    `,
})
class XApp extends FASTElement {
    @observable items: Array<RandomItem> = data;
    @observable contentLength: number = 1;

    updateContentLength() {
        this.contentLength = this.contentLength < 2 ? 2 : 1;
    }
}
