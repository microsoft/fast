import * as React from "react";
import manageJss, {
    ComponentStyles,
    DesignSystemProvider,
    ManagedClasses,
    ManagedJSSProps,
} from "@microsoft/fast-jss-manager-react";
import { toPx } from "@microsoft/fast-jss-utilities";
import devSiteDesignSystemDefaults, { DevSiteDesignSystem } from "../design-system";

export interface CategoryDocumentationProps {
    slot: string;
}

export interface CategoryDocumentationManagedClasses {
    documentationPanel: string;
}

const style: ComponentStyles<CategoryDocumentationManagedClasses, DevSiteDesignSystem> = {
    documentationPanel: {
        maxWidth: "1000px",
        padding: "14px",
        "& a": {
            color: (config: DevSiteDesignSystem): string => {
                return config.brandColor || devSiteDesignSystemDefaults.brandColor;
            },
        },
    },
};

/* tslint:disable-next-line */
class CategoryDocumentation extends React.Component<
    CategoryDocumentationProps & ManagedClasses<CategoryDocumentationManagedClasses>,
    {}
> {
    public render(): JSX.Element {
        return (
            <div className={this.props.managedClasses.documentationPanel}>
                {this.props.children}
            </div>
        );
    }
}
export default manageJss(style)(CategoryDocumentation);
