import Caption from "./caption";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { CaptionStyles, IDesignSystem } from "@microsoft/fast-components-styles-msft";

export default manageJss(CaptionStyles)(Caption);
export * from "./caption";
