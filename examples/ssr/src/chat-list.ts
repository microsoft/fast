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
    ${repeat(
        x => x.chatProvider.messages,
        html<ChatMessage>`
            <chat-bubble
                author="${message => message.author}"
                :content="${message => message.content}"
            ></chat-bubble>
        `
    )}
    <form @submit="${(x, c) => x.chatProvider.add({ author: "self", content: [""] })}">
        <input
            type="text"
            :value="${bind(x => x.message, twoWay({ changeEvent: "input" }))}"
        />
        <button type="submit" ?disabled=${x => !x.message}>Send</button>
    </form>
`;
const styles = css``;

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
