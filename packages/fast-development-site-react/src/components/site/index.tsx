import Toc, { TocItem } from "../toc";
import * as React from "react";
import manageJss, { ComponentStyles, DesignSystemProvider, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { glyphBuildingblocks, glyphGlobalnavbutton } from "@microsoft/fast-glyphs-msft";
import { uniqueId } from "lodash-es";
import devSiteDesignSystemDefaults, { IDevSiteDesignSystem } from "../design-system";
import Shell, { ShellActionBar, ShellCanvas, ShellHeader, ShellInfoBar, ShellPane, ShellPaneCollapse, ShellRow, ShellSlot } from "../shell";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import * as history from "history";
import { ellipsis, toPx } from "@microsoft/fast-jss-utilities";
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

export interface IComponentRoute {
    route: string;
    component: JSX.Element[];
}

export interface ISiteState {
    tableOfContentsCollapsed: boolean;
    componentView: ComponentView;
}

export enum SiteSlot {
    category = "category",
    categoryIcon = "category-icon"
}

/**
 * Describes the possible views for a component
 */
export enum ComponentView {
    examples,
    detail
}

export interface ISiteManagedClasses {
    site_headerTitle: string;
    site_paneToc: string;
    site_paneTocRow: string;
    site_paneTocTitle: string;
    site_paneToggleButton: string;
    site_paneToggleButtonIcon: string;
    site_paneToggleButtonIconLayout: string;
}

const styles: ComponentStyles<ISiteManagedClasses, IDevSiteDesignSystem> = {
    site_headerTitle: {
        verticalAlign: "middle"
    },
    site_paneToc: {
        padding: "0"
    },
    site_paneTocRow: {
        display: "flex",
        flexWrap: "nowrap",
        alignItems: "center",
    },
    site_paneTocTitle: {
        fontWeight: "bold",
        marginLeft: toPx(-8),
        textOverflow: ellipsis().textOverflow,
        whiteSpace: "nowrap",
        overflow: "hidden"
    },
    site_paneToggleButton: {
        border: "none",
        background: "none",
        padding: toPx(12),
        outline: "0"
    },
    site_paneToggleButtonIcon: {
        height: toPx(16),
        width: toPx(16),
        justifyContent: "center",
        fontSize: toPx(16),
        display: "inline-block"
    },
    site_paneToggleButtonIconLayout: {
        height: toPx(40),
        width: toPx(40),
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
            componentView: ComponentView.detail
        };
    }

    public render(): JSX.Element {
        return (
            <DesignSystemProvider designSystem={devSiteDesignSystemDefaults}>
                <BrowserRouter>
                    <Shell>
                        {this.renderShellHeader()}
                        <Switch>
                            <Route exact={true} path={"/"} component={this.renderShellRow.bind(this, null, "/")} />
                            {this.renderRoutes()}
                            <Route path="*" component={NotFound} />
                        </Switch>
                        {this.renderShellInfoBar()}
                    </Shell>
                </BrowserRouter>
            </DesignSystemProvider>
        );
    }

    public componentDidMount(): void {
        // If the path we load the site in doesn't match component view, update state
        // to match the path
        if (this.getComponentViewByLocation() !== this.state.componentView) {
            this.setState({
                componentView: this.getComponentViewByLocation()
            });
        }
    }

    /**
     * Determine if we're looking at the examples path of a component
     */
    private getComponentViewByLocation(): ComponentView {
        return window
            && window.location
            && new RegExp(`${ComponentView[ComponentView.examples]}/?$`).test(window.location.pathname)
            ? ComponentView.examples
            : ComponentView.detail;
    }

    private renderRoutes(): JSX.Element[] {
        return this.getRoutes((this.props.children as JSX.Element), "/", SiteSlot.category)
            .map(this.renderComponentRoute);
    }

    /**
     * Renders a route based on the active component
     */
    private renderComponentRoute = (route: IComponentRoute): JSX.Element => {
        const path: string = route.route;

        return (
            <Route
                key={path}
                path={path}
                component={this.renderShellRow.bind(this, route)}
            />
        );
    }

    private renderShellHeader(): JSX.Element {
        return (
            <ShellHeader>
                {this.getSlotItems(this, ShellSlot.header)}
                <span className={this.props.managedClasses.site_headerTitle}>
                    {this.props.title}
                </span>
            </ShellHeader>
        );
    }

    private renderShellRow(route: IComponentRoute): JSX.Element {
        return (
            <ShellRow>
                <ShellPane collapsed={this.state.tableOfContentsCollapsed}>
                    {this.getPaneCollapseToggle()}
                    {this.getSlotItems(this, ShellSlot.pane)}
                    <ul className={this.props.managedClasses.site_paneToc}>
                        {this.getRootToc(this.props.children, SiteSlot.category, route.route, "/")}
                    </ul>
                </ShellPane>
                <ShellCanvas
                    componentView={this.state.componentView}
                >
                    {this.getSlotItems(this, ShellSlot.canvas)}
                    {route.component}
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
    private getRoutes(items: JSX.Element, baseRoute: string, slot: SiteSlot, routes?: IComponentRoute[]): IComponentRoute[] {
        let currentRoutes: IComponentRoute[] = routes;
        const childItems: JSX.Element[] = Array.isArray(items) ? items : [items];

        childItems.forEach((item: JSX.Element): void => {
            if (item && item.props && item.props.slot === slot) {
                currentRoutes = this.getCurrentRoute(item, slot, baseRoute, currentRoutes || []);
            }
        });

        return currentRoutes;
    }

    private getCurrentRoute(item: JSX.Element, slot: SiteSlot, baseRoute: string, currentRoutes: IComponentRoute[]): IComponentRoute[] {
        const currentRoute: IComponentRoute[] = currentRoutes;
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
    /* tslint:disable:max-line-length */
    private getPaneCollapseToggle(): JSX.Element {
        return (
            <button
                onClick={this.handlePaneCollapse}
                className={this.props.managedClasses.site_paneToggleButton}
            >
                <span className={this.props.managedClasses.site_paneToggleButtonIcon} dangerouslySetInnerHTML={{__html: glyphGlobalnavbutton}}/>
            </button>
        );
    }
    /* tslint:enable:max-line-length */

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

    /**
     * Adjust URL of TocItem based on the current component-view
     */
    private formatTocItemPathWithComponentView(path: string): string {
        return this.state.componentView === ComponentView.examples
            ? `${path}${ComponentView[ComponentView.examples]}/`
            : path;
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
            attributes.to = this.formatTocItemPathWithComponentView(tocItemPath);
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

    /* tslint:disable:max-line-length */
    private getTocItemCategory(name: string | any, icon?: JSX.Element): JSX.Element {
        const renderLayout: JSX.Element = icon ? <div className={this.props.managedClasses.site_paneToggleButtonIconLayout}><span className={this.props.managedClasses.site_paneToggleButtonIcon}>{icon}</span></div> : null;

        if (this.state.tableOfContentsCollapsed) {
            return renderLayout;
        }

        return (
            <div className={this.props.managedClasses.site_paneTocRow}>
                {renderLayout}
                <div className={icon ? this.props.managedClasses.site_paneTocTitle : null}>{name}</div>
            </div>
        );
    }
    /* tslint:enable:max-line-length */

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
