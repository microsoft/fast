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

export interface IComponentWrapperProps {
    active: boolean;
    index: number;
    onClick: (activeIndex: number) => void;
}

const baseStyle: ICSSRules<IDevSiteDesignSystem> = {
    display: "flex",
    flexWrap: "wrap",
    margin: toPx(24),
    borderTop: `${toPx(1)} solid rgb(226, 226, 226)`,
    borderLeft: `${toPx(1)} solid rgb(226, 226, 226)`
};

const styles: ComponentStyles<IComponentWrapperManagedClasses, IDevSiteDesignSystem> = {
    componentWrapper: baseStyle,
    componentWrapper__active: {
        ...baseStyle,
        position: "relative",
        "&::before": {
            content: "''",
            position: "absolute",
            background: (config: IDevSiteDesignSystem): string => {
                return config.brandColor;
            },
            width: toPx(2),
            height: "100%"
        }
    }
};

class ComponentWrapper extends React.Component<IComponentWrapperProps & IManagedClasses<IComponentWrapperManagedClasses>, {}> {
    public render(): JSX.Element {
        return (
            <div className={this.getClassNames()} onClick={this.handleClick}>
                {this.props.children}
            </div>
        );
    }

    private getClassNames(): string {
        return this.props.active
            ? this.props.managedClasses.componentWrapper__active
            : this.props.managedClasses.componentWrapper;
    }

    private handleClick = (): void => {
        this.props.onClick(this.props.index);
    }
}

export default manageJss(styles)(ComponentWrapper);
