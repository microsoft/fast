import * as React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import manageJss, { ComponentStyles, DesignSystemProvider, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { glyphBuildingblocks, glyphGlobalnavbutton } from "@microsoft/fast-glyphs-msft";
import uuid from "uuid/v1";
import devSiteDesignSystemDefaults, { IDevSiteDesignSystem } from "../design-system";
import Shell, { ShellActionBar, ShellCanvas, ShellHeader, ShellInfoBar, ShellPane, ShellPaneCollapse, ShellRow } from "../shell";
import Toc, { TocItem } from "../toc";
import CategoryList from "./category-list";
import SiteMenu from "./menu";
import SiteMenuItem from "./menu-item";
import SiteCategory from "./category";
import SiteCategoryIcon from "./category-icon";
import SiteCategoryItem from "./category-item";
import NotFound from "./not-found";

export interface ISiteProps {
    title: string;
    collapsed?: boolean;
}

export interface IComponentRoutes {
    route: string;
    component: JSX.Element[];
}

export interface ISiteState {
    tocCollapsed: boolean;
    routes: IComponentRoutes[];
}

export interface ISiteManagedClasses {
    site__pane__button: string;
    site__pane__button__icon: string;
}

const styles: ComponentStyles<ISiteManagedClasses, IDevSiteDesignSystem> = {
    site__pane__button: {
        width: "32px",
        height: "32px",
        padding: "0"
    },
    site__pane__button__icon: {
        display: "inline-block",
        width: "32px",
        height: "32px"
    }
};

class Site extends React.Component<ISiteProps & IManagedClasses<ISiteManagedClasses>, ISiteState> {

    constructor(props: ISiteProps & IManagedClasses<ISiteManagedClasses>) {
        super(props);

        this.state = {
            tocCollapsed: this.props.collapsed || false,
            routes: this.getRoutes((this.props.children as JSX.Element), "/", "category")
        };
    }

    public render(): JSX.Element {
        return (
            <DesignSystemProvider designSystem={devSiteDesignSystemDefaults}>
                <BrowserRouter>
                    <Switch>
                        {this.renderShell(0, "/", null)}
                        {this.renderRoutes()}
                        <Route path="*" component={NotFound} />
                    </Switch>
                </BrowserRouter>
            </DesignSystemProvider>
        );
    }

    private renderRoutes(): JSX.Element[] {
        return this.state.routes.map((route: IComponentRoutes, index: number) => {
            return this.renderShell(index + 1, route.route, route.component);
        });
    }

    private renderShell(key: number, path: string, CanvasComponent: any): JSX.Element {
        return (
            <Route key={key} exact={true} path={path}>
                <Shell>
                    {this.renderShellHeader()}
                    {this.renderShellRow(CanvasComponent, path)}
                    {this.renderShellInfoBar()}
                </Shell>
            </Route>
        );
    }

    private renderShellHeader(): JSX.Element {
        return (
            <ShellHeader>
                {this.getSlotItems(this, "header")}
                {this.props.title}
            </ShellHeader>
        );
    }

    private renderShellRow(CanvasComponent: any, path: string): JSX.Element {
        return (
            <ShellRow>
                <ShellPane collapsed={this.state.tocCollapsed}>
                    {this.getPaneCollapseToggle()}
                    {this.getSlotItems(this, "pane")}
                    {this.getRootToc(this.props.children, "category", path, "/")}
                </ShellPane>
                <ShellCanvas>
                    <ShellActionBar>
                        {this.getSlotItems(this, "action-bar")}
                    </ShellActionBar>
                    {this.getSlotItems(this, "canvas")}
                    {CanvasComponent}
                </ShellCanvas>
            </ShellRow>
        );
    }

    private renderShellInfoBar(): JSX.Element {
        return (
            <ShellInfoBar>
                {this.getSlotItems(this, "info-bar")}
            </ShellInfoBar>
        );
    }

    /**
     * Gets all of the potential routes as strings to be used to build the shell
     */
    private getRoutes(items: JSX.Element, baseRoute: string, slot: string, routes?: IComponentRoutes[]): IComponentRoutes[] {
        let currentRoutes: IComponentRoutes[] = routes;
        const childItems: JSX.Element[] = Array.isArray(items) ? items : [items];

        childItems.forEach((item: JSX.Element): void => {
            if (item && item.props && item.props.slot === slot) {
                currentRoutes = this.getCurrentRoute(item, slot, baseRoute, currentRoutes || []);
            }
        });

        return currentRoutes;
    }

    private getCurrentRoute(item: JSX.Element, slot: string, baseRoute: string, currentRoutes: IComponentRoutes[]): IComponentRoutes[] {
        const currentRoute: IComponentRoutes[] = currentRoutes;
        const itemRoute: string = `${baseRoute}${item.props.name}/`;
        const slotItems: JSX.Element[] = this.getSlotItems(item, "canvas");

        if (slotItems && slotItems.length > 0) {
            currentRoute.push({
                route: this.convertToHyphenated(itemRoute),
                component: slotItems
            });
        }

        if (item.props.children) {
            return this.getRoutes(item.props.children, itemRoute, slot, currentRoute);
        }

        return currentRoute;
    }

    private handlePaneCollapse = (): void => {
        this.setState({
            tocCollapsed: !this.state.tocCollapsed
        });
    }

    private getSlotItems(component: any, slot: string): JSX.Element[] {
        return React.Children.map(component.props.children, (child: JSX.Element, index: number) => {
            if (child.props && child.props.slot === slot) {
                return child;
            }
        });
    }

    private getPaneCollapseToggle(): JSX.Element {
        return (
            <button
                onClick={this.handlePaneCollapse}
                className={this.props.managedClasses.site__pane__button}
                dangerouslySetInnerHTML={{__html: glyphGlobalnavbutton}}
            />
        );
    }

    private getRootToc(items: any, slot: string, currentPath: string, itemsPath: string): JSX.Element {
        return (
            <React.Fragment>
                {this.props && this.props.children ? this.getToc(items, slot, currentPath, itemsPath, this.state.tocCollapsed) : null}
            </React.Fragment>
        );
    }

    private getToc(
        items: any,
        slot: string,
        currentPath: string,
        itemsPath: string,
        collapsed?: boolean
    ): JSX.Element | JSX.Element[] {
        const categoryItems: JSX.Element[] = [];
        const rootTocItems: JSX.Element[] = [];
        const tocItems: any[] = Array.isArray(items) ? items : [items];

        tocItems.forEach((item: JSX.Element) => {
            if (item.props.slot === slot && ((collapsed && this.getTocItemCategoryIcon(item)) || !collapsed)) {
                categoryItems.push(item);
            }
        });

        categoryItems.forEach((categoryItem: JSX.Element, index: number) => {
            rootTocItems.push(this.getTocItem(index, itemsPath, categoryItem, categoryItem, currentPath, slot));
        });

        return rootTocItems;
    }

    private getTocItem(
        index: number,
        itemsPath: string,
        items: JSX.Element,
        child: JSX.Element,
        currentPath: string,
        slot: string
    ): JSX.Element {
        const tocItemPath: string = this.convertToHyphenated(`${itemsPath}${items.props.name}/`);
        const contentId: string = uuid();
        const active: boolean = currentPath.match(tocItemPath) !== null;
        const attributes: any = {
            key: index,
            active,
            heading: child && child.props ? !Boolean(child.props.children) : false,
            to: void(0),
            controls: contentId
        };

        if (this.hasCanvasContent(items)) {
            attributes.to = tocItemPath;
        }

        if (child && child.props && child.props.name) {
            return (
                <TocItem {...attributes}>
                    <React.Fragment>{this.getTocItemCategory(child.props.name, this.getTocItemCategoryIcon(child))}</React.Fragment>
                    {this.getTocItemMenu(child, slot, currentPath, tocItemPath)}
                </TocItem>
            );
        }

        return null;
    }

    private getTocItemMenu(item: JSX.Element, slot: string, currentPath: string, tocItemPath: string): JSX.Element {
        if (
            item.props.children &&
            (!item.props.children.props || (item.props.children.props && item.props.children.props.slot !== "category-icon"))
        ) {
            return <React.Fragment>{this.getToc(item.props.children, slot, currentPath, tocItemPath)}</React.Fragment>;
        }

        return null;
    }

    private getTocItemCategory(name: string | any, icon?: JSX.Element): JSX.Element {
        if (this.state.tocCollapsed) {
            return icon ? <span className={this.props.managedClasses.site__pane__button__icon}>{icon}</span> : null;
        }

        return (
            <React.Fragment>
                {icon ? <span className={this.props.managedClasses.site__pane__button__icon}>{icon}</span> : null} {name}
            </React.Fragment>
        );
    }

    private getTocItemCategoryIcon(item: JSX.Element): JSX.Element {
        if (Array.isArray(item.props.children)) {
            item.props.children.forEach((childElement: JSX.Element) => {
                if (childElement.props.slot === "category-icon") {
                    return childElement;
                }
            });
        } else {
            if (item.props.children.props.slot === "category-icon") {
                return item;
            }
        }

        return null;
    }

    private hasCanvasContent(item: JSX.Element): boolean {
        let hasCanvasContent: boolean = false;
        const slot: string = "canvas";

        if (item.props.children) {
            if (Array.isArray(item.props.children)) {
                item.props.children.forEach((child: JSX.Element) => {
                    hasCanvasContent = child.props.slot === slot;
                });
            } else {
                hasCanvasContent = item.props.children.props && item.props.children.props.slot === slot;
            }
        }

        return hasCanvasContent;
    }

    private convertToHyphenated(name: string): string {
        return name.toLowerCase().replace(/\s/g, "-");
    }
}

export default manageJss(styles)(Site);
export { SiteMenu, SiteMenuItem, SiteCategory, SiteCategoryIcon, SiteCategoryItem };
