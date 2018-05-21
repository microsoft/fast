import * as React from "react";
import { Link } from "react-router-dom";
import TocMenu from "./toc-menu";
import { IDevSiteDesignSystem } from "../design-system";
import { toPx } from "@microsoft/fast-jss-utilities";
import manageJss, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";

export interface ITocItemProps {
    to?: string;
    controls?: string;
    onToggleExpand?: () => void;
    onClick?: () => void;
    heading: boolean;
    active: boolean;
}

export enum itemType {
    a = "a",
    tocMenu = "tocMenu",
    link = "link"
}

export interface ITocItemManagedClasses {
    tocItem_anchor: string;
    tocItem: string;
    tocItem__active: string;
}

const tocItemActivePipeHeight: number = 20;

const style: ComponentStyles<ITocItemManagedClasses, IDevSiteDesignSystem> = {
    tocItem_anchor: {
        color: (config: IDevSiteDesignSystem): string => {
            return config.foregroundColor;
        },
        textDecoration: "none",
        display: "block",
        paddingLeft: toPx(48),
        lineHeight: toPx(40),
        outline: "0"
    },
    tocItem: {
        display: "block",
        position: "relative",
        color: (config: IDevSiteDesignSystem): string => {
            return config.foregroundColor;
        },
    },
    tocItem__active: {
        background: (config: IDevSiteDesignSystem): string => {
            return config.backgroundColor;
        },
        color: (config: IDevSiteDesignSystem): string => {
            return config.foregroundColor;
        },
        boxShadow: `0 ${toPx(2)} ${toPx(4)} ${toPx(-1)} #ccc`,
        "&::before": {
            content: "''",
            width: toPx(2),
            height: toPx(tocItemActivePipeHeight),
            borderRadius: toPx(2),
            display: "block",
            background: (config: IDevSiteDesignSystem): string => {
                return config.brandColor;
            },
            position: "absolute",
            left: "0",
            top: `calc((100% / 2) - ${toPx(tocItemActivePipeHeight / 2)})`
        }
    }
};

class TocItem extends React.Component<ITocItemProps & IManagedClasses<ITocItemManagedClasses>, {}> {

    public render(): JSX.Element {
        const type: itemType = this.getType();

        return (
            <li className={this.getClassNames()}>
                {this.renderType(type)}
            </li>
        );
    }

    private renderLink(): JSX.Element {
        return (
            <Link to={this.props.to} className={this.props.managedClasses.tocItem_anchor} onClick={this.props.onClick}>
                {this.props.children}
            </Link>
        );
    }

    private renderTocMenu(): JSX.Element {
        if (this.props.children[1]) {
            return (
                <TocMenu controls={this.props.controls} active={this.props.active}>
                    {this.props.children[0]}
                    {this.props.children[1]}
                </TocMenu>
            );
        }

        return <React.Fragment>{this.props.children}</React.Fragment>;
    }

    private renderType(type: itemType): JSX.Element {
        switch (type) {
            case itemType.link:
                return this.renderLink();
            case itemType.tocMenu:
                return this.renderTocMenu();
        }

        return null;
    }

    private getType(): itemType {
        return this.props.to
            ? itemType.link
            : itemType.tocMenu;
    }

    private handleButtonClick = (): void => {
        if (this.props.onToggleExpand) {
            this.props.onToggleExpand();
        }
    }

    private getClassNames(): string {
        const classNames: string = this.props.managedClasses.tocItem;

        if (this.props.active && this.props.to) {
            return `${classNames} ${this.props.managedClasses.tocItem__active}`;
        }

        return classNames;
    }
}

export default manageJss(style)(TocItem);
