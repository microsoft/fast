import Toc, { TocItem } from "../toc";
import * as React from "react";
import manageJss, { ComponentStyles, DesignSystemProvider, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { glyphBuildingblocks, glyphGlobalnavbutton } from "@microsoft/fast-glyphs-msft";
import { uniqueId } from "lodash-es";
import devSiteDesignSystemDefaults, { IDevSiteDesignSystem } from "../design-system";
import Shell, { ShellActionBar, ShellCanvas, ShellHeader, ShellInfoBar, ShellPane, ShellPaneCollapse, ShellRow, ShellSlot } from "../shell";
import { BrowserRouter, Route, Switch } from "react-router-dom";
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
    tableOfContentsCollapsed: boolean;
    routes: IComponentRoutes[];
}

export enum SiteSlot {
    category = "category",
    categoryIcon = "category-icon"
}

export interface ISiteManagedClasses {
    site__headerTitle: string;
    site__paneToc: string;
    site__paneTocRow: string;
    site__paneTocTitle: string;
    site__paneToggleButton: string;
    site__paneToggleButtonIcon: string;
    site__paneToggleButtonIconLayout: string;
}

const styles: ComponentStyles<ISiteManagedClasses, IDevSiteDesignSystem> = {
    site__headerTitle: {
        verticalAlign: "middle"
    },
    site__paneToc: {
        padding: "0"
    },
    site__paneTocRow: {
        display: "flex",
        flexWrap: "nowrap",
        alignItems: "center",
    },
    site__paneTocTitle: {
        fontWeight: "bold",
        marginLeft: "-8px",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden"
    },
    site__paneToggleButton: {
        border: "none",
        background: "none",
        padding: "12px",
        outline: "0"
    },
    site__paneToggleButtonIcon: {
        height: "16px",
        width: "16px",
        justifyContent: "center",
        fontSize: "16px"
    },
    site__paneToggleButtonIconLayout: {
        height: "40px",
        width: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }
};

class Site extends React.Component<ISiteProps & IManagedClasses<ISiteManagedClasses>, ISiteState> {

    constructor(props: ISiteProps & IManagedClasses<ISiteManagedClasses>) {
        super(props);

        this.state = {
            tableOfContentsCollapsed: this.props.collapsed || false,
            routes: this.getRoutes((this.props.children as JSX.Element), "/", SiteSlot.category)
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
                {this.getSlotItems(this, ShellSlot.header)}
                <span className={this.props.managedClasses.site__headerTitle}>
                    {this.props.title}
                </span>
            </ShellHeader>
        );
    }

    private renderShellRow(CanvasComponent: any, path: string): JSX.Element {
        return (
            <ShellRow>
                <ShellPane collapsed={this.state.tableOfContentsCollapsed}>
                    {this.getPaneCollapseToggle()}
                    {this.getSlotItems(this, ShellSlot.pane)}
                    <ul className={this.props.managedClasses.site__paneToc}>
                        {this.getRootToc(this.props.children, SiteSlot.category, path, "/")}
                    </ul>
                </ShellPane>
                <ShellCanvas>
                    <ShellActionBar>
                        {this.getSlotItems(this, ShellSlot.actionBar)}
                    </ShellActionBar>
                    {this.getSlotItems(this, ShellSlot.canvas)}
                    {CanvasComponent}
                </ShellCanvas>
            </ShellRow>
        );
    }

    private renderShellInfoBar(): JSX.Element {
        return (
            <ShellInfoBar>
                {this.getSlotItems(this, ShellSlot.infoBar)}
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
        const slotItems: JSX.Element[] = this.getSlotItems(item, ShellSlot.canvas);

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
            tableOfContentsCollapsed: !this.state.tableOfContentsCollapsed
        });
    }

    private getSlotItems(component: any, slot: string): JSX.Element[] {
        return React.Children.map(component.props.children, (child: JSX.Element, index: number) => {
            if (child.props && child.props.slot === slot) {
                return child;
            }
        });
    }
    /* tslint:disable */
    private getPaneCollapseToggle(): JSX.Element {
        return (
            <button
                onClick={this.handlePaneCollapse}
                className={this.props.managedClasses.site__paneToggleButton}
            >
                <div className={this.props.managedClasses.site__paneToggleButtonIcon} dangerouslySetInnerHTML={{__html: glyphGlobalnavbutton}}/>
            </button>
        );
    }
    /* tslint:enable */

    private getRootToc(items: any, slot: string, currentPath: string, itemsPath: string): JSX.Element {
        if (this.props && this.props.children) {
            return (this.getToc(items, slot, currentPath, itemsPath, this.state.tableOfContentsCollapsed) as JSX.Element);
        }
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
        const contentId: string = uniqueId(this.convertToHyphenated(items.props.name));
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
                    {this.getTocItemCategory(child.props.name, this.getTocItemCategoryIcon(child))}
                    {this.getTocItemMenu(child, slot, currentPath, tocItemPath)}
                </TocItem>
            );
        }

        return null;
    }

    private getTocItemMenu(item: JSX.Element, slot: string, currentPath: string, tocItemPath: string): JSX.Element {
        if (
            item.props.children &&
            (!item.props.children.props || (item.props.children.props && item.props.children.props.slot !== SiteSlot.categoryIcon))
        ) {
            return (this.getToc(item.props.children, slot, currentPath, tocItemPath) as JSX.Element);
        }

        return null;
    }

    /* tslint:disable */
    private getTocItemCategory(name: string | any, icon?: JSX.Element): JSX.Element {
        if (this.state.tableOfContentsCollapsed) {
            return icon ? <span className={this.props.managedClasses.site__paneToggleButtonIconLayout}><div className={this.props.managedClasses.site__paneToggleButtonIcon}>{icon}</div></span> : null;
        }

        return (
            <span className={this.props.managedClasses.site__paneTocRow}>
                {icon ? <span className={this.props.managedClasses.site__paneToggleButtonIconLayout}><div className={this.props.managedClasses.site__paneToggleButtonIcon}>{icon}</div></span> : null}
                <div className={icon ? this.props.managedClasses.site__paneTocTitle : null}>{name}</div>
            </span>
        );
    }
    /* tslint:enable */

    private getTocItemCategoryIcon(item: JSX.Element): JSX.Element {
        if (Array.isArray(item.props.children)) {
            item.props.children.forEach((childElement: JSX.Element) => {
                if (childElement.props.slot === SiteSlot.categoryIcon) {
                    return childElement;
                }
            });
        } else {
            if (item.props.children.props.slot === SiteSlot.categoryIcon) {
                return item;
            }
        }

        return null;
    }

    private hasCanvasContent(item: JSX.Element): boolean {
        let hasCanvasContent: boolean = false;
        const slot: string = ShellSlot.canvas;

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
