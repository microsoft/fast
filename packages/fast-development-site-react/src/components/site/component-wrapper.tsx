import * as React from "react";
import manageJss, {
    ComponentStyles,
    DesignSystemProvider,
    ICSSRules,
    IJSSManagerProps,
    IManagedClasses
} from "@microsoft/fast-jss-manager-react";
import { toPx } from "@microsoft/fast-jss-utilities";
import devSiteDesignSystemDefaults, { IDevSiteDesignSystem } from "../design-system";

export interface IComponentWrapperManagedClasses {
    componentWrapper: string;
    componentWrapper__active: string;
}

export interface IComponentWrapperProps<T> {
    active: boolean;
    index: number;
    designSystem: T;
    onClick: (activeIndex: number) => void;
}

const componentWrapperBorder: string = `${toPx(1)} solid rgb(226, 226, 226)`;
const styles: ComponentStyles<IComponentWrapperManagedClasses, IDevSiteDesignSystem> = {
    componentWrapper: {
        display: "block",
        padding: toPx(24),
        borderBottom: componentWrapperBorder,
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
                    {this.props.children}
                </DesignSystemProvider>
            );
        }

        return (
            <React.Fragment>
                {this.props.children}
            </React.Fragment>
        );
    }

    private getClassNames(): string {
        return this.props.active
            ? `${this.props.managedClasses.componentWrapper} ${this.props.managedClasses.componentWrapper__active}`
            : this.props.managedClasses.componentWrapper;
    }

    private handleClick = (): void => {
        this.props.onClick(this.props.index);
    }
}

export default manageJss(styles)(ComponentWrapper);
