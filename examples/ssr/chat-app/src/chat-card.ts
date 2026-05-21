import { attr, FASTElement } from "@microsoft/fast-element";
import { RenderableFASTElement } from "@microsoft/fast-html";

export class ChatCard extends RenderableFASTElement(FASTElement) {
    @attr
    public heading?: string;
}
