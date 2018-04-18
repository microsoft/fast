import * as React from "react";
import { Link } from "react-router-dom";
import TocMenu from "./toc-menu";
import { IDevSiteDesignSystem } from "../design-system";
import manageJss, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";

export interface ITocItemProps {
    to?: string;
    controls?: string;
    onToggleExpand?: () => void;
    heading: boolean;
    active: boolean;
}

export enum itemType {
    a = "a",
    tocMenu = "tocMenu",
    link = "link"
}

export interface ITocItemManagedClasses {
    toc_anchor: string;
    toc_item: string;
    toc_item_active: string;
}

const tocItemActivePipeHeight: number = 20;

const style: ComponentStyles<ITocItemManagedClasses, IDevSiteDesignSystem> = {
    toc_anchor: {
        color: (config: IDevSiteDesignSystem): string => {
            return config.foregroundColor;
        },
        textDecoration: "none",
        display: "block",
        textIndent: "48px",
        lineHeight: "40px",
        outline: "0"
    },
    toc_item: {
        display: "block",
        position: "relative",
        color: (config: IDevSiteDesignSystem): string => {
            return config.foregroundColor;
        },
    },
    toc_item_active: {
        background: (config: IDevSiteDesignSystem): string => {
            return config.backgroundColor;
        },
        color: (config: IDevSiteDesignSystem): string => {
            return config.foregroundColor;
        },
        boxShadow: "0px 2px 4px -1px #ccc;",
        "&::before": {
            content: "''",
            width: "2px",
            height: `${tocItemActivePipeHeight}px`,
            borderRadius: "2px",
            display: "block",
            background: (config: IDevSiteDesignSystem): string => {
                return config.brandColor;
            },
            position: "absolute",
            left: "0",
            top: `calc((100% / 2) - ${tocItemActivePipeHeight / 2}px)`
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
            <Link to={this.props.to} className={this.props.managedClasses.toc_anchor}>
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
        const classNames: string = this.props.managedClasses.toc_item;

        if (this.props.active && this.props.to) {
            return `${classNames} ${this.props.managedClasses.toc_item_active}`;
        }

        return classNames;
    }
}

export default manageJss(style)(TocItem);
