import * as React from "react";
import { get } from "lodash-es";
import * as ReactDOM from "react-dom";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    PivotHandledProps,
    PivotManagedClasses,
    PivotUnhandledProps,
} from "./pivot.props";
import { toPx } from "@microsoft/fast-jss-utilities";
import { TabsClassNameContract } from "@microsoft/fast-components-react-base";
import { Tabs as BaseTabs } from "@microsoft/fast-components-react-base";
import { PivotProps } from ".";

export interface PivotState {
    offsetX: number;
    activeId: string;
}

class Pivot extends Foundation<PivotHandledProps, PivotUnhandledProps, PivotState> {
    public static displayName: string = "Pivot";

    /**
     * React life-cycle method
     */
    public static getDerivedStateFromProps(
        nextProps: PivotProps,
        prevState: PivotState
    ): null | Partial<PivotState> {
        if (nextProps.activeId && nextProps.activeId !== prevState.activeId) {
            return {
                activeId: nextProps.activeId,
            };
        }

        return null;
    }

    protected handledProps: HandledProps<PivotHandledProps> = {
        label: void 0,
        items: void 0,
        managedClasses: void 0,
    };

    private tabsRef: React.RefObject<any>;

    /**
     * The constructor
     */
    constructor(props) {
        super(props);

        let activeId: string = !this.props.activeId
            ? this.props.items[0].id
            : this.props.activeId;

        this.state = {
            offsetX: 0,
            activeId: activeId,
        };

        this.tabsRef = React.createRef();
    }

    public componentDidMount(): void {
        this.setActiveIndicatorOffset();
    }
    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLButtonElement | HTMLAnchorElement> {
        return (
            <BaseTabs
                {...this.unhandledProps()}
                ref={this.tabsRef}
                managedClasses={this.generatePivotClassNames()}
                activeId={this.state.activeId}
                onUpdate={this.handleTabsUpdate}
                items={this.props.items}
                label={this.props.label}
            >
                {this.props.children}
                <span
                    style={{ transform: `translateX(${toPx(this.state.offsetX)})` }}
                    className={get(
                        this.props,
                        "managedClasses.pivot_item__activeIndicator",
                        ""
                    )}
                />
            </BaseTabs>
        );
    }

    /**
     * Returns tabs managedclasses with new carousel-specific JSS
     */
    protected generatePivotClassNames(): TabsClassNameContract {
        return {
            tabs: get(this.props, "managedClasses.pivot", ""),
            tabs_tabPanels: get(this.props, "managedClasses.pivot_tabPanels", ""),
            tabs_tabList: get(this.props, "managedClasses.pivot_itemList", ""),
            tabs_tabPanelContent: get(
                this.props,
                "managedClasses.pivot_tabPanelContent",
                ""
            ),
            tab: get(this.props, "managedClasses.pivot_item", ""),
            tab__active: get(this.props, "managedClasses.pivot_item__active", ""),
            tabPanel: get(this.props, "managedClasses.pivot_tabPanel", ""),
            tabPanel__hidden: get(
                this.props,
                "managedClasses.pivot_tabPanel__hidden",
                ""
            ),
        };
    }

    private handleTabsUpdate = (activeTabId: string): void => {
        console.log("I'm CLicked", activeTabId);
        if (this.props.activeId) {
            this.props.onUpdate(activeTabId);
        } else {
            this.setState(
                {
                    activeId: activeTabId,
                },
                this.setActiveIndicatorOffset
            );
        }
        // this.setActiveIndicatorOffset();
    };

    private setActiveIndicatorOffset(): void {
        if (this.tabsRef.current) {
            let tabElement: HTMLElement = ReactDOM.findDOMNode(
                this.tabsRef.current
            ) as HTMLElement;

            const mytabs = tabElement.querySelectorAll("[aria-selected='true']");

            const width: number = mytabs[0].getBoundingClientRect().width;
            const center: number = width / 2;
            const offsetX =
                mytabs[0].getBoundingClientRect().left -
                tabElement.getBoundingClientRect().left +
                center;

            if (offsetX != this.state.offsetX) {
                this.setState({
                    offsetX: offsetX,
                });
            }
        }
    }
}

export default Pivot;
export * from "./pivot.props";
