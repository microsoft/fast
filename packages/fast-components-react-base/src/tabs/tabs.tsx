import * as React from "react";
import { get } from "lodash-es";
import { KeyCodes } from "@microsoft/fast-web-utilities";
import { IManagedClasses, ITabsClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import Foundation, { HandledProps } from "../foundation";
import { ITabsHandledProps, ITabsManagedClasses, ITabsUnhandledProps, TabsProps } from "./tabs.props";
import Tab from "./tab";
import TabItem from "./tab-item";
import TabPanel from "./tab-panel";

export interface ITabsState {
    activeId: string;
}

class Tabs extends Foundation<ITabsHandledProps & ITabsManagedClasses, ITabsUnhandledProps, ITabsState> {

    /**
     * React life-cycle method
     */
    public static getDerivedStateFromProps(nextProps: TabsProps, prevState: ITabsState): null | ITabsState {
        if (nextProps.activeId && nextProps.activeId !== prevState.activeId) {
            return {
                activeId: nextProps.activeId
            };
        }

        return null;
    }

    protected handledProps: HandledProps<ITabsHandledProps & IManagedClasses<ITabsClassNameContract>> = {
        activeId: void 0,
        children: void 0,
        label: void 0,
        managedClasses: void 0,
        orientation: void 0
    };

    /**
     * React ref for the tab list
     */
    private tabListRef: React.RefObject<HTMLDivElement>;

    constructor(props: TabsProps) {
        super(props);

        const tabItems: JSX.Element[] = this.getChildByComponent(this.props.children, TabItem);
        this.tabListRef = React.createRef();

        this.state = {
            activeId: this.props.activeId
                ? this.props.activeId
                : tabItems.length > 0
                ? tabItems[0].props.id
                : void(0)
        };
    }

    /**
     * Renders the component
     */
    public render(): JSX.Element {
        const tabElements: JSX.Element[] = this.renderTabElements();

        if (tabElements.length > 0) {
            return (
                <div
                    {...this.unhandledProps()}
                    className={this.generateClassNames()}
                >
                    <div
                        role="tablist"
                        ref={this.tabListRef}
                        className={this.props.managedClasses.tab_list}
                        aria-label={this.props.label}
                        aria-orientation={this.props.orientation}
                    >
                        {tabElements}
                    </div>
                    {this.renderTabPanels()}
                </div>
            );
        }

        return null;
    }

    /**
     * Generates class names based on props
     */
    protected generateClassNames(): string {
        return super.generateClassNames(get(this.props, "managedClasses.tabs"));
    }

    /**
     * Renders the tab elements
     */
    private renderTabElements(): JSX.Element[] {
        const tabElements: JSX.Element[] = [];

        this.getChildByComponent(this.props.children, TabItem).forEach((tabItem: JSX.Element, index: number): void => {
            tabElements.push(
                <button
                    key={tabItem.props.id}
                    role="tab"
                    className={this.generateTabClassNames(tabItem.props.id)}
                    aria-controls={tabItem.props.id}
                    aria-selected={this.state.activeId === tabItem.props.id}
                    onClick={this.handleClick}
                    onKeyDown={this.handleKeyDown}
                    tabIndex={this.state.activeId !== tabItem.props.id ? -1 : 0}
                >
                    {this.getChildByComponent(tabItem.props.children, Tab)[0]}
                </button>
            );
        });

        return tabElements;
    }

    /**
     * Renders the tab panels
     */
    private renderTabPanels(): JSX.Element[] {
        const tabPanels: JSX.Element[] = [];

        this.getChildByComponent(this.props.children, TabItem).forEach((tabItem: JSX.Element, index: number): void => {
            tabPanels.push(
                <div
                    key={tabItem.props.id}
                    id={tabItem.props.id}
                    className={this.props.managedClasses.tab_panel}
                    role="tabpanel"
                    aria-labelledby={tabItem.props.id}
                    aria-hidden={this.state.activeId !== tabItem.props.id}
                >
                    {this.getChildByComponent(tabItem.props.children, TabPanel)[0]}
                </div>
            );
        });

        return tabPanels;
    }

    /**
     * Generate class names for tab elements
     */
    private generateTabClassNames(id: string): string {
        return this.state.activeId !== id
            ? this.props.managedClasses.tab
            : `${this.props.managedClasses.tab} ${this.props.managedClasses.tab__active}`;
    }

    /**
     * Handles the click event on the tab element
     */
    private handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
        if (!this.props.activeId) {
            this.setState({
                activeId: e.currentTarget.getAttribute("aria-controls")
            });
        } else if (typeof this.props.onUpdateTab === "function") {
            this.props.onUpdateTab(e.currentTarget.getAttribute("aria-controls"));
        }
    }

    /**
     * Handles the keydown event on the tab element
     */
    private handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>): void => {
        switch (e.keyCode) {
            case KeyCodes.arrowLeft:
            case KeyCodes.arrowUp:
                this.activatePrevious();
                break;
            case KeyCodes.arrowRight:
            case KeyCodes.arrowDown:
                this.activateNext();
                break;
            case KeyCodes.home:
                this.activateFirst();
                break;
            case KeyCodes.end:
                this.activateLast();
                break;
        }
    }

    /**
     * Activates the previous tab item
     */
    private activatePrevious(): void {
        const items: JSX.Element[] = this.getChildByComponent(this.props.children, TabItem);
        const currentItemIndex: number = items.findIndex(this.getCurrentIndexById);
        const previousItemIndex: number = currentItemIndex > 0 ? currentItemIndex - 1 : items.length - 1;
        const previousItemId: string = items[previousItemIndex].props.id;

        if (!this.props.activeId) {
            this.setState({
                activeId: previousItemId
            });

            (Array.from(this.tabListRef.current.children)[previousItemIndex] as HTMLButtonElement).focus();
        } else if (typeof this.props.onUpdateTab === "function") {
            this.props.onUpdateTab(previousItemId);
        }
    }

    /**
     * Activates the next tab item
     */
    private activateNext(): void {
        const items: JSX.Element[] = this.getChildByComponent(this.props.children, TabItem);
        const currentItemIndex: number = items.findIndex(this.getCurrentIndexById);
        const nextItemIndex: number = currentItemIndex < items.length - 1 ? currentItemIndex + 1 : 0;
        const nextItemId: string = items[nextItemIndex].props.id;

        if (!this.props.activeId) {
            this.setState({
                activeId: nextItemId
            });

            (Array.from(this.tabListRef.current.children)[nextItemIndex] as HTMLButtonElement).focus();
        } else if (typeof this.props.onUpdateTab === "function") {
            this.props.onUpdateTab(nextItemId);
        }
    }

    /**
     * Activates the first tab item
     */
    private activateFirst(): void {
        const items: JSX.Element[] = this.getChildByComponent(this.props.children, TabItem);
        const activeId: string = items[0].props.id;

        if (!this.props.activeId) {
            this.setState({
                activeId
            });

            (Array.from(this.tabListRef.current.children)[0] as HTMLButtonElement).focus();
        } else if (typeof this.props.onUpdateTab === "function") {
            this.props.onUpdateTab(activeId);
        }
    }

    /**
     * Activates the last tab item
     */
    private activateLast(): void {
        const items: JSX.Element[] = this.getChildByComponent(this.props.children, TabItem);
        const lastItemIndex: number = items.length - 1;
        const activeId: string = items[lastItemIndex].props.id;

        if (!this.props.activeId) {
            this.setState({
                activeId
            });

            (Array.from(this.tabListRef.current.children)[lastItemIndex] as HTMLButtonElement).focus();
        } else if (typeof this.props.onUpdateTab === "function") {
            this.props.onUpdateTab(activeId);
        }
    }

    /**
     * Gets the current index by tab item ID
     */
    private getCurrentIndexById = (item: JSX.Element): boolean => {
        return item.props.id === this.state.activeId;
    }

    /**
     * Gets the child by the component
     */
    private getChildByComponent(
        children: React.ReactNode,
        component: string | React.ComponentClass<any> | React.StatelessComponent<any>
    ): JSX.Element[] {
        const childBySlot: JSX.Element[] = [];

        React.Children.forEach(children, (child: JSX.Element): void => {
            if (child.props && child.type === component) {
                if (component === TabItem) {
                    if (
                        !!this.getChildByComponent(child.props.children, Tab)[0]
                        && !!this.getChildByComponent(child.props.children, TabPanel)[0]
                    ) {
                        childBySlot.push(child);
                    }
                } else {
                    childBySlot.push(child);
                }
            }
        });

        return childBySlot;
    }
}

export default Tabs;
export * from "./tabs.props";
export {
    Tab,
    TabItem,
    TabPanel
};
