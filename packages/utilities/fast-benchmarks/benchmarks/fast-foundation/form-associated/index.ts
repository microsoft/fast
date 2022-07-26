import {
    attr,
    customElement,
    FASTElement,
    html,
    observable,
    repeat,
} from "@microsoft/fast-element";
import { FormAssociated } from "@microsoft/fast-foundation";
import { data, RandomItem } from "../../../utils/index.js";

/* eslint-disable @typescript-eslint/naming-convention */
class _Button extends FASTElement {}
interface _Button extends FormAssociated {}
/* eslint-enable @typescript-eslint/naming-convention */

class FormAssociatedButton extends FormAssociated(_Button as any) {
    proxy = document.createElement("input");
}

class Button extends FormAssociatedButton {}
@customElement({
    name: "x-button",
    template: html`
        <button>${x => x.value}</button>
    `,
    styles: "",
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class FluentButton extends Button {
    @attr value: string = "";
}

const xAppTemplate = html<XApp>`
    <div>
        ${repeat(
            x => x.items,
            html`
                <x-button :value=${x => x.label}>${x => x.label}</x-button>
            `
        )}
    </div>
`;
@customElement({
    name: "x-app",
    template: xAppTemplate,
})
class XApp extends FASTElement {
    @observable items: RandomItem[] = data;
}
