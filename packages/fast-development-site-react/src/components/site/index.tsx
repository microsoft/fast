import Toc, { TocItem } from "../toc";
import * as React from "react";
import manageJss, { ComponentStyles, DesignSystemProvider, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { glyphBuildingblocks, glyphGlobalnavbutton } from "@microsoft/fast-glyphs-msft";
import Form from "@microsoft/fast-form-generator-react";
import { uniqueId } from "lodash-es";
import devSiteDesignSystemDefaults, { IDevSiteDesignSystem } from "../design-system";
import Shell, { ShellActionBar, ShellCanvas, ShellHeader, ShellInfoBar, ShellPane, ShellPaneCollapse, ShellRow, ShellSlot } from "../shell";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ellipsis, toPx } from "@microsoft/fast-jss-utilities";
import ComponentWrapper from "./component-wrapper";
import CategoryList from "./category-list";
import SiteMenu from "./menu";
import SiteMenuItem from "./menu-item";
import SiteCategory from "./category";
import SiteCategoryIcon from "./category-icon";
import SiteCategoryItem from "./category-item";
import ActionBar from "./action-bar";
import DevTools, { frameworkEnum } from "./dev-tools";
import NotFound from "./not-found";
import ComponentView, { ComponentViewTypes } from "./component-view";

export interface ISiteProps {
    title: string;
    formChildOptions: IFormChildOption[];
    frameworks?: frameworkEnum | frameworkEnum[];
    activeFramework?: frameworkEnum;
    collapsed?: boolean;
}

export interface IFormChildOption {
    component: any;
    schema: JSON;
    name: string;
}

export interface IComponentRoute {
    route: string;
    schema: any;
    componentMapping: any;
    component: JSX.Element[];
}

export interface IComponentData {
    [T: string]: any[];
}

export interface ISiteState {
    currentPath: string;
    activeComponentIndex: number;
    componentName: string;
    componentData: IComponentData;
    tableOfContentsCollapsed: boolean;
    componentView: ComponentViewTypes;
    formView: boolean;
    devToolsView: boolean;
}

export enum SiteSlot {
    category = "category",
    categoryIcon = "category-icon"
}

export interface ISiteManagedClasses {
    site_canvasContent: string;
    site_headerTitle: string;
    site_paneToc: string;
    site_paneTocRow: string;
    site_paneTocTitle: string;
    site_paneToggleButton: string;
    site_paneToggleButtonIcon: string;
    site_paneToggleButtonIconLayout: string;
}

const styles: ComponentStyles<ISiteManagedClasses, IDevSiteDesignSystem> = {
    site_canvasContent: {
        height: `calc(100% - ${toPx(40)})`,
        display: "flex",
        flexDirection: "column"
    },
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
            currentPath: this.getCurrentPath(),
            activeComponentIndex: 0,
            tableOfContentsCollapsed: this.props.collapsed || false,
            componentView: ComponentViewTypes.examples,
            componentName: this.getComponentName(),
            componentData: this.getComponentData(),
            formView: true,
            devToolsView: false
        };
    }

    public render(): JSX.Element {
        return (
            <DesignSystemProvider designSystem={devSiteDesignSystemDefaults}>
                <BrowserRouter>
                    <Shell>
                        {this.renderShellHeader()}
                        <Switch>
                            <Route
                                exact={true}
                                path={"/"}
                            >
                                {this.renderShellRow({component: null, route: "/"} as IComponentRoute)}
                            </Route>
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
        if (this.getComponentViewTypesByLocation() !== this.state.componentView) {
            this.setState({
                componentView: this.getComponentViewTypesByLocation()
            });
        }
    }

    /**
     * Gets the component data for each of the routes
     */
    private getComponentData(): IComponentData {
        const componentData: IComponentData = {};

        this.getRoutes((this.props.children as JSX.Element), "/", SiteSlot.category).forEach((route: IComponentRoute) => {
            componentData[route.route] = [];
            route.component.forEach((routeChild: JSX.Element, index: number) => {
                componentData[route.route][index] = routeChild.props.data;
            });
        });

        return componentData;
    }

    private getComponentName = (currentPath?: string): string => {
        const matchedPath: RegExpMatchArray = currentPath
            ? currentPath.match(/([a-z\d\-]+)(\/*)$/i)
            : this.getCurrentPath().match(/([a-z\d\-]+)(\/*)$/i);
        let componentName: string = matchedPath !== null && matchedPath[1] ? matchedPath[1] : "";
        componentName = componentName.charAt(0).toUpperCase() + componentName.slice(1, componentName.length);
        componentName = componentName.replace(/-([a-z])/g, (match: string) => {
            return match[1].toUpperCase();
        });

        return componentName;
    }

    /**
     * Determine if the view is to the examples or detail of a component
     */
    private getComponentViewTypesByLocation(): ComponentViewTypes {
        return window
            && window.location
            && new RegExp(`${ComponentViewTypes[ComponentViewTypes.examples]}/?$`).test(window.location.pathname)
            ? ComponentViewTypes.examples
            : ComponentViewTypes.detail;
    }

    private renderRoutes(): JSX.Element[] {
        return this.getRoutes((this.props.children as JSX.Element), "/", SiteSlot.category)
            .map(this.renderComponentRoute);
    }

    /**
     * Renders a route based on the active component
     */
    private renderComponentRoute = (route: IComponentRoute | null): JSX.Element | null => {
        const path: string = route.route;

        return (
            <Route
                key={path}
                path={path}
            >
                {this.renderShellRow(route)}
            </Route>
        );
    }

    private renderShellHeader(): JSX.Element {
        return (
            <ShellHeader>
                {this.renderChildrenBySlot(this, ShellSlot.header)}
                <span className={this.props.managedClasses.site_headerTitle}>
                    {this.props.title}
                </span>
            </ShellHeader>
        );
    }

    private renderShellRow(route: IComponentRoute): JSX.Element {
        return (
            <ShellRow key={route.route}>
                <ShellPane collapsed={this.state.tableOfContentsCollapsed}>
                    {this.renderPaneCollapseToggle()}
                    {this.renderChildrenBySlot(this, ShellSlot.pane)}
                    <ul className={this.props.managedClasses.site_paneToc}>
                        {this.renderRootToc(this.props.children, SiteSlot.category, route.route, "/")}
                    </ul>
                </ShellPane>
                <ShellCanvas>
                    <ShellActionBar>
                        <ActionBar
                            onComponentViewChange={this.onComponentViewChange}
                            onFormToggle={this.onFormToggle}
                            onDevToolsToggle={this.onDevToolsToggle}
                            componentView={this.state.componentView}
                            formView={this.state.formView}
                            devToolsView={this.state.devToolsView}
                        />
                    </ShellActionBar>
                    <div className={this.props.managedClasses.site_canvasContent}>
                        <ComponentView>
                            {this.renderChildrenBySlot(this, ShellSlot.canvas)}
                            {this.renderComponentByRoute(route)}
                        </ComponentView>
                        {this.renderDevTools()}
                    </div>
                </ShellCanvas>
                <ShellPane hidden={!this.state.formView}>
                    {this.generateForm(route.component, route.schema, route.route)}
                </ShellPane>
            </ShellRow>
        );
    }

    private renderDevTools(): JSX.Element {
        if (this.state.devToolsView) {
            return (
                <DevTools
                    activeFramework={this.props.activeFramework}
                    activeComponentName={this.state.componentName}
                    activeFormData={this.state.componentData[this.state.currentPath][this.state.activeComponentIndex]}
                    childOptions={this.props.formChildOptions}
                    frameworks={Array.isArray(this.props.frameworks) ? this.props.frameworks : [this.props.frameworks]}
                    onToggleView={this.handleToggleDevToolsView}
                />
            );
        }
    }

    private handleComponentDataChange = (data: any): void => {
        const currentPath: string = this.getCurrentPath();
        const componentData: IComponentData = Object.assign({}, this.state.componentData);
        componentData[currentPath][this.state.activeComponentIndex] = data;

        this.setState({
            componentData,
            currentPath
        });
    }

    private handleToggleDevToolsView = (): void => {
        this.setState({
            devToolsView: !this.state.devToolsView
        });
    }

    private getCurrentPath = (): string => {
        return this.getComponentViewTypesByLocation() === ComponentViewTypes.detail
            ? window.location.pathname
            : window.location.pathname.slice(0, window.location.pathname.length - 9);
    }

    private generateForm(component: JSX.Element[], schema: any, route: string): JSX.Element {
        if (component && schema) {
            return (
                <Form
                    schema={schema}
                    data={Object.assign({}, this.state.componentData[route][this.state.activeComponentIndex])}
                    onChange={this.handleComponentDataChange.bind(route)}
                    childOptions={this.props.formChildOptions}
                />
            );
        }
    }

    private renderComponentByRoute(route: IComponentRoute): JSX.Element[] {
        if (route.component) {
            return route.component.map((componentItem: JSX.Element, index: number) => {
                if (route.componentMapping) {
                    return (
                        <ComponentWrapper
                            key={index}
                            onClick={this.handleComponentClick}
                            index={index}
                            designSystem={componentItem.props.designSystem}
                            active={index === this.state.activeComponentIndex}
                        >
                            <route.componentMapping {...this.state.componentData[route.route][index]} />
                        </ComponentWrapper>
                    );
                }
            });
        }
    }

    private handleComponentClick = (activeIndex: number): void => {
        this.setState({
            activeComponentIndex: activeIndex
        });
    }

    private onComponentViewChange = (type: ComponentViewTypes): void => {
        this.setState({
            componentView: type
        });
    }

    private onFormToggle = (): void => {
        this.setState({
            formView: !this.state.formView
        });
    }

    private onDevToolsToggle = (): void => {
        this.setState({
            devToolsView: !this.state.devToolsView
        });
    }

    private renderShellInfoBar(): JSX.Element {
        return (
            <ShellInfoBar>
                {this.renderChildrenBySlot(this, ShellSlot.infoBar)}
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
        const slotItems: JSX.Element[] = this.renderChildrenBySlot(item, ShellSlot.canvas);

        if (slotItems && slotItems.length > 0) {
            currentRoute.push({
                route: this.convertToHyphenated(itemRoute),
                component: slotItems,
                schema: item.props.schema,
                componentMapping: item.props.component
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

    private renderChildrenBySlot(component: any, slot: string): JSX.Element[] {
        return React.Children.map(component.props.children, (child: JSX.Element, index: number) => {
            if (child.props && child.props.slot === slot) {
                return child;
            }
        });
    }

    private renderPaneCollapseToggle(): JSX.Element {
        return (
            <button
                onClick={this.handlePaneCollapse}
                className={this.props.managedClasses.site_paneToggleButton}
            >
                <span
                    className={this.props.managedClasses.site_paneToggleButtonIcon}
                    dangerouslySetInnerHTML={{__html: glyphGlobalnavbutton}}
                />
            </button>
        );
    }

    private renderRootToc(items: any, slot: string, currentPath: string, itemsPath: string): JSX.Element {
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
            if (item.props.slot === slot && ((collapsed && this.renderTocItemCategoryIcon(item)) || !collapsed)) {
                categoryItems.push(item);
            }
        });

        categoryItems.forEach((categoryItem: JSX.Element, index: number) => {
            rootTocItems.push(this.renderTocItem(index, itemsPath, categoryItem, categoryItem, currentPath, slot));
        });

        return rootTocItems;
    }

    /**
     * Adjust URL of TocItem based on the current component-view
     */
    private formatTocItemPathWithComponentViewTypes(path: string): string {
        return this.state.componentView === ComponentViewTypes.examples
            ? `${path}${ComponentViewTypes[ComponentViewTypes.examples]}/`
            : path;
    }

    private renderTocItem(
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
            controls: contentId,
            onClick: (e: React.MouseEvent<HTMLButtonElement>): void => {
                this.setState({
                    activeComponentIndex: 0,
                    componentName: this.getComponentName(tocItemPath)
                });
            }
        };

        if (this.hasCanvasContent(items)) {
            attributes.to = this.formatTocItemPathWithComponentViewTypes(tocItemPath);
        }

        if (child && child.props && child.props.name) {
            return (
                <TocItem {...attributes}>
                    {this.renderTocItemCategory(child.props.name, this.renderTocItemCategoryIcon(child))}
                    {this.renderTocItemMenu(child, slot, currentPath, tocItemPath)}
                </TocItem>
            );
        }

        return null;
    }

    private renderTocItemMenu(item: JSX.Element, slot: string, currentPath: string, tocItemPath: string): JSX.Element {
        if (
            item.props.children &&
            (!item.props.children.props || (item.props.children.props && item.props.children.props.slot !== SiteSlot.categoryIcon))
        ) {
            return (this.getToc(item.props.children, slot, currentPath, tocItemPath) as JSX.Element);
        }

        return null;
    }

    private renderTocItemCategory(name: string | any, icon?: JSX.Element): JSX.Element {
        const renderLayout: JSX.Element = icon
            ? (
                <div className={this.props.managedClasses.site_paneToggleButtonIconLayout}>
                    <span className={this.props.managedClasses.site_paneToggleButtonIcon}>{icon}</span>
                </div>
            )
            : null;

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

    private renderTocItemCategoryIcon(item: JSX.Element): JSX.Element {
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
