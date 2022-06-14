import {
    attr,
    css,
    customElement,
    FASTElement,
    html,
    observable,
    repeat,
} from "@microsoft/fast-element";

const template = html<ChatBubble>`
    ${repeat(
        x => x.content,
        html`
            <p>${x => x}</p>
        `
    )}
`;
const styles = css`
    :host {
        display: block;
        padding: 24px;
        border-radius: 12px;
        margin: 24px 0;
    }

    :host([author]) {
        background: green;
        color: #ffffff;
        margin-inline-end: 24px;
    }

    :host([author="self"]) {
        background: #0078d4;
        color: #ffffff;
        margin-inline-start: 24px;
    }
`;

@customElement({
    name: "chat-bubble",
    template,
    styles,
})
export class ChatBubble extends FASTElement {
    @attr
    author: "self" | string = "self";

    @observable
    content: string[] = [];
}
