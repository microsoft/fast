/*eslint-disable*/
import { FASTElement, html, observable, repeat } from "@microsoft/fast-element";

export class Repeater extends FASTElement {
    @observable
    data: string[] = ["A", "B", "C", "D"];
}

FASTElement.define(Repeater, {
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
});
