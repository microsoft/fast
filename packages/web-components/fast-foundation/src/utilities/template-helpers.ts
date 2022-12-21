import { DangerousHTMLDirective } from "@microsoft/fast-element";
import type { SyntheticViewTemplate } from "@microsoft/fast-element";

/**
 * A function to compose template options
 */
export function staticallyComposeOption(
    item: DangerousHTMLDirective | SyntheticViewTemplate | undefined
) {
    if (!item) {
        item = new DangerousHTMLDirective("");
    }

    if (item instanceof DangerousHTMLDirective) {
        return item;
    }

    return item.inline();
}
