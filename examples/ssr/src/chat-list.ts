import {
    bind,
    css,
    customElement,
    FASTElement,
    html,
    observable,
    repeat,
} from "@microsoft/fast-element";
import { twoWay } from "@microsoft/fast-element/binding/two-way";
import { ChatMessage, ChatProvider } from "./chat-provider.js";

const template = html<ChatList>`
    <div class="messages">
        ${repeat(
            x => x.chatProvider.messages,
            html<ChatMessage>`
                <chat-bubble
                    author="${message => message.author}"
                    :content="${message => message.content}"
                ></chat-bubble>
            `
        )}
    </div>
    <form @submit="${(x, c) => x.chatProvider.add({ author: "self", content: [""] })}">
        <input
            type="text"
            :value="${bind(x => x.message, twoWay({ changeEvent: "input" }))}"
        />
        <button type="submit" ?disabled=${x => !x.message}>Send</button>
    </form>
`;
const styles = css`
    :host {
        display: grid;
        grid-template-rows: 1fr auto;
        max-width: 580px;
        margin: 0 auto;
        overflow: hidden;
    }

    .messages {
        overflow: scroll;
    }

    form {
        padding: 12px 0;
        display: flex;
        height: 36px;
    }

    form input {
        flex-grow: 1;
        margin-inline-end: 12px;
    }
`;

@customElement({
    name: "chat-list",
    template,
    styles,
})
export class ChatList extends FASTElement {
    @ChatProvider
    chatProvider!: ChatProvider;

    @observable
    message: string = "";
}
