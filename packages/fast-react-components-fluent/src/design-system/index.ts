import breakpoints, { IBreakpoints
} from "./breakpoints";
import { fontWeight, IFontWeight } from "./fonts";
import {
    caption,
    heading,
    paragraph,
    subheading,
    typeRamp,
    ICaption,
    IHeading,
    IParagraph,
    ISubheading,
    ITypeRamp,
    ITypeRampItem,
    ITypeRampItemConfig,
    ITypographyItem,
    ITypographyItemConfig,
    typographyItemConfig
} from "./typography";

export interface IDesignSystem {
    foregroundColor: string;
    backgroundColor: string;
    brandColor: string;
}

const designSystemDefaults: IDesignSystem = {
    foregroundColor: "#000",
    backgroundColor: "#FFF",
    brandColor: "#0078D4"
};

export {
    breakpoints,
    caption,
    fontWeight,
    heading,
    paragraph,
    subheading,
    typeRamp,
    ICaption,
    IBreakpoints,
    IFontWeight,
    IHeading,
    IParagraph,
    ISubheading,
    ITypeRamp,
    ITypeRampItem,
    ITypeRampItemConfig,
    ITypographyItem,
    ITypographyItemConfig,
    typographyItemConfig
};
export default designSystemDefaults;
