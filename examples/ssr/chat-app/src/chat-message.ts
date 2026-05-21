import type { FASTElementTemplateResolver } from "@microsoft/fast-element";
import { attr } from "@microsoft/fast-element/attr.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";

export class ChatMessage extends FASTElement {
    @attr
    public kind?: string;
}

export const chatMessageDefinition = {
    name: "chat-message",
    template: declarativeTemplate() as unknown as FASTElementTemplateResolver<
        typeof ChatMessage
    >,
};
