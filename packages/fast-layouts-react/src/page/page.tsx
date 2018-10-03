import * as React from "react";
import manageJss, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { IPageHandledProps, PageProps } from "./page.props";
import Foundation, { HandledProps, IFoundationProps } from "@microsoft/fast-components-foundation-react";

export interface IPageClassNamesContract {
    page?: string;
}

const styles: ComponentStyles<IPageClassNamesContract, undefined> = {
    "@global": {
        "html, body": {
            padding: 0,
            margin: 0
        }
    },
    page: {
        display: "grid"
    }
};

class Page extends Foundation<
    PageProps,
    React.HTMLAttributes<HTMLDivElement>,
    undefined
> {
    public static defaultProps: Partial<IPageHandledProps> = {
        margin: "minmax(5vw, 1fr)",
        maxWidth: "1600px"
    };

    protected handledProps: HandledProps<PageProps> = {
        managedClasses: void 0,
        margin: void 0,
        maxWidth: void 0
    };

    /**
     * Renders the Page markup
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div {...this.generateAttributes()}>
                {this.props.children}
            </div>
        );
    }

    private generateAttributes(): React.HTMLAttributes<HTMLDivElement> {
        const attributes: React.HTMLAttributes<HTMLDivElement> = Object.assign({}, this.unhandledProps(), {
            className: super.generateClassNames(this.props.managedClasses.page)
        });
        const columns: string = `${this.props.margin} minmax(0, ${this.props.maxWidth}) ${this.props.margin}`;

        if (!attributes.style) {
            attributes.style = {};
        }

        attributes.style = {
            gridTemplateColumns: columns,
            msGridColumns: columns
        };

        return attributes;
    }
}

export default manageJss(styles)(Page);
