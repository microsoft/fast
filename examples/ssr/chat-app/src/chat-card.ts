import type { FASTElementTemplateResolver } from "@microsoft/fast-element";
import { attr } from "@microsoft/fast-element/attr.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";

export class ChatCard extends FASTElement {
    @attr
    public heading?: string;
}

export const chatCardDefinition = {
    name: "chat-card",
    template: declarativeTemplate() as unknown as FASTElementTemplateResolver<
        typeof ChatCard
    >,
};
