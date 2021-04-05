import { StandardLuminance } from "@microsoft/fast-components";

export interface ThemeSelectorProps {
    className?: string;
    id: string;
    theme: StandardLuminance;
    onUpdateTheme: any;
    disabled: boolean;
}
