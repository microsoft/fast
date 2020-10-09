import { StandardLuminance } from "@microsoft/fast-components-styles-msft";

export interface ThemeSelectorProps {
    className?: string;
    id: string;
    theme: StandardLuminance;
    onUpdateTheme: any;
    disabled: boolean;
}
