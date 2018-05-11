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

const componentWrapperBorder = `${toPx(1)} solid rgb(226, 226, 226)`;
const styles: ComponentStyles<IComponentWrapperManagedClasses, IDevSiteDesignSystem> = {
    componentWrapper: {
        display: "block",
        padding: toPx(24),
        borderBottom: componentWrapperBorder,
        "&:nth-child(3n + 1)": {
            borderRight: componentWrapperBorder,
        },
        "&:nth-child(3n + 3)": {
            borderLeft: componentWrapperBorder
        },
        "&:last-child": {
            borderRight: componentWrapperBorder,
        }
    },
    componentWrapper__active: {
        position: "relative",
        "&::before": {
            content: "''",
            position: "absolute",
            top: toPx(0),
            bottom: toPx(0),
            left: toPx(0),
            background: (config: IDevSiteDesignSystem): string => {
                return config.brandColor;
            },
            width: toPx(2),
            height: "100%"
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
