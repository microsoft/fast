import { ColorRecipe } from "@microsoft/fast-components-styles-msft/dist/utilities/color/common";

export interface LogoProps {
    /**
     * The class name to add
     */
    className?: string;

    /**
     * The background color
     */
    backgroundColor?: ColorRecipe<string>;

    /**
     * The version
     */
    version?: string;

    /**
     * The logo location
     */
    logo: string;

    /**
     * The title
     */
    title?: string;
}
