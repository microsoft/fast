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

// tslint:disable-next-line
const activeItemPipe: string = "PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSIyMSIgdmlld0JveD0iMCAwIDQgMjEiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQo8dGl0bGU+QWN0aXZlIGl0ZW0gcGlwZTwvdGl0bGU+DQo8ZGVzYz5DcmVhdGVkIHVzaW5nIEZpZ21hPC9kZXNjPg0KPGcgaWQ9IkNhbnZhcyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDc0NiAxMTMxKSI+DQo8ZyBpZD0iQWN0aXZlIGl0ZW0gcGlwZSI+DQo8dXNlIHhsaW5rOmhyZWY9IiNwYXRoMF9maWxsIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDc0NiAtMTEzMSkiIGZpbGw9IiMwMDc4RDciLz4NCjwvZz4NCjwvZz4NCjxkZWZzPg0KPHBhdGggaWQ9InBhdGgwX2ZpbGwiIGQ9Ik0gNCAxOC44NTc1TCA0IDJDIDQgMC44OTU0MzEgMy4xMDQ1NyAwIDIgMEMgMC44OTU0MzEgMCAwIDAuODk1NDMxIDAgMkwgMCAxOC44NTc1QyAwIDE5Ljk2MjEgMC44OTU0MzEgMjAuODU3NSAyIDIwLjg1NzVDIDMuMTA0NTcgMjAuODU3NSA0IDE5Ljk2MjEgNCAxOC44NTc1WiIvPg0KPC9kZWZzPg0KPC9zdmc+DQo=";

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
            content: `url('data:image/svg+xml;base64,${activeItemPipe}')`,
            display: "block",
            position: "absolute",
            top: "9px"
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
