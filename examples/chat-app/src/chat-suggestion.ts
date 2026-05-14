import type { FASTElementTemplateResolver } from "@microsoft/fast-element";
import { attr } from "@microsoft/fast-element/attr.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";

export class ChatSuggestion extends FASTElement {
    @attr
    public text?: string;

    public emitSuggestion(): void {
        this.$emit("use-suggestion", this.text ?? "");
    }
}

export const chatSuggestionDefinition = {
    name: "chat-suggestion",
    template: declarativeTemplate() as unknown as FASTElementTemplateResolver<
        typeof ChatSuggestion
    >,
};
