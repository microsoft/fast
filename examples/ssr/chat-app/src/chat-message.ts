import { attr } from "@microsoft/fast-element/attr.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { observerMap } from "@microsoft/fast-element/observer-map.js";

export class ChatMessage extends FASTElement {
    @attr
    public kind?: string;
}

FASTElement.define(
    ChatMessage,
    {
        name: "chat-message",
        template: declarativeTemplate(),
    },
    [observerMap()],
);
