import { DesignSystem } from "@microsoft/fast-jss-manager-react";

/* tslint:disable-next-line */
export interface ExplorerDesignSystem {
    backgroundColor: string;
    foregroundColor: string;
    accentColor: string;
    direction: string;
}

export const creatorDesignSystem: DesignSystem<ExplorerDesignSystem> = {
    backgroundColor: "#1A1A1A",
    foregroundColor: "#F2F2F2",
    accentColor: "#FB356D",
    direction: "ltr",
};
