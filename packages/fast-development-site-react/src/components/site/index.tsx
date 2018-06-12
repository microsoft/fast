import Toc, { TocItem } from "../toc";
import * as React from "react";
import manageJss, { ComponentStyles, DesignSystemProvider, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { glyphBuildingblocks, glyphGlobalnavbutton } from "@microsoft/fast-glyphs-msft";
import Form from "@microsoft/fast-form-generator-react";
import { uniqueId } from "lodash-es";
import devSiteDesignSystemDefaults, { IDevSiteDesignSystem } from "../design-system";
import Shell, { ShellHeader, ShellInfoBar, ShellPaneCollapse, ShellSlot } from "../shell";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { ellipsis, localizeSpacing, toPx } from "@microsoft/fast-jss-utilities";
import ComponentWrapper from "./component-wrapper";
import CategoryList from "./category-list";
import SiteTitle from "./title";
import SiteTitleBrand from "./title-brand";
import SiteMenu from "./menu";
import SiteMenuItem from "./menu-item";
import SiteCategory from "./category";
import SiteCategoryDocumentation from "./category-documentation";
import SiteCategoryIcon from "./category-icon";
import SiteCategoryItem from "./category-item";
import ActionBar from "./action-bar";
import DevTools, { FrameworkEnum } from "./dev-tools";
import NotFound from "./not-found";
import ComponentView, { ComponentViewTypes } from "./component-view";
import {
    Canvas,
    Container,
    IContainerClassNamesContract,
    IPaneClassNamesContract,
    IPaneProps,
    Pane,
    PaneResizeDirection,
    Row
} from "@microsoft/fast-layouts-react";
import { Direction, isRTL } from "@microsoft/fast-application-utilities";

export enum ComponentViewSlot {
    example = "canvas-example-view",
    detailExample = "canvas-detail-view-example",
    detailDocumentation = "canvas-detail-view-documentation"
}

export interface ISiteProps {
    formChildOptions: IFormChildOption[];
    onUpdateDirection?: (ltr: Direction) => void;
    locales?: string[];
    frameworks?: FrameworkEnum | FrameworkEnum[];
    activeFramework?: FrameworkEnum;
    collapsed?: boolean;
}

export interface IFormChildOption {
    component: any;
    schema: any;
    name: string;
}

export interface IComponentRoute {
    route: string;
    schema: any;
    componentMapping: any;
    exampleView: JSX.Element[];
    detailView: JSX.Element[];
}

export interface IComponentData {
    [T: string]: any[];
}

export interface ISiteState {
    currentPath: string;
    activeComponentIndex: number;
    componentName: string;
    componentData: IComponentData;
    detailViewComponentData: IComponentData;
    tableOfContentsCollapsed: boolean;
    componentView: ComponentViewTypes;
    formView: boolean;
    devToolsView: boolean;
    locale: string;
}

export enum SiteSlot {
    category = "category",
    categoryIcon = "category-icon"
}

export interface ISiteManagedClasses {
    "@global": string;
    site_canvasContent: string;
    site_headerTitle: string;
    site_infoBarConfiguration: string;
    site_infoBarConfiguration_direction: string;
    site_infoBarConfiguration_direction_input: string;
    site_paneForm: string;
    site_paneToc: string;
    site_paneTocRow: string;
    site_paneTocTitle: string;
    site_paneToggleButton: string;
    site_paneToggleButtonIcon: string;
    site_paneToggleButtonIconLayout: string;
}

const styles: ComponentStyles<ISiteManagedClasses, IDevSiteDesignSystem> = {
    "@global": {
        "body, html": {
            fontFamily: "Segoe UI, SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif",
            fontSize: toPx(14),
            padding: toPx(0),
            margin: toPx(0)
        }
    },
    site_canvasContent: {
        height: `calc(100% - ${toPx(40)})`,
        display: "flex",
        flexDirection: "column"
    },
    site_headerTitle: {
        fontSize: toPx(15),
        marginLeft: toPx(4)
    },
    site_infoBarConfiguration: {
        verticalAlign: "middle",
        padding: toPx(4),
        width: "50%",
        float: "right",
        textAlign: "right"
    },
    site_infoBarConfiguration_direction: {
        position: "relative",
        "&::before, &::after": {
            content: "''",
            position: "absolute",
            top: toPx(6),
            zIndex: "1",
            borderRadius: toPx(2),
            width: toPx(1),
            height: toPx(10),
            background: "#000000"
        },
        "&::before": {
            right: toPx(15),
            transform: "rotate(45deg)"
        },
        "&::after": {
            right: toPx(22),
            transform: "rotate(-45deg)"
        }
    },
    site_infoBarConfiguration_direction_input: {
        lineHeight: toPx(16),
        fontSize: toPx(14),
        backgroundColor: "rgba(0, 0, 0, 0.04)",
        borderRadius: toPx(2),
        boxShadow: `inset 0 0 ${toPx(4)} 0 rgba(0, 0, 0, 0.08)`,
        appearance: "none",
        padding: localizeSpacing(Direction.ltr)(`${toPx(8)} ${toPx(36)} ${toPx(8)} ${toPx(10)}`),
        border: "none",
        outline: "none",
        "&:-ms-expand": {
            display: "none"
        },
        "&:hover": {
            boxShadow: `inset 0 0 ${toPx(2)} 0 rgba(0,0,0, .3)`
        },
        "&:focus": {
            boxShadow: (config: IDevSiteDesignSystem): string => {
                return `inset 0 0 0 1 ${config.brandColor}`;
            }
        }
    },
    site_paneForm: {
        padding: toPx(12)
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

    public static defaultProps: Partial<ISiteProps> = {
        locales: ["en", "en-rtl"]
    };

    private initialPath: string;

    constructor(props: ISiteProps & IManagedClasses<ISiteManagedClasses>) {
        super(props);

        this.initialPath = this.getInitialPath();

        this.state = {
            currentPath: this.initialPath,
            activeComponentIndex: 0,
            tableOfContentsCollapsed: this.props.collapsed || false,
            componentView: ComponentViewTypes.examples,
            componentName: this.getComponentName(this.initialPath),
            componentData: this.getComponentData(),
            detailViewComponentData: this.getDetailViewComponentData(),
            formView: true,
            devToolsView: false,
            locale: "en"
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
                                <Redirect to={this.initialPath} />
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
            route.exampleView.forEach((routeChild: JSX.Element, index: number) => {
                componentData[route.route][index] = routeChild.props.data;
            });
        });

        return componentData;
    }

    private getDetailViewComponentData(): IComponentData {
        const componentData: IComponentData = {};

        this.getRoutes((this.props.children as JSX.Element), "/", SiteSlot.category).forEach((route: IComponentRoute) => {
            componentData[route.route] = [];
            route.detailView.forEach((routeChild: JSX.Element, index: number) => {
                if (routeChild && routeChild.props && routeChild.props.slot === ComponentViewSlot.detailExample) {
                    componentData[route.route] = routeChild.props.data;
                }
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
                path={`${path}(|examples)`}
                exact={true}
            >
                {this.renderShellRow(route)}
            </Route>
        );
    }

    private renderShellHeader(): JSX.Element {
        return (
            <ShellHeader>
                {this.renderChildrenBySlot(this, ShellSlot.header)}
                {this.renderTitle()}
            </ShellHeader>
        );
    }

    private renderShellRow(route: IComponentRoute): JSX.Element {

        const paneStyleSheet: ComponentStyles<IPaneClassNamesContract, IDevSiteDesignSystem> = {
            pane: {
                backgroundColor: (config: IDevSiteDesignSystem): string => {
                    return config.lightGray;
                }
            }
        };
        return (
            <Row fill={true}>
                <Pane
                    collapsed={this.state.tableOfContentsCollapsed}
                    resizable={true}
                    resizeFrom={PaneResizeDirection.east}
                    jssStyleSheet={paneStyleSheet}
                    minWidth={200}
                >
                    <div>
                        {this.renderPaneCollapseToggle()}
                        {this.renderChildrenBySlot(this, ShellSlot.pane)}
                        <ul className={this.props.managedClasses.site_paneToc}>
                            {this.renderRootToc(this.props.children, SiteSlot.category, route.route, "/")}
                        </ul>
                    </div>
                </Pane>
                <Canvas>
                    <Row>
                        <ActionBar
                            onComponentViewChange={this.onComponentViewChange}
                            onFormToggle={this.onFormToggle}
                            onDevToolsToggle={this.onDevToolsToggle}
                            componentView={this.state.componentView}
                            formView={this.state.formView}
                            devToolsView={this.state.devToolsView}
                        />
                    </Row>
                    <div
                        dir={this.state.locale === "en" ? "ltr" : "rtl"}
                        className={this.props.managedClasses.site_canvasContent}
                    >
                        <ComponentView {...{ viewType: this.state.componentView }}>
                            {this.renderChildrenBySlot(this, ShellSlot.canvas)}
                            {this.renderComponentByRoute(route)}
                        </ComponentView>
                        {this.renderDevTools(route.schema)}
                    </div>
                </Canvas>
                <Pane
                    hidden={!this.state.formView}
                    resizable={true}
                    resizeFrom={PaneResizeDirection.west}
                    jssStyleSheet={paneStyleSheet}
                    minWidth={324}
                >
                    {this.generateForm(route.exampleView, route.schema, route.route)}
                </Pane>
            </Row>
        );
    }

    private renderDevTools(schema: any): JSX.Element {
        if (this.state.devToolsView) {
            return (
                <DevTools
                    activeFramework={this.props.activeFramework}
                    activeSchema={schema}
                    activeComponentName={this.state.componentName}
                    activeFormData={this.getCurrentComponentData()}
                    childOptions={this.props.formChildOptions}
                    frameworks={Array.isArray(this.props.frameworks) ? this.props.frameworks : [this.props.frameworks]}
                    onToggleView={this.handleToggleDevToolsView}
                />
            );
        }
    }

    private renderTitle(): JSX.Element {
        const children: React.ReactNode[] = Array.isArray(this.props.children) ? this.props.children : [this.props.children];
        let title: JSX.Element = null;

        children.forEach((child: JSX.Element) => {
            if (child && child.props && child.props.slot === "title") {
                title = (
                    <span className={this.props.managedClasses.site_headerTitle}>
                        {child}
                    </span>
                );
            }
        });

        return title;
    }

    private getCurrentComponentData(): any {
        if (this.state.componentView === ComponentViewTypes.examples) {
            return this.state.componentData[this.state.currentPath][this.state.activeComponentIndex];
        } else if (this.state.componentView === ComponentViewTypes.detail) {
            return this.state.detailViewComponentData[this.state.currentPath];
        }
    }

    private handleComponentDataChange = (data: any): void => {
        const currentPath: string = this.getCurrentPath();

        if (this.state.componentView === ComponentViewTypes.examples) {
            const componentData: IComponentData = Object.assign({}, this.state.componentData);
            componentData[currentPath][this.state.activeComponentIndex] = data;

            this.setState({
                componentData,
                currentPath
            });
        } else if (this.state.componentView === ComponentViewTypes.detail) {
            const detailViewComponentData: IComponentData = Object.assign({}, this.state.detailViewComponentData);
            detailViewComponentData[currentPath] = data;

            this.setState({
                detailViewComponentData,
                currentPath
            });
        }
    }

    private handleToggleDevToolsView = (): void => {
        this.setState({
            devToolsView: !this.state.devToolsView
        });
    }

    private getInitialPath = (): string => {
        return Object.keys(this.getComponentData())[0];
    }

    private getCurrentPath = (): string => {
        return this.getComponentViewTypesByLocation() === ComponentViewTypes.detail
            ? window.location.pathname
            : window.location.pathname.slice(0, window.location.pathname.length - 9);
    }

    private generateForm(component: JSX.Element[], schema: any, route: string): JSX.Element {
        if (component && schema) {
            const componentData: any = this.state.componentView === ComponentViewTypes.examples
                ? Object.assign({}, this.state.componentData[route][this.state.activeComponentIndex])
                : Object.assign({}, this.state.detailViewComponentData[route]);

            return (
                <Form
                    className={this.props.managedClasses.site_paneForm}
                    schema={schema}
                    data={componentData}
                    onChange={this.handleComponentDataChange.bind(route)}
                    childOptions={this.props.formChildOptions}
                />
            );
        }
    }

    private renderComponentByRoute(route: IComponentRoute): JSX.Element[] {
        if (route.exampleView && this.state.componentView === ComponentViewTypes.examples) {
            return route.exampleView.map((componentItem: JSX.Element, index: number) => {
                if (route.componentMapping && componentItem.props && componentItem.props.slot === ComponentViewSlot.example) {
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
        } else if (route.detailView && this.state.componentView === ComponentViewTypes.detail) {
            return route.detailView.map((componentItem: JSX.Element, index: number) => {
                if (route.componentMapping) {
                    return (
                        <React.Fragment key={index}>
                            {this.renderDetailViewComponent(componentItem, index, route)}
                            {this.renderDetailViewDocumentation(componentItem)}
                        </React.Fragment>
                    );
                }
            });
        }
    }

    private renderDetailViewComponent(component: JSX.Element, index: number, route: IComponentRoute): JSX.Element {
        if (component && component.props && component.props.slot === ComponentViewSlot.detailExample) {
            return (
                <ComponentWrapper
                    key={index}
                    index={index}
                    designSystem={component.props.designSystem}
                    active={true}
                >
                    <route.componentMapping {...this.state.detailViewComponentData[route.route]} />
                </ComponentWrapper>
            );
        }

        return null;
    }

    private renderDetailViewDocumentation(component: JSX.Element): JSX.Element {
        if (component && component.props && component.props.slot === ComponentViewSlot.detailDocumentation) {
            return component;
        }

        return null;
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
                {this.renderInfoBarConfiguration()}
                {this.renderChildrenBySlot(this, ShellSlot.infoBar)}
            </ShellInfoBar>
        );
    }

    private renderInfoBarConfiguration(): JSX.Element {
        return (
            <div className={this.props.managedClasses.site_infoBarConfiguration}>
                <span className={this.props.managedClasses.site_infoBarConfiguration_direction}>
                    <select
                        className={this.props.managedClasses.site_infoBarConfiguration_direction_input}
                        onChange={this.handleLocaleUpdate}
                        value={this.state.locale}
                    >
                        {this.renderLocales()}
                    </select>
                </span>
            </div>
        );
    }

    private renderLocales(): JSX.Element[] {
        return this.props.locales.map((locale: string, index: number): JSX.Element => {
            return (
                <option key={index}>
                    {locale}
                </option>
            );
        });
    }

    private handleLocaleUpdate = (e: any): void => {
        if (this.props.onUpdateDirection) {
            this.props.onUpdateDirection(isRTL(e.target.value) ? Direction.rtl : Direction.ltr);
        }

        this.setState({
            locale: e.target.value
        });
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
        const detailDocumentationSlotItems: JSX.Element[] = this.renderChildrenBySlot(item, ComponentViewSlot.detailDocumentation);
        const detailExampleSlotItems: JSX.Element[] = this.renderChildrenBySlot(item, ComponentViewSlot.detailExample);
        const detailSlotItems: JSX.Element[] = detailExampleSlotItems.concat(detailDocumentationSlotItems);
        const exampleSlotItems: JSX.Element[] = this.renderChildrenBySlot(item, ComponentViewSlot.example);

        if (exampleSlotItems && exampleSlotItems.length > 0) {
            currentRoute.push({
                route: this.convertToHyphenated(itemRoute),
                exampleView: exampleSlotItems,
                detailView: detailSlotItems,
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
        if (component && component.props) {
            return React.Children.map(component.props.children, (child: JSX.Element, index: number) => {
                if (child && child.props && child.props.slot === slot) {
                    return child;
                }
            });
        }
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
            const isInSlot: boolean = item && item.props && item.props.slot === slot;

            if (isInSlot && ((collapsed && this.renderTocItemCategoryIcon(item)) || !collapsed)) {
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
                    componentName: this.getComponentName(tocItemPath),
                    currentPath: tocItemPath
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
            <span className={this.props.managedClasses.site_paneTocRow}>
                {renderLayout}
                {icon ? <span className={this.props.managedClasses.site_paneTocTitle}>{name}</span> : name}
            </span>
        );
    }

    private renderTocItemCategoryIcon(item: JSX.Element): JSX.Element {
        if (Array.isArray(item.props.children)) {
            item.props.children.forEach((childElement: JSX.Element) => {
                if (childElement && childElement.props && childElement.props.slot === SiteSlot.categoryIcon) {
                    return childElement;
                }
            });
        } else {
            if (item.props.children.props && item.props.children.props.slot === SiteSlot.categoryIcon) {
                return item;
            }
        }

        return null;
    }

    private hasCanvasContent(item: JSX.Element): boolean {
        let hasCanvasContent: boolean = false;
        const exampleSlot: string = ComponentViewSlot.example;
        const detailExampleSlot: string = ComponentViewSlot.detailExample;
        const detailDocumentationSlot: string = ComponentViewSlot.detailDocumentation;

        if (item.props.children) {
            const itemChildren: JSX.Element[] = Array.isArray(item.props.children) ? item.props.children : [item.props.children];

            itemChildren.forEach((child: JSX.Element): void => {
                hasCanvasContent = child && child.props
                    ? child.props.slot === exampleSlot
                        || child.props.slot === detailExampleSlot
                        || child.props.slot === detailDocumentationSlot
                    : false;
            });
        }

        return hasCanvasContent;
    }

    private convertToHyphenated(name: string): string {
        return name.toLowerCase().replace(/\s/g, "-");
    }
}

export default manageJss(styles)(Site);
export {
    SiteTitle,
    SiteTitleBrand,
    SiteMenu,
    SiteMenuItem,
    SiteCategory,
    SiteCategoryDocumentation,
    SiteCategoryIcon,
    SiteCategoryItem
};
