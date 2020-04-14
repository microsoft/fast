import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { canUseCssGrid, classNames } from "@microsoft/fast-web-utilities";
import { PageHandledProps, PageProps, PageUnhandledProps } from "./page.props";

export interface PageClassNamesContract {
    page?: string;
}

export class Page extends Foundation<PageHandledProps, PageUnhandledProps, {}> {
    public static displayName: string = "Page";

    public static defaultProps: Partial<PageProps> = {
        margin: "minmax(5vw, 1fr)",
        maxWidth: "1600px",
        managedClasses: {},
    };

    protected handledProps: HandledProps<PageHandledProps> = {
        managedClasses: void 0,
        margin: void 0,
        maxWidth: void 0,
        cssGridPropertyName: void 0,
    };

    /**
     * Renders the Page markup
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return <div {...this.generateAttributes()}>{this.props.children}</div>;
    }

    private generateAttributes(): React.HTMLAttributes<HTMLDivElement> {
        const columns: string = `${this.props.margin} minmax(0, ${this.props.maxWidth}) ${this.props.margin}`;

        const attributes: React.HTMLAttributes<HTMLDivElement> = {
            ...this.unhandledProps(),
            className: super.generateClassNames(
                classNames(this.props.managedClasses.page)
            ),
        };

        return {
            ...attributes,
            style: {
                display:
                    this.props.cssGridPropertyName === "grid"
                        ? "grid"
                        : this.props.cssGridPropertyName === "-ms-grid"
                        ? "-ms-grid"
                        : canUseCssGrid()
                        ? "grid"
                        : "-ms-grid",
                gridTemplateColumns: columns,
                msGridColumns: columns,
                // attributes.style has to be spread here again in order to
                // merge the styles attribute, otherwise it is just overriden
                ...attributes.style,
            },
        };
    }
}

export * from "./page.props";
