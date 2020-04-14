import { TabsClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    classNames,
    keyCodeArrowDown,
    keyCodeArrowLeft,
    keyCodeArrowRight,
    keyCodeArrowUp,
    keyCodeEnd,
    keyCodeHome,
    Orientation,
} from "@microsoft/fast-web-utilities";
import { get } from "lodash-es";
import React from "react";
import { DisplayNamePrefix } from "../utilities";
import Tab, { TabManagedClasses } from "./tab";
import TabItem from "./tab-item";
import TabPanel, { TabPanelManagedClasses } from "./tab-panel";
import { TabsHandledProps, TabsItem, TabsProps, TabsUnhandledProps } from "./tabs.props";

export enum TabLocation {
    first,
    last,
    previous,
    next,
}

export enum TabsSlot {
    tab = "tab",
    tabItem = "tab-item",
    tabPanel = "tab-panel",
}

export interface TabsState {
    activeId: string;
}

class Tabs extends Foundation<TabsHandledProps, TabsUnhandledProps, TabsState> {
    public static defaultProps: Partial<TabsProps> = {
        orientation: Orientation.horizontal,
        disableTabFocus: false,
        managedClasses: {},
    };

    public static displayName: string = `${DisplayNamePrefix}Tabs`;

    /**
     * React life-cycle method
     */
    public static getDerivedStateFromProps(
        nextProps: TabsProps,
        prevState: TabsState
    ): null | TabsState {
        if (nextProps.activeId && nextProps.activeId !== prevState.activeId) {
            return {
                activeId: nextProps.activeId,
            };
        }

        return null;
    }

    protected handledProps: HandledProps<TabsHandledProps> = {
        activeId: void 0,
        disableTabFocus: void 0,
        label: void 0,
        managedClasses: void 0,
        onUpdate: void 0,
        orientation: void 0,
        tabItemSlot: void 0,
        tabPanelSlot: void 0,
        tabSlot: void 0,
        items: void 0,
    };

    /**
     * React ref for the tab list
     */
    private tabListRef: React.RefObject<HTMLDivElement>;

    constructor(props: TabsProps) {
        super(props);

        this.tabListRef = React.createRef();

        if (!this.props.items) {
            const items: React.ReactNode[] = React.Children.toArray(this.tabItems());
            this.state = {
                activeId: this.props.activeId
                    ? this.props.activeId
                    : items.length > 0
                    ? get(items[0], "props.id")
                    : "",
            };
        } else {
            this.state = {
                activeId: "",
            };
        }
    }

    /**
     * Renders the component
     */
    public render(): JSX.Element {
        const tabElements: JSX.Element[] = this.renderTabElements();
        const {
            tabs_tabList,
            tabs_tabPanels,
        }: TabsClassNameContract = this.props.managedClasses;

        return (
            <div {...this.unhandledProps()} className={this.generateClassNames()}>
                <div
                    role="tablist"
                    ref={this.tabListRef}
                    className={classNames(tabs_tabList)}
                    aria-label={this.props.label}
                    aria-orientation={this.props.orientation}
                >
                    {tabElements}
                </div>
                <div className={classNames(tabs_tabPanels)}>{this.renderTabPanels()}</div>
                {this.withoutSlot(TabsSlot.tabItem, this.props.children)}
            </div>
        );
    }

    /**
     * React lifecycle hook
     */
    public componentDidUpdate(prevProps: TabsProps): void {
        if (
            typeof this.props.activeId === "string" &&
            this.props.activeId !== prevProps.activeId &&
            this.props.disableTabFocus !== true
        ) {
            const items: React.ReactNode[] = React.Children.toArray(this.tabItems());
            const currentItemIndex: number = items.findIndex(this.getCurrentIndexById);

            // Do nothing if current item index is not found
            if (currentItemIndex !== -1) {
                (Array.from(this.tabListRef.current.children)[
                    currentItemIndex
                ] as HTMLButtonElement).focus();
            }
        }
    }

    /**
     * Generates class names based on props
     */
    protected generateClassNames(): string {
        return super.generateClassNames(classNames(this.props.managedClasses.tabs));
    }

    /**
     * Create tab content class names
     */
    protected generateTabContentClassNames(): string {
        return classNames(this.props.managedClasses.tabs_tabContent);
    }

    /**
     * Create tab panel content class names
     */
    protected generateTabPanelContentClassNames(): string {
        return classNames(this.props.managedClasses.tabs_tabPanelContent);
    }

    /**
     * Create tab class names
     */
    protected generateTabClassNames(): TabManagedClasses {
        const { tab, tab__active }: TabsClassNameContract = this.props.managedClasses;

        return {
            managedClasses: {
                tab: classNames(tab),
                tab__active: classNames(tab__active),
            },
        };
    }

    /**
     * Create tab panel class names
     */
    protected generateTabPanelClassNames(): TabPanelManagedClasses {
        const {
            tabPanel,
            tabPanel__hidden,
        }: TabsClassNameContract = this.props.managedClasses;

        return {
            managedClasses: {
                tabPanel: classNames(tabPanel),
                tabPanel__hidden: classNames(tabPanel__hidden),
            },
        };
    }

    /**
     * Renders the tab elements
     */
    private renderTabElements(): JSX.Element[] {
        return React.Children.map(this.tabItems(), this.renderTabItem);
    }

    private setActive(tabItem: TabsItem, index: number): boolean {
        if (this.state.activeId) {
            return this.state.activeId === tabItem.id;
        } else {
            return index === 0;
        }
    }

    private tabItems(): React.ReactNode {
        if (this.props.items) {
            return this.props.items.map((tabItem: TabsItem, index: number) => {
                return (
                    <TabItem key={tabItem.id} id={tabItem.id} slot={TabsSlot.tabItem}>
                        <Tab
                            {...this.generateTabClassNames()}
                            slot={TabsSlot.tab}
                            key={tabItem.id}
                            aria-controls={tabItem.id}
                            active={this.setActive(tabItem, index)}
                            onClick={this.handleClick}
                            onKeyDown={this.handleKeyDown}
                            tabIndex={this.setActive(tabItem, index) ? 0 : -1}
                        >
                            {tabItem.tab(this.generateTabContentClassNames())}
                        </Tab>
                        <TabPanel
                            {...this.generateTabPanelClassNames()}
                            slot={TabsSlot.tabPanel}
                            key={tabItem.id}
                            id={tabItem.id}
                            aria-labelledby={tabItem.id}
                            active={this.setActive(tabItem, index)}
                        >
                            {tabItem.content(this.generateTabPanelContentClassNames())}
                        </TabPanel>
                    </TabItem>
                );
            });
        } else {
            return this.getChildrenBySlot(
                this.props.children,
                this.getSlot(TabsSlot.tabItem)
            );
        }
    }

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    private renderTabItem = (tabItem: JSX.Element, index: number): JSX.Element => {
        if (this.props.items) {
            return this.getChildrenBySlot(
                tabItem.props.children,
                this.getSlot(TabsSlot.tab)
            )[0];
        }
        return React.cloneElement(
            this.getChildrenBySlot(tabItem.props.children, this.getSlot(TabsSlot.tab))[0],
            {
                key: tabItem.props.id,
                "aria-controls": tabItem.props.id,
                active: this.state.activeId === tabItem.props.id,
                onClick: this.handleClick,
                onKeyDown: this.handleKeyDown,
                tabIndex: this.state.activeId !== tabItem.props.id ? -1 : 0,
            }
        );
    };

    /**
     * Renders the tab panels
     */
    private renderTabPanels(): JSX.Element[] {
        return React.Children.map(this.tabItems(), this.renderTabPanel);
    }

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    private renderTabPanel = (tabItem: JSX.Element, index: number): JSX.Element => {
        if (this.props.items) {
            return this.getChildrenBySlot(
                tabItem.props.children,
                this.getSlot(TabsSlot.tabPanel)
            )[0];
        }
        return React.cloneElement(
            this.getChildrenBySlot(
                tabItem.props.children,
                this.getSlot(TabsSlot.tabPanel)
            )[0],
            {
                key: tabItem.props.id,
                id: tabItem.props.id,
                "aria-labelledby": tabItem.props.id,
                active: this.state.activeId === tabItem.props.id,
            }
        );
    };

    /**
     * Handles the click event on the tab element
     */
    private handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (!this.props.activeId) {
            this.setState({
                activeId: e.currentTarget.getAttribute("aria-controls"),
            });
        } else if (typeof this.props.onUpdate === "function") {
            this.props.onUpdate(e.currentTarget.getAttribute("aria-controls"));
        }
    };

    /**
     * Handles the keydown event on the tab element
     */
    private handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        const keyCode: number = e.keyCode;

        if (this.props.orientation === Orientation.horizontal) {
            switch (keyCode) {
                case keyCodeArrowLeft:
                    e.preventDefault();
                    this.activateTab(TabLocation.previous);
                    break;
                case keyCodeArrowRight:
                    e.preventDefault();
                    this.activateTab(TabLocation.next);
                    break;
            }
        } else {
            switch (e.keyCode) {
                case keyCodeArrowUp:
                    e.preventDefault();
                    this.activateTab(TabLocation.previous);
                    break;
                case keyCodeArrowDown:
                    e.preventDefault();
                    this.activateTab(TabLocation.next);
                    break;
            }
        }

        switch (keyCode) {
            case keyCodeHome:
                this.activateTab(TabLocation.first);
                break;
            case keyCodeEnd:
                this.activateTab(TabLocation.last);
                break;
        }
    };

    /**
     * Activates a tab
     */
    private activateTab(location: TabLocation): void {
        const items: React.ReactNode[] = React.Children.toArray(this.tabItems());
        const count: number = items.length;
        const currentItemIndex: number = React.Children.toArray(items).findIndex(
            this.getCurrentIndexById
        );
        let itemIndex: number;

        switch (location) {
            case TabLocation.first:
                itemIndex = 0;
                break;
            case TabLocation.last:
                itemIndex = count - 1;
                break;
            case TabLocation.previous:
                itemIndex = currentItemIndex > 0 ? currentItemIndex - 1 : count - 1;
                break;
            case TabLocation.next:
                itemIndex = currentItemIndex < count - 1 ? currentItemIndex + 1 : 0;
                break;
        }

        const activeId: string | undefined = get(items[itemIndex], "props.id");

        if (!this.props.activeId) {
            this.setState({
                activeId,
            });

            (Array.from(this.tabListRef.current.children)[
                itemIndex
            ] as HTMLButtonElement).focus();
        } else if (typeof this.props.onUpdate === "function") {
            this.props.onUpdate(activeId);
        }
    }

    /**
     * Gets the current index by tab item ID
     */
    private getCurrentIndexById = (item: JSX.Element): boolean => {
        return item.props.id === this.state.activeId;
    };

    /**
     * Gets the slot to use for tab children
     */
    private getSlot(slot: TabsSlot): TabsSlot | string {
        switch (slot) {
            case TabsSlot.tab:
                return typeof this.props.tabSlot === "string"
                    ? this.props.tabSlot
                    : TabsSlot.tab;
            case TabsSlot.tabItem:
                return typeof this.props.tabItemSlot === "string"
                    ? this.props.tabItemSlot
                    : TabsSlot.tabItem;
            case TabsSlot.tabPanel:
                return typeof this.props.tabPanelSlot === "string"
                    ? this.props.tabPanelSlot
                    : TabsSlot.tabPanel;
        }
    }

    /**
     * Gets the child by the slot property
     */
    private getChildrenBySlot(
        children: React.ReactNode,
        slot: TabsSlot | string
    ): React.ReactNode {
        const childBySlot: React.ReactNode = this.filterChildren(
            this.withSlot(slot, children)
        );

        return slot !== this.getSlot(TabsSlot.tabItem)
            ? childBySlot
            : React.Children.map(
                  childBySlot,
                  (node: React.ReactNode): React.ReactNode | null => {
                      return this.isValidTabItem(node) ? node : null;
                  }
              );
    }

    /**
     * Need to filter out none truthy results for Preact.
     * Can remove if below gets merged in.
     * https://github.com/preactjs/preact-compat/pull/461
     */
    private filterChildren(nodes: React.ReactNode): React.ReactNode {
        if (Array.isArray(nodes)) {
            return nodes.filter(Boolean);
        } else {
            return nodes;
        }
    }

    /**
     * Return a tab item if it has a tab and tab panel
     */
    private isValidTabItem(child: React.ReactNode): boolean {
        const children: React.ReactNode = get(child, "props.children");
        return (
            !!this.getChildrenBySlot(children, this.getSlot(TabsSlot.tab))[0] &&
            !!this.getChildrenBySlot(children, this.getSlot(TabsSlot.tabPanel))[0]
        );
    }
}

export default Tabs;
export * from "./tabs.props";
