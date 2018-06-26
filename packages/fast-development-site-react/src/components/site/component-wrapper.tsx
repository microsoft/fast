import * as React from "react";
import manageJss, {
    ComponentStyles,
    DesignSystemProvider,
    ICSSRules,
    IJSSManagerProps,
    IManagedClasses
} from "@microsoft/fast-jss-manager-react";
import { ErrorBoundary, IErrorBoundaryProps } from "../../utilities";
import { glyphBuildingblocks } from "@microsoft/fast-glyphs-msft";
import { toPx } from "@microsoft/fast-jss-utilities";
import devSiteDesignSystemDefaults, { IDevSiteDesignSystem } from "../design-system";
import { ComponentViewTypes } from "./component-view";

export interface IComponentWrapperManagedClasses {
    componentWrapper: string;
    componentWrapper__Transparent: string;
    componentWrapperExamples: string;
    componentWrapper__active: string;
}

export interface IComponentWrapperProps<T> {
    active: boolean;
    index: number;
    singleRow?: boolean;
    designSystem: T;
    view: ComponentViewTypes;
    transparent: boolean;
    onClick?: (activeIndex: number) => void;
}

const componentWrapperBorder: string = `${toPx(1)} solid rgb(204, 204, 204)`;
const styles: ComponentStyles<IComponentWrapperManagedClasses, IDevSiteDesignSystem> = {
    componentWrapper: {
        display: "block",
        padding: toPx(24),
        borderBottom: componentWrapperBorder,
    },
    componentWrapper__Transparent: {
        display: "block",
        padding: toPx(24),
        background: "red",
        // backgroundImage: `url('data:image/svg+xml;${glyphBuildingblocks}')`,
        // backgroundRepeat: "repeat",
        borderBottom: componentWrapperBorder,
    },
    componentWrapperExamples: {
        "&:last-child:not(:nth-child(3n + 3)), &:nth-child(3n + 1)": {
            borderRight: componentWrapperBorder,
        },
        "&:nth-child(3n + 3)": {
            borderLeft: componentWrapperBorder
        },
    },
    componentWrapper__active: {
        position: "relative",
        "&::before": {
            content: "''",
            position: "absolute",
            height: "0",
            width: "0",
            transform: "rotate(-45deg)",
            bottom: toPx(-10),
            left: toPx(-10),
            border: `${toPx(10)} solid transparent`,
            opacity: ".5",
            borderRight: (config: IDevSiteDesignSystem): string => {
                return `${toPx(10)} solid ${config.brandColor}`;
            },
        }
    }
};

/* tslint:disable-next-line */
class ComponentWrapper extends React.Component<IComponentWrapperProps<IDevSiteDesignSystem> & IManagedClasses<IComponentWrapperManagedClasses>, {}> {
    public render(): JSX.Element {
        return (
            <div className={this.getClassNames()} onClick={this.handleClick}>
                {this.renderChildren()}
            </div>
        );
    }

    private renderChildren(): JSX.Element {
        if (this.props.designSystem) {
            return (
                <DesignSystemProvider designSystem={this.props.designSystem}>
                    <ErrorBoundary>
                        {this.props.children}
                    </ErrorBoundary>
                </DesignSystemProvider>
            );
        }

        return (
            <React.Fragment>
                <ErrorBoundary>
                    {this.props.children}
                </ErrorBoundary>
            </React.Fragment>
        );
    }

    private getClassNames(): string {
        const classNames: string = this.props.transparent ? this.props.managedClasses.componentWrapper__Transparent : this.props.managedClasses.componentWrapper;

        return this.props.active && this.props.view === ComponentViewTypes.examples
            ? `${classNames} ${this.props.managedClasses.componentWrapperExamples} ${this.props.managedClasses.componentWrapper__active}`
            : this.props.view === ComponentViewTypes.detail
            ? `${classNames} ${this.props.managedClasses.componentWrapper__active}`
            : classNames;
    }

    private handleClick = (): void => {
        if (this.props.onClick) {
            this.props.onClick(this.props.index);
        }
    }
}

export default manageJss(styles)(ComponentWrapper);
