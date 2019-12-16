import { DeclarationReflection } from "typedoc";

export function memberComment(this: DeclarationReflection) {
    return this.comment && this.comment.shortText ? this.comment.shortText : "";
}
