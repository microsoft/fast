import { attr, FASTElement } from "@microsoft/fast-element";

export class ChatCard extends FASTElement {
    @attr
    public heading?: string;
}

ChatCard.define({
    name: "chat-card",
    templateOptions: "defer-and-hydrate",
});
