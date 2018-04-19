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

export interface ITocItemManagedClasses {
    toc__item: string;
    toc__item_active: string;
}

export enum itemType {
    tocMenu = "tocMenu",
    link = "link"
}

const style: ComponentStyles<ITocItemManagedClasses, IDevSiteDesignSystem> = {
    toc__item: {
        padding: "6px 12px",
        display: "block"
    },
    toc__item_active: {
        background: "lightgray"
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
            <Link to={this.props.to}>
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
        const classNames: string = this.props.managedClasses.toc__item;

        if (this.props.active && this.props.to) {
            return `${classNames} ${this.props.managedClasses.toc__item_active}`;
        }

        return classNames;
    }
}

export default manageJss(style)(TocItem);
