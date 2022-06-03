import {
    customElement,
    FASTElement,
    html,
    observable,
    repeat,
} from "@microsoft/fast-element";
import { data, RandomItem } from "../../../utils/index.js";
import { queryParams } from "../../../utils/query-params.js";

const { method } = queryParams;

@customElement({
    name: "x-app",
    template: html<XApp>`
        <div>
            <button @click="${x => x.appendData()}">Append</button>
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
        // append 10k data 10 times
        switch (method) {
            case "push-apply":
                // eslint-disable-next-line prefer-spread
                this.items.push.apply(this.items, data);
                break;
            case "push-spread":
                this.items.push(...data);
                break;
            case "concat":
                this.items = this.items.concat(data);
                break;
            case "spread":
                this.items = [...this.items, ...data];
                break;
            case "splice":
                this.items.splice(this.items.length, 0, ...data);
                break;
            case "unshift":
                data.unshift(...this.items);
                this.items = data;
                break;
        }
    }
}
