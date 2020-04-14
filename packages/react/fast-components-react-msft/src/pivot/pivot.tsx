import { TabsClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { PivotClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { Tabs as BaseTabs } from "@microsoft/fast-components-react-base";
import { toPx } from "@microsoft/fast-jss-utilities";
import { classNames, Direction, Orientation } from "@microsoft/fast-web-utilities";
import { canUseDOM } from "exenv-es6";
import { get } from "lodash-es";
import React from "react";
import ReactDOM from "react-dom";
import { DisplayNamePrefix } from "../utilities";
import { PivotHandledProps, PivotProps, PivotUnhandledProps } from "./pivot.props";

export interface PivotState {
    offsetX: number;
    activeId: string;
    tabPanelIndex: number;
}

class Pivot extends Foundation<PivotHandledProps, PivotUnhandledProps, PivotState> {
    public static displayName: string = `${DisplayNamePrefix}Pivot`;
    public static defaultProps: Partial<PivotProps> = {
        managedClasses: {},
    };

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

    private tabsRef: React.RefObject<BaseTabs>;

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

        if (this.state.tabPanelIndex !== prevState.tabPanelIndex) {
            this.prevTabPanelIndex = this.state.tabPanelIndex;
        }
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <BaseTabs
                {...this.unhandledProps()}
                ref={this.tabsRef}
                managedClasses={this.generatePivotClassNames()}
                activeId={this.state.activeId}
                onUpdate={this.handleTabsUpdate}
                orientation={this.props.orientation}
                items={this.props.items}
                label={this.props.label}
            >
                <span
                    style={{ transform: `translateX(${toPx(this.state.offsetX)})` }}
                    className={classNames(
                        this.props.managedClasses.pivot_activeIndicator
                    )}
                />
            </BaseTabs>
        );
    }

    /**
     * Returns tabs managedclasses with new carousel-specific JSS
     */
    protected generatePivotClassNames(): TabsClassNameContract {
        const {
            pivot,
            pivot_tabList,
            pivot_tabContent,
            pivot_tabPanelContent,
            pivot_tab,
            pivot_tab__active,
            pivot_tabPanel,
            pivot_tabPanel__hidden,
        }: PivotClassNameContract = this.props.managedClasses;

        return {
            tabs: pivot,
            tabs_tabPanels: this.generateTabPanelsClassNames(),
            tabs_tabList: pivot_tabList,
            tabs_tabContent: pivot_tabContent,
            tabs_tabPanelContent: pivot_tabPanelContent,
            tab: pivot_tab,
            tab__active: pivot_tab__active,
            tabPanel: pivot_tabPanel,
            tabPanel__hidden: pivot_tabPanel__hidden,
        };
    }

    private handleTabsUpdate = (activeTabId: string): void => {
        this.setState({
            activeId: activeTabId,
        });

        if (typeof this.props.onUpdate === "function") {
            this.props.onUpdate(activeTabId);
        }
    };

    private isSelected(element: HTMLElement): boolean {
        return element.attributes["aria-selected"].value === "true";
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
        const {
            pivot_tabPanels,
            pivot_tabPanels__animatePrevious,
            pivot_tabPanels__animateNext,
        }: PivotClassNameContract = this.props.managedClasses;
        const indexNotChanged: boolean =
            this.state.tabPanelIndex === this.prevTabPanelIndex;
        const shouldReverse: boolean = this.state.tabPanelIndex < this.prevTabPanelIndex;
        return classNames(
            pivot_tabPanels,
            [pivot_tabPanels__animatePrevious, shouldReverse],
            [pivot_tabPanels__animateNext, !shouldReverse && !indexNotChanged]
        );
    }

    private setActiveIndicatorOffset(): void {
        if (canUseDOM() && this.tabsRef.current && Array.isArray(this.props.items)) {
            const tabElement: HTMLElement = ReactDOM.findDOMNode(
                this.tabsRef.current
            ) as HTMLElement;

            const mytab: HTMLElement = tabElement.querySelector("[aria-selected='true']");

            if (mytab !== null && tabElement !== null) {
                const width: number = mytab.getBoundingClientRect().width;
                const center: number = width / 2;
                const offsetX: number =
                    mytab.getBoundingClientRect().left -
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

    // TODO #1438: Add optional direction prop to Pivot and Horizontal overflow
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
