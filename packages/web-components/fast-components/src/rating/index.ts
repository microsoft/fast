import { Rating, ratingTemplate as template } from "@microsoft/fast-foundation";
import { ratingStyles as styles } from "./rating.styles";

/**
 * A function that returns a {@link @microsoft/fast-foundation#Rating} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#ratingTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: <fast-rating>
 */
export const fastRating = Rating.compose({
    baseName: "rating",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
});

/**
 * Base class for Rating
 * @public
 */
export { Rating };
