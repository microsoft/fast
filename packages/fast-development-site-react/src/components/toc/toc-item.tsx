import * as React from "react";
import { Link } from "react-router-dom";
import TocMenu from "./toc-menu";
import devSiteDesignSystemDefaults, { DevSiteDesignSystem } from "../design-system";
import { toPx } from "@microsoft/fast-jss-utilities";
import manageJss, { ComponentStyles, ManagedClasses, ManagedJSSProps } from "@microsoft/fast-jss-manager-react";

export interface TocItemProps {
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

export interface TocItemManagedClasses {
    tocItem_anchor: string;
    tocItem: string;
    tocItem__active: string;
}

const tocItemActivePipeHeight: number = 20;

const style: ComponentStyles<TocItemManagedClasses, DevSiteDesignSystem> = {
    tocItem_anchor: {
        color: (config: DevSiteDesignSystem): string => {
            return config.foregroundColor;
        },
        textDecoration: "none",
        display: "block",
        paddingLeft: toPx(48),
        lineHeight: toPx(38),
        border: `${toPx(1)} solid transparent`,
        outline: "0",
        "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)"
        },
        "&:focus": {
            border: (config: DevSiteDesignSystem): string => {
                return `${toPx(1)} solid ${config.brandColor || devSiteDesignSystemDefaults.brandColor}`;
            }
        }
    },
    tocItem: {
        display: "block",
        position: "relative",
        color: (config: DevSiteDesignSystem): string => {
            return config.foregroundColor;
        }
    },
    tocItem__active: {
        background: (config: DevSiteDesignSystem): string => {
            return config.backgroundColor;
        },
        color: (config: DevSiteDesignSystem): string => {
            return config.foregroundColor;
        },
        boxShadow: `${toPx(-2)} ${toPx(2)} ${toPx(4)} rgba(0, 0, 0, 0.06)`,
        "&::before": {
            content: "''",
            width: toPx(2),
            height: toPx(tocItemActivePipeHeight),
            borderRadius: toPx(2),
            display: "block",
            background: (config: DevSiteDesignSystem): string => {
                return config.brandColor;
            },
            position: "absolute",
            left: "0",
            top: `calc((100% / 2) - ${toPx(tocItemActivePipeHeight / 2)})`
        },
        "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.1)"
        },
    }
};

class TocItem extends React.Component<TocItemProps & ManagedClasses<TocItemManagedClasses>, {}> {

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
