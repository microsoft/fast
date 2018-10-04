import * as React from "react";
import manageJss, {
    ComponentStyles,
    DesignSystemProvider,
    ICSSRules,
    ManagedJSSProps,
    IManagedClasses
} from "@microsoft/fast-jss-manager-react";
import { ErrorBoundary, IErrorBoundaryProps } from "../../utilities";
import { toPx } from "@microsoft/fast-jss-utilities";
import { Direction } from "@microsoft/fast-application-utilities";
import devSiteDesignSystemDefaults, { IDevSiteDesignSystem } from "../design-system";
import { ComponentViewTypes } from "./component-view";

export interface IComponentWrapperManagedClasses {
    componentWrapper: string;
    componentWrapper__transparent: string;
    componentWrapperExamples: string;
    componentWrapper__active: string;
}

export interface IComponentWrapperProps<T> {
    active: boolean;
    index: number;
    singleRow?: boolean;
    designSystem: T;
    view: ComponentViewTypes;
    dir?: string;
    transparentBackground?: boolean;
    onClick?: (activeIndex: number) => void;
    background?: string;
}

/* tslint:disable-next-line */
const checker: string = "url('data:image/gif;base64,R0lGODlhEAAQAPABANfX1////yH5BAAAAAAALAAAAAAQABAAAAIfhG+hq4jM3IFLJhoswNly/XkcBpIiVaInlLJr9FZWAQAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4KIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIvPgogPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAADs=')";

const componentWrapperBorder: string = `${toPx(1)} solid rgb(204, 204, 204)`;
const styles: ComponentStyles<IComponentWrapperManagedClasses, IDevSiteDesignSystem> = {
    componentWrapper: {
        display: "block",
        padding: toPx(24),
        borderBottom: componentWrapperBorder,
    },
    componentWrapper__transparent: {
        background: checker
    },
    componentWrapperExamples: {
        "&:nth-child(3n + 1), &:nth-child(3n + 2)": {
            borderRight: componentWrapperBorder,
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
            <div className={this.getClassNames()} onClick={this.handleClick} dir={this.props.dir || null} style={this.getInlineStyle()}>
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

    private getInlineStyle(): React.CSSProperties {
        if (!this.props.background) {
            return;
        }

        return this.props.transparentBackground ? null : {background: this.props.background};
    }

    private getClassNames(): string {
        let classNames: string = this.props.managedClasses.componentWrapper;

        classNames = this.props.transparentBackground
            ? `${this.props.managedClasses.componentWrapper__transparent} ${classNames}`
            : classNames;

        classNames = this.props.active
            ? `${classNames} ${this.props.managedClasses.componentWrapper__active}`
            : classNames;

        return this.props.view === ComponentViewTypes.examples
            ? `${classNames} ${this.props.managedClasses.componentWrapperExamples}`
            : classNames;
    }

    private handleClick = (): void => {
        if (this.props.onClick) {
            this.props.onClick(this.props.index);
        }
    }
}

export default manageJss(styles)(ComponentWrapper);
