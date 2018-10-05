import * as React from "react";
import manageJSS, { ComponentStyles, ManagedClasses, ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DevSiteDesignSystem } from "../design-system";

export interface SiteTitleBrandedManagedClasses {
    titleBranded: string;
}

/* tslint:disable-next-line */
export interface SiteTItleBrandedProps {}

const titleBrandStyle: ComponentStyles<SiteTitleBrandedManagedClasses, {}> = {
    titleBranded: {
        fontWeight: "bold",
        color: (config: DevSiteDesignSystem): string => {
            return config.brandColor;
        }
    }
};

class SiteTitleBranded extends React.Component<SiteTItleBrandedProps & ManagedClasses<SiteTitleBrandedManagedClasses>, {}> {
    public render(): JSX.Element {
        return (
            <span className={this.props.managedClasses.titleBranded}>
                {this.props.children}
            </span>
        );
    }
}

export default manageJSS(titleBrandStyle)(SiteTitleBranded);
