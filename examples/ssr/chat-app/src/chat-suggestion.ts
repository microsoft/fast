import { attr } from "@microsoft/fast-element/attr.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { observerMap } from "@microsoft/fast-element/observer-map.js";

export class ChatSuggestion extends FASTElement {
    @attr
    public text?: string;

    public emitSuggestion(): void {
        this.$emit("use-suggestion", this.text ?? "");
    }
}

ChatSuggestion.define(
    {
        name: "chat-suggestion",
        template: declarativeTemplate(),
    },
    [observerMap()],
);
