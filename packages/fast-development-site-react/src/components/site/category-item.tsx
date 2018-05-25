import * as React from "react";
import manageJss, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import { toPx } from "@microsoft/fast-jss-utilities";
import { IDevSiteDesignSystem } from "../design-system";

export interface ISiteCategoryItemManagedClasses {
    siteCategoryItem: string;
}

export interface ISiteCategoryItemProps {
    slot?: string;
    categoryItemComponentMinWidth?: number;
    designSystem?: any;
    data: any;
    type?: string;
}

class SiteCategoryItem extends React.Component<ISiteCategoryItemProps, {}> {
    public render(): JSX.Element {
        return (
            <DesignSystemProvider designSystem={this.props.designSystem}>
                <div>
                    {this.props.children}
                </div>
            </DesignSystemProvider>
        );
    }
}

export default SiteCategoryItem;
