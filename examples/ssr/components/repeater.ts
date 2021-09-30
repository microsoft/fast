/*eslint-disable*/
import {
    customElement,
    FASTElement,
    html,
    observable,
    repeat,
} from "@microsoft/fast-element";

@customElement({
    name: "fast-repeater",
    template: html<Repeater>`
        <ol>
            ${repeat(
                x => x.data,
                html`
                    <li>${x => x}</li>
                `
            )}
        </ol>
    `,
})
export class Repeater extends FASTElement {
    @observable
    data: string[] = ["A", "B", "C", "D"];
}
