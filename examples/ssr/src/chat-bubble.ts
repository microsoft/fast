import {
    attr,
    css,
    customElement,
    FASTElement,
    html,
    observable,
    repeat,
} from "@microsoft/fast-element";
import { ChatMessage } from "./chat-provider.js";

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
        padding: 18px;
        border-radius: 12px;
        margin: 18px 0;
    }

    :host(:not([author="self"])) {
        background: #e5e5e5;
        color: #181818;
        margin-inline-end: 24px;
    }

    :host([author="self"]) {
        background: #0078d4;
        color: #ffffff;
        margin-inline-start: 24px;
    }

    p {
        margin: 0;
    }
`;

@customElement({
    name: "chat-bubble",
    template,
    styles,
})
export class ChatBubble extends FASTElement implements ChatMessage {
    @attr
    author: "self" | string = "self";

    @observable
    content: string[] = [];
}
