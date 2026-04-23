import { attr, FASTElement } from "@microsoft/fast-element";

export class ChatMessage extends FASTElement {
    @attr
    public kind?: string;
}

ChatMessage.define({
    name: "chat-message",
    templateOptions: "defer-and-hydrate",
});
