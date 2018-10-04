import * as React from "react";
import manageJss, { ComponentStyles, DesignSystemProvider, IManagedJSSProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { toPx } from "@microsoft/fast-jss-utilities";
import { IDevSiteDesignSystem } from "../design-system";

export interface ICategoryDocumentationProps {
    slot: string;
}

export interface ICategoryDocumentationManagedClasses {
    documentationPanel: string;
}

const style: ComponentStyles<ICategoryDocumentationManagedClasses, IDevSiteDesignSystem> = {
    documentationPanel: {
        maxWidth: toPx(1000)
    }
};

/* tslint:disable-next-line */
class CategoryDocumentation extends React.Component<ICategoryDocumentationProps & IManagedClasses<ICategoryDocumentationManagedClasses>, {}> {

    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.documentationPanel}>
                {this.props.children}
            </div>
        );
    }
}
export default manageJss(style)(CategoryDocumentation);
