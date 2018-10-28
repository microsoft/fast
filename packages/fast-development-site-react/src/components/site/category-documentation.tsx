import * as React from "react";
import manageJss, {
    ComponentStyles,
    DesignSystemProvider,
    ManagedClasses,
    ManagedJSSProps,
} from "@microsoft/fast-jss-manager-react";
import { toPx } from "@microsoft/fast-jss-utilities";
import { DevSiteDesignSystem } from "../design-system";

export interface CategoryDocumentationProps {
    slot: string;
}

export interface CategoryDocumentationManagedClasses {
    documentationPanel: string;
}

const style: ComponentStyles<CategoryDocumentationManagedClasses, DevSiteDesignSystem> = {
    documentationPanel: {
        maxWidth: toPx(1000),
    },
};

/* tslint:disable-next-line */
class CategoryDocumentation extends React.Component<
    CategoryDocumentationProps & ManagedClasses<CategoryDocumentationManagedClasses>,
    {}
> {
    public render(): JSX.Element {
        if (this.props.children !== undefined) {
            return (
                <div className={this.props.managedClasses.documentationPanel}>
                    {this.props.children}
                </div>
            );
        } else {
            return (
                <div className={this.props.managedClasses.documentationPanel}>
                    <div style={{ padding: "14px" }}>
                        <p>No documentation provided.</p>
                    </div>
                </div>
            );
        }
    }
}
export default manageJss(style)(CategoryDocumentation);
