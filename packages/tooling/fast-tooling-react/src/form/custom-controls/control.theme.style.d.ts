import { ComponentStyles } from "@microsoft/fast-jss-manager-react";
/**
 * Base64 encoded svgs
 */
export declare const lightTheme: string;
export declare const darkTheme: string;
/**
 * ThemeControl class name contract
 */
export interface ThemeControlClassNameContract {
    themeControl?: string;
    themeControl__disabled?: string;
    themeControl_input?: string;
    themeControl_input__light?: string;
    themeControl_input__dark?: string;
}
declare const styles: ComponentStyles<ThemeControlClassNameContract, {}>;
export default styles;
