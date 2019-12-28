import { DeclarationReflection } from "typedoc";
import { type } from "typedoc-plugin-markdown/dist/resources/helpers/type";

export function memberType(this: DeclarationReflection): string {
    const md: string[] = [];

    if (this.type) {
        md.push(type.call(this.type));
    }
    if (this.defaultValue) {
        md.push(`= ${this.defaultValue}`);
    }

    return md.join(" ");
}
