import * as React from "react";
import { get } from "lodash-es";
import * as ReactDOM from "react-dom";
import { canUseDOM } from "exenv-es6";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { canUseFocusVisible } from "@microsoft/fast-web-utilities";
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
    focused: boolean;
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

    private tabPanelIndex: number;

    /**
     * The constructor
     */
    constructor(props: PivotProps) {
        super(props);

        if (Array.isArray(this.props.items)) {
            this.state = {
                offsetX: 0,
                focused: false,
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
        this.tabPanelIndex = this.updateTabPanelIndex();
    }

    public componentDidUpdate(): void {
        if (this.ltr !== this.getLTR()) {
            this.setActiveIndicatorOffset();
            this.ltr = this.getLTR();
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
                onBlur={this.handleOnBlur}
                onFocus={this.handleOnFocus}
            >
                <span
                    style={{ transform: `translateX(${toPx(this.state.offsetX)})` }}
                    className={this.generateActiveIndicatorClassNames()}
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
            tabs_tabPanelContent: get(
                this.props,
                "managedClasses.pivot_tabPanelContent",
                ""
            ),
            tab: get(this.props, "managedClasses.pivot_tab", ""),
            tab__active: get(this.props, "managedClasses.pivot_tab_active", ""),
            tabPanel: get(this.props, "managedClasses.pivot_tabPanel", ""),
            tabPanel__hidden: get(
                this.props,
                "managedClasses.pivot_tabPanel__hidden",
                ""
            ),
        };
    }

    /**
     * Adds focus state to outer wrapper
     * In order perfomantly apply focus to activeIndicator,
     * a class must be added instead of using
     * focus-visual via style
     */
    private handleOnFocus = (): void => {
        const tabElement: HTMLElement = ReactDOM.findDOMNode(
            this.tabsRef.current
        ) as HTMLElement;

        const mytabs: NodeListOf<Element> = tabElement.querySelectorAll(
            canUseFocusVisible() ? "[role='tab']:focus-visible" : "[role='tab']:focus"
        );

        if (mytabs.length > 0) {
            this.setState({ focused: true });
        }
    };

    /**
     * Removes focus state
     */
    private handleOnBlur = (): void => {
        this.setState({ focused: false });
    };

    /**
     * Generates class names
     */
    private generateActiveIndicatorClassNames(): string {
        let classNames: string = get(
            this.props,
            "managedClasses.pivot_activeIndicator",
            ""
        );

        if (this.state.focused) {
            classNames = `${classNames} ${get(
                this.props,
                "managedClasses.pivot_activeIndicator__focused",
                ""
            )}`;
        }

        return classNames;
    }

    private handleTabsUpdate = (activeTabId: string): void => {
        this.updateTabPanelIndex();
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
    };

    private isSelected(element: HTMLElement): boolean {
        return element.className.includes("active") === true;
    }

    private updateTabPanelIndex(): number {
        if (canUseDOM() && this.tabsRef.current && Array.isArray(this.props.items)) {
            const tabElement: HTMLElement = ReactDOM.findDOMNode(
                this.tabsRef.current
            ) as HTMLElement;

            const mytabsArray: HTMLElement[] = Array.prototype.slice.call(
                tabElement.querySelectorAll("[role='tab']")
            );

            return mytabsArray.findIndex(this.isSelected);
        }
    }

    private generateTabPanelsClassNames(): string {
        let className: string = get(this.props, "managedClasses.pivot_tabPanels", "");
        if (this.tabPanelIndex === this.updateTabPanelIndex()) {
            className = className;
        } else if (this.tabPanelIndex < this.updateTabPanelIndex()) {
            className = `${className} ${get(
                this.props,
                "managedClasses.pivot_tabPanels__fromLeft",
                ""
            )}`;
        } else {
            className = `${className} ${get(
                this.props,
                "managedClasses.pivot_tabPanels__fromRight",
                ""
            )}`;
        }
        this.tabPanelIndex = this.updateTabPanelIndex();
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

export default Pivot;
export * from "./pivot.props";
export { PivotClassNameContract };
