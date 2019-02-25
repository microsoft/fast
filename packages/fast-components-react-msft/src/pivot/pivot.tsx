import * as React from "react";
import { get } from "lodash-es";
import * as ReactDOM from "react-dom";
import { canUseDOM } from "exenv-es6";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    PivotHandledProps,
    PivotManagedClasses,
    PivotUnhandledProps,
} from "./pivot.props";
import {
    ManagedClasses,
    PivotClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-msft";
import { Direction } from "@microsoft/fast-application-utilities";
import { toPx } from "@microsoft/fast-jss-utilities";
import { TabsClassNameContract } from "@microsoft/fast-components-react-base";
import { Tabs as BaseTabs } from "@microsoft/fast-components-react-base";
import { PivotProps } from ".";

export interface PivotState {
    offsetX: number;
    activeId: string;
    tabPanelIndex: number;
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

    private ltr: Direction;

    private prevTabPanelIndex: number;

    /**
     * The constructor
     */
    constructor(props: PivotProps) {
        super(props);

        if (Array.isArray(this.props.items)) {
            this.state = {
                offsetX: 0,
                tabPanelIndex: 0,
                activeId:
                    typeof this.props.activeId === "string"
                        ? this.props.activeId
                        : get(this.props.items[0], "id", ""),
            };
        }

        this.tabsRef = React.createRef();
    }

    public componentDidMount(): void {
        this.ltr = this.getLTR();
        this.setActiveIndicatorOffset();
        this.prevTabPanelIndex = this.state.tabPanelIndex;
    }

    public componentDidUpdate(prevProps: PivotProps, prevState: PivotState): void {
        if (this.ltr !== this.getLTR()) {
            this.setActiveIndicatorOffset();
            this.ltr = this.getLTR();
        }

        if (this.state.activeId !== prevState.activeId) {
            this.setActiveIndicatorOffset();
            this.updateTabPanelIndex();
        }
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
                <span
                    style={{ transform: `translateX(${toPx(this.state.offsetX)})` }}
                    className={get(
                        this.props,
                        "managedClasses.pivot_activeIndicator",
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
            tabs_tabPanels: this.generateTabPanelsClassNames(),
            tabs_tabList: get(this.props, "managedClasses.pivot_tabList", ""),
            tabs_tabContent: get(this.props, "managedClasses.pivot_tabContent", ""),
            tabs_tabPanelContent: get(
                this.props,
                "managedClasses.pivot_tabPanelContent",
                ""
            ),
            tab: get(this.props, "managedClasses.pivot_tab", ""),
            tab__active: get(this.props, "managedClasses.pivot_tab__active", ""),
            tabPanel: get(this.props, "managedClasses.pivot_tabPanel", ""),
            tabPanel__hidden: get(
                this.props,
                "managedClasses.pivot_tabPanel__hidden",
                ""
            ),
        };
    }

    private handleTabsUpdate = (activeTabId: string): void => {
        this.setState({
            activeId: activeTabId,
        });
    };

    private isSelected(element: HTMLElement): boolean {
        return element.className.includes("active") === true;
    }

    private updateTabPanelIndex(): void {
        if (canUseDOM() && this.tabsRef.current && Array.isArray(this.props.items)) {
            const tabElement: HTMLElement = ReactDOM.findDOMNode(
                this.tabsRef.current
            ) as HTMLElement;

            const mytabsArray: HTMLElement[] = Array.prototype.slice.call(
                tabElement.querySelectorAll("[role='tab']")
            );
            this.setState({
                tabPanelIndex: mytabsArray.findIndex(this.isSelected),
            });
        }
    }

    private generateTabPanelsClassNames(): string {
        let className: string = get(this.props, "managedClasses.pivot_tabPanels", "");
        if (this.state.tabPanelIndex === this.prevTabPanelIndex) {
            className = className;
        } else if (this.state.tabPanelIndex < this.prevTabPanelIndex) {
            className = `${className} ${get(
                this.props,
                "managedClasses.pivot_tabPanels__previous",
                ""
            )}`;
        } else {
            className = `${className} ${get(
                this.props,
                "managedClasses.pivot_tabPanels__next",
                ""
            )}`;
        }
        this.prevTabPanelIndex = this.state.tabPanelIndex;
        return className;
    }

    private setActiveIndicatorOffset(): void {
        if (canUseDOM() && this.tabsRef.current && Array.isArray(this.props.items)) {
            const tabElement: HTMLElement = ReactDOM.findDOMNode(
                this.tabsRef.current
            ) as HTMLElement;

            const mytabs: NodeListOf<Element> = tabElement.querySelectorAll(
                "[aria-selected='true']"
            );

            if (mytabs[0] !== undefined && tabElement !== undefined) {
                const width: number = mytabs[0].getBoundingClientRect().width;
                const center: number = width / 2;
                const offsetX: number =
                    mytabs[0].getBoundingClientRect().left -
                    tabElement.getBoundingClientRect().left +
                    center;

                if (offsetX !== this.state.offsetX) {
                    this.setState({
                        offsetX,
                    });
                }
            }
        }
    }

    /**
     * Gets the direction of the element
     */
    private getLTR(): Direction {
        if (canUseDOM()) {
            const tabElement: HTMLElement = ReactDOM.findDOMNode(
                this.tabsRef.current
            ) as HTMLElement;

            return !tabElement
                ? Direction.ltr
                : getComputedStyle(tabElement).direction === Direction.rtl
                    ? Direction.rtl
                    : Direction.ltr;
        }
    }
}

export default Pivot;
export * from "./pivot.props";
export { PivotClassNameContract };
