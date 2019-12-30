import { DeclarationReflection } from "typedoc";

export function memberComment(this: DeclarationReflection): string {
    return (this.comment && this.comment.shortText ? this.comment.shortText : "").replace(
        /(\r\n|\n|\r)/gm,
        " "
    ); // Newlines are syntax in Markdown, so strip all newlines out
}
