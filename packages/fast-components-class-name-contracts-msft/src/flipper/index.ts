import { IButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * The class name contract for the flipper component
 */
export interface IFlipperClassNameContract extends IButtonClassNameContract {
    flipper_glyph: string;
    flipper_next: string;
    flipper_previous: string;
}
