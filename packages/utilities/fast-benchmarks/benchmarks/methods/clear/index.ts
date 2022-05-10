import {
    attr,
    customElement,
    FASTElement,
    html,
    observable,
    repeat,
} from "@microsoft/fast-element";
import { data, RandomItem } from "../../../utils/index.js";
import { queryParams } from "../../../utils/query-params.js";

const { method } = queryParams;

console.log("method", method);
@customElement({
    name: "x-app",
    template: html<XApp>`
        <div>
            <button @click="${x => x.appendData()}">Append</button>
            <span>Total Items: ${x => x.items.length}</span>
            ${repeat(
                x => x.items,
                html<RandomItem>`
                    <li>${x => x.label}</li>
                `
            )}
        </div>
    `,
})
class XApp extends FASTElement {
    @observable items: RandomItem[] = data;

    appendData() {
        // clear 10k data
        this.items = [];
    }
}
