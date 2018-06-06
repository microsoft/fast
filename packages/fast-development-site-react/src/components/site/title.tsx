import * as React from "react";
import manageJSS, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { IDevSiteDesignSystem } from "../design-system";


export interface ISiteTitleProps {
    slot?: string;
}

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
}

class SiteTitle extends React.Component<ISiteTitleProps, {}> {
    public render(): JSX.Element {
        return (
            <React.Fragment>
                {this.props.children}
            </React.Fragment>
        );
    }
}

class SiteTitleBranded extends React.Component<IManagedClasses<ISiteTitleBrandedManagedClasses>, {}> {
    public render(): JSX.Element {
        return (
            <span className={this.props.managedClasses.titleBranded}>
                {this.props.children}
            </span>
        );
    }
}

const SiteTitleBrand: React.ComponentType = manageJSS(titleBrandStyle)(SiteTitleBranded);

export default SiteTitle;
export { SiteTitleBrand };
