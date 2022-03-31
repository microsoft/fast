import { attr, DOM } from "@microsoft/fast-element";
import {
    Search as FoundationSearch,
    searchTemplate as template,
} from "@microsoft/fast-foundation";
import { Swatch } from "../color/swatch";
import { fillColor, neutralFillRecipe } from "../design-tokens";
import { searchStyles as styles } from "./search.styles";

/**
 * Search appearances
 * @public
 */
export type SearchAppearance = "filled" | "outline";

/**
 * @internal
 */
export class Search extends FoundationSearch {
    /**
     * The appearance of the element.
     *
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    @attr
    public appearance: SearchAppearance = "outline";
}

/**
 * A function that returns a {@link @microsoft/fast-foundation#Search} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#searchTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-search\>
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus | delegatesFocus}
 */
export const fastSearch = Search.compose({
    baseName: "search",
    baseClass: FoundationSearch,
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
});

/**
 * Styles for Search
 * @public
 */
export const searchStyles = styles;
