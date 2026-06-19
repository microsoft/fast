import { attr } from "@microsoft/fast-element/attr.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { observerMap } from "@microsoft/fast-element/observer-map.js";

export class ChatCard extends FASTElement {
    @attr
    public heading?: string;
}

ChatCard.define(
    {
        name: "chat-card",
        template: declarativeTemplate(),
    },
    [observerMap()],
);
