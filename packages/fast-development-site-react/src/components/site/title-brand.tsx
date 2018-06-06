import * as React from "react";
import manageJSS, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { IDevSiteDesignSystem } from "../design-system";

export interface ISiteTitleBrandedManagedClasses {
    titleBranded: string;
}

const titleBrandStyle: ComponentStyles<ISiteTitleBrandedManagedClasses, {}> = {
    titleBranded: {
        fontWeight: "bold",
        color: (config: IDevSiteDesignSystem): string => {
            return config.brandColor;
        }
    }
};

class SiteTitleBranded extends React.Component<IManagedClasses<ISiteTitleBrandedManagedClasses>, {}> {
    public render(): JSX.Element {
        return (
            <span className={this.props.managedClasses.titleBranded}>
                {this.props.children}
            </span>
        );
    }
}

export default manageJSS(titleBrandStyle)(SiteTitleBranded);
