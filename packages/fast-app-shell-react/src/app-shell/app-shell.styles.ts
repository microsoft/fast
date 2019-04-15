import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import { ComponentStyleSheet } from "@microsoft/fast-jss-manager-react";

export interface AppShellClassNamesContract {
    appShell: string;
    appShell_navigationPane: string;
}

export const styles: ComponentStyleSheet<AppShellClassNamesContract, DesignSystem> = {
    appShell: {},
    appShell_navigationPane: {},
};
