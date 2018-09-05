import { IHypertextClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * The class name contract for the call to action component
 */
export interface ICallToActionClassNameContract extends IHypertextClassNameContract {
    callToAction_primary: string;
    callToAction_secondary: string;
    callToAction_lightweight: string;
    callToAction_span: string;
    "@keyframes cta-glyph-move-out": string;
    "@keyframes cta-glyph-move-in": string;
    "@keyframes cta-text-move-in": string;
    "@keyframes cta-text-move-out": string;
}
