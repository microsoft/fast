import React from "react";
import { get } from "lodash-es";
import { canUseDOM } from "exenv-es6";
import {
    HorizontalOverflowClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-base";
import { getClientRectWithMargin } from "@microsoft/fast-web-utilities";
import { Direction } from "@microsoft/fast-application-utilities";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    HorizontalOverflowHandledProps,
    HorizontalOverflowProps,
    HorizontalOverflowUnhandledProps,
    PositionChange,
} from "./horizontal-overflow.props";
import throttle from "raf-throttle";
import {
    ConstructableResizeObserver,
    ResizeObserverClassDefinition,
} from "./resize-observer";
import { ResizeObserverEntry } from "./resize-observer-entry";

export enum ButtonDirection {
    previous = "previous",
    next = "next",
}

export interface HorizontalOverflowState {
    itemsHeight: number;
}

declare global {
    interface WindowWithResizeObserver extends Window {
        ResizeObserver: ConstructableResizeObserver;
    }
}

class HorizontalOverflow extends Foundation<
    HorizontalOverflowHandledProps,
    HorizontalOverflowUnhandledProps,
    HorizontalOverflowState
> {
    public static displayName: string = "HorizontalOverflow";

    protected handledProps: HandledProps<HorizontalOverflowHandledProps> = {
        scrollDuration: void 0,
        managedClasses: void 0,
        onScrollChange: void 0,
        onOverflowChange: void 0,
    };

    private horizontalOverflowItemsRef: React.RefObject<HTMLUListElement>;

    /**
     * Throttle scroll request animation frame usage
     */
    private throttledScroll: throttle;

    /**
     * Throttle resize request animation frame usage
     */
    private throttledResize: throttle;

    /**
     * Stores the overall overflow status
     */
    private overflow: boolean;

    /**
     * Stores the overallStart status
     */
    private overflowStart: boolean;

    /**
     * Stores the overallEnd status
     */
    private overflowEnd: boolean;

    /**
     * Constructor
     */
    constructor(props: HorizontalOverflowProps) {
        super(props);

        this.horizontalOverflowItemsRef = React.createRef();
        this.throttledScroll = throttle(this.onScrollChange);
        this.throttledResize = throttle(this.onWindowResize);
        this.overflow = false;

        this.state = {
            itemsHeight: 0,
        };
    }

    /**
     * Renders the Horizontal Overflow markup
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                onLoad={this.itemsOnLoad}
            >
                <div
                    style={{
                        height: `${this.state.itemsHeight}px`,
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    <ul
                        className={get(
                            this.props,
                            "managedClasses.horizontalOverflow_contentRegion"
                        )}
                        style={this.getListStyle()}
                        ref={this.horizontalOverflowItemsRef}
                    >
                        {this.getItems()}
                    </ul>
                </div>
                <div
                    className={get(
                        this.props,
                        "managedClasses.horizontalOverflow_previous"
                    )}
                    onClick={this.handlePreviousClick}
                >
                    {this.withSlot(ButtonDirection.previous)}
                </div>
                <div
                    className={get(this.props, "managedClasses.horizontalOverflow_next")}
                    onClick={this.handleNextClick}
                >
                    {this.withSlot(ButtonDirection.next)}
                </div>
            </div>
        );
    }

    /**
     * React life-cycle method
     */
    public componentDidMount(): void {
        if (!this.props.children) {
            return;
        }

        const itemsHeight: number = this.getItemMaxHeight();

        this.setState({
            itemsHeight,
        });

        if (canUseDOM() && this.horizontalOverflowItemsRef.current) {
            this.horizontalOverflowItemsRef.current.addEventListener(
                "scroll",
                this.throttledScroll
            );
            window.addEventListener("resize", this.throttledResize);

            // TODO #1142 https://github.com/Microsoft/fast-dna/issues/1142
            // Full browser support imminent
            // Revisit usage once Safari and Firefox adapt
            // https://bugzilla.mozilla.org/show_bug.cgi?id=1272409
            // https://bugs.webkit.org/show_bug.cgi?id=157743
            if ((window as WindowWithResizeObserver).ResizeObserver) {
                const resizeObserver: ResizeObserverClassDefinition = new (window as WindowWithResizeObserver).ResizeObserver(
                    (entries: ResizeObserverEntry[]): void => {
                        if (this.overflow !== this.isOverflow()) {
                            this.handleOverflowChange();
                        }
                    }
                );
                resizeObserver.observe(this.horizontalOverflowItemsRef.current);
            }
        }
    }

    /**
     * React life-cycle method
     */
    public componentWillUnmount(): void {
        if (canUseDOM() && this.horizontalOverflowItemsRef.current) {
            this.horizontalOverflowItemsRef.current.removeEventListener(
                "scroll",
                this.throttledScroll
            );
            window.removeEventListener("resize", this.throttledResize);
        }
    }

    /**
     * React life-cycle method
     */
    public getSnapshotBeforeUpdate(prevProps: HorizontalOverflowProps): boolean | null {
        if (
            React.Children.toArray(prevProps.children).length <
            React.Children.toArray(this.props.children).length
        ) {
            return true;
        }

        return null;
    }

    /**
     * React life-cycle method
     */
    public componentDidUpdate(
        prevProps: HorizontalOverflowProps,
        prevState: HorizontalOverflowState,
        snapshot: boolean | null
    ): void {
        if (snapshot !== null) {
            this.handleOverflowChange();
        }
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(
            get(this.props, "managedClasses.horizontalOverflow")
        );
    }

    /**
     * Callback for on scroll change
     */
    private onScrollChange = (): void => {
        if (typeof this.props.onScrollChange === "function") {
            this.props.onScrollChange(this.getPositionData());
        }

        // If the onOverflowChange callback exist, we want to update overflow
        // based on scroll change
        if (typeof this.props.onOverflowChange === "function") {
            const positionData: PositionChange = this.getPositionData();

            if (
                this.overflowStart === positionData.start ||
                this.overflowEnd === positionData.end
            ) {
                this.handleOverflowChange();
            }
        }
    };

    /**
     * Get the scroll change data
     */
    private getPositionData = (): PositionChange => {
        const isLtr: boolean = this.getLTR() === Direction.ltr;
        const distanceRemaining: number =
            this.horizontalOverflowItemsRef.current.scrollWidth -
            this.horizontalOverflowItemsRef.current.scrollLeft;

        if (this.horizontalOverflowItemsRef.current.scrollLeft === 0) {
            return { start: isLtr, end: !isLtr };
        } else if (
            distanceRemaining === this.horizontalOverflowItemsRef.current.clientWidth
        ) {
            return { start: !isLtr, end: isLtr };
        } else {
            return { start: false, end: false };
        }
    };

    /**
     * Gets the style for the `ul` element containing the items
     */
    private getListStyle(): React.CSSProperties {
        return {
            position: "relative",
            whiteSpace: "nowrap",
            overflowX: "scroll",
            padding: 0,
            margin: 0,
        };
    }

    /**
     * onLoad handler to make sure any children affecting height are accounted for
     */
    private itemsOnLoad = (): void => {
        const itemsHeight: number = this.getItemMaxHeight();

        if (itemsHeight !== this.state.itemsHeight) {
            this.setState({
                itemsHeight,
            });
        }

        if (this.overflow !== this.isOverflow()) {
            this.handleOverflowChange();
        }
    };

    /**
     * Handles the resize event
     */
    private onWindowResize = (): void => {
        if (this.overflow !== this.isOverflow()) {
            this.handleOverflowChange();
        }
    };

    /**
     * Checks if overflow is occuring
     */
    private isOverflow(): boolean {
        const availableWidth: number = this.getAvailableWidth();
        const itemWidths: number[] = this.getItemWidths();
        const totalItemWidth: number = itemWidths.reduce((a: number, b: number) => a + b);

        return totalItemWidth > availableWidth;
    }

    /**
     * Callback for the horizontal overflow change
     */
    private handleOverflowChange = (): void => {
        this.overflow = this.isOverflow();

        if (this.overflow) {
            const positionData: PositionChange = this.getPositionData();
            this.overflowStart = !positionData.start;
            this.overflowEnd = !positionData.end;
        } else {
            this.overflowStart = false;
            this.overflowEnd = false;
        }

        if (typeof this.props.onOverflowChange === "function") {
            this.props.onOverflowChange({
                overflowStart: this.overflowStart,
                overflowEnd: this.overflowEnd,
            });
        }
    };

    /**
     * Identifies and returns the tallest child height
     */
    private getItemMaxHeight(): number {
        let itemMaxHeight: number = 0;
        const children: HTMLElement = get(
            this.horizontalOverflowItemsRef,
            "current.childNodes"
        );

        if (!canUseDOM() || !children) {
            return itemMaxHeight;
        }

        const childNodes: HTMLElement[] = Array.prototype.slice.call(children);

        for (const childNode of childNodes) {
            const childNodeHeight: number = getClientRectWithMargin(childNode).height;

            if (childNodeHeight > itemMaxHeight) {
                itemMaxHeight = childNodeHeight;
            }
        }

        return itemMaxHeight;
    }

    /**
     * Gets the children displayed as items to be scrolled
     */
    private getItems(): React.ReactNode {
        return React.Children.map(
            this.withoutSlot([ButtonDirection.previous, ButtonDirection.next]),
            (child: React.ReactNode): React.ReactElement<HTMLLIElement> => {
                return <li style={{ display: "inline-block" }}>{child}</li>;
            }
        );
    }

    /**
     * Gets the direction of the element
     */
    private getLTR(): Direction {
        return !this.horizontalOverflowItemsRef.current
            ? Direction.ltr
            : getComputedStyle(this.horizontalOverflowItemsRef.current).direction ===
              Direction.rtl
                ? Direction.rtl
                : Direction.ltr;
    }

    /**
     * Checks if moving to next direction
     */
    private isMovingNext(direction: ButtonDirection, ltr: Direction): boolean {
        return (
            (direction === ButtonDirection.next && ltr === Direction.ltr) ||
            (direction === ButtonDirection.previous && ltr === Direction.rtl)
        );
    }

    /**
     * Gets the distance to scroll based on the direction and rtl
     */
    private getScrollDistanceFromDirection(
        direction: ButtonDirection,
        availableWidth: number,
        itemWidths: number[],
        distanceFromBeginning: number
    ): number {
        if (itemWidths.length === 0 || !canUseDOM()) {
            return 0;
        }

        let distance: number = 0;
        const maxDistance: number = this.getMaxScrollDistance(availableWidth, itemWidths);
        const ltr: Direction = this.getLTR();

        if (this.isMovingNext(direction, ltr)) {
            distance = this.getWithinMaxDistance(
                distanceFromBeginning,
                availableWidth,
                itemWidths,
                maxDistance
            );
        } else {
            distance = this.getWithinMinDistance(
                distanceFromBeginning,
                availableWidth,
                itemWidths
            );
        }

        return Math.ceil(distance);
    }

    /**
     * Gets the distance unless it is over the maximum distance, then use maximum distance instead
     */
    private getWithinMaxDistance(
        distanceFromBeginning: number,
        availableWidth: number,
        itemWidths: number[],
        maxDistance: number
    ): number {
        if (distanceFromBeginning === maxDistance) {
            return maxDistance;
        }

        const distance: number = this.getNextDistance(
            availableWidth,
            itemWidths,
            distanceFromBeginning
        );

        return distance >= maxDistance ? maxDistance : distance;
    }

    /**
     * Gets the distance unless it is under the minimum distance, then use minimum distance instead
     */
    private getWithinMinDistance(
        distanceFromBeginning: number,
        availableWidth: number,
        itemWidths: number[]
    ): number {
        if (distanceFromBeginning === 0) {
            return 0;
        }

        const distance: number = this.getPreviousDistance(
            availableWidth,
            itemWidths,
            distanceFromBeginning
        );

        return distance <= 0 ? 0 : distance;
    }

    /**
     * Gets the distance to scroll if the next button has been clicked
     */
    private getNextDistance(
        availableWidth: number,
        itemWidths: number[],
        distanceFromBeginning: number
    ): number {
        let distance: number = 0;

        for (
            let i: number = 0, itemWidthsLength: number = itemWidths.length;
            i < itemWidthsLength;
            i++
        ) {
            if (distance + itemWidths[i] > distanceFromBeginning + availableWidth) {
                return distance;
            }

            distance += itemWidths[i];
        }

        return distance;
    }

    /**
     * Gets the distance to scroll if the previous button has been clicked
     */
    private getPreviousDistance(
        availableWidth: number,
        itemWidths: number[],
        distanceFromBeginning: number
    ): number {
        let distance: number =
            this.getMaxScrollDistance(availableWidth, itemWidths) + availableWidth;

        for (let i: number = itemWidths.length - 1; i >= 0; i--) {
            if (distance - itemWidths[i] < distanceFromBeginning - availableWidth) {
                return distance;
            }

            distance -= itemWidths[i];
        }

        return distance;
    }

    /**
     * Gets the maximum distance that can be scrolled
     */
    private getMaxScrollDistance(availableWidth: number, itemWidths: number[]): number {
        const totalWidth: number = itemWidths.reduce((a: number, b: number) => a + b);

        return totalWidth - availableWidth;
    }

    /**
     * Handler for the previous click event
     */
    private handlePreviousClick = (): void => {
        this.handleClick(ButtonDirection.previous);
    };

    /**
     * Handler for the next click event
     */
    private handleNextClick = (): void => {
        this.handleClick(ButtonDirection.next);
    };

    /**
     * Returns the available content region width
     */
    private getAvailableWidth(): number {
        return getClientRectWithMargin(this.horizontalOverflowItemsRef.current).width;
    }

    /**
     * Returns the items widths
     */
    private getItemWidths(): number[] {
        const items: HTMLElement[] = Array.prototype.slice.call(
            this.horizontalOverflowItemsRef.current.childNodes
        );
        const itemWidths: number[] = [];

        for (const item of items) {
            itemWidths.push(getClientRectWithMargin(item).width);
        }

        return itemWidths;
    }

    /**
     * Handler for the click event fired after next or previous has been clicked
     */
    private handleClick(direction: ButtonDirection): void {
        const availableWidth: number = this.getAvailableWidth();
        const itemWidths: number[] = this.getItemWidths();

        this.setScrollDistance(
            this.getScrollDistanceFromDirection(
                direction,
                availableWidth,
                itemWidths,
                this.horizontalOverflowItemsRef.current.scrollLeft
            )
        );
    }

    /**
     * Sets the scroll distance for the items list
     */
    private setScrollDistance(updatedDistance: number): void {
        this.scrollLeft(
            this.horizontalOverflowItemsRef.current,
            updatedDistance,
            this.props.scrollDuration ? this.props.scrollDuration : 500
        );
    }

    /**
     * Easing animation
     * Inspired by the github gist contribution: https://gist.github.com/andjosh/6764939
     */
    private easeInOutQuad(
        currentTime: number,
        startValue: number,
        changeInValue: number,
        duration: number
    ): number {
        currentTime /= duration / 2;

        if (currentTime < 1) {
            return (changeInValue / 2) * currentTime * currentTime + startValue;
        }

        currentTime--;

        return (-changeInValue / 2) * (currentTime * (currentTime - 2) - 1) + startValue;
    }

    /**
     * Scrolls the container for the items list
     */
    private scrollLeft(element: HTMLUListElement, left: number, duration: number): void {
        const start: number = element.scrollLeft;
        const change: number = left - start;
        const startDate: number = new Date().getTime();
        const animateScroll: () => void = (): void => {
            const currentDate: number = new Date().getTime();
            const currentTime: number = currentDate - startDate;
            element.scrollLeft = this.easeInOutQuad(currentTime, start, change, duration);

            if (currentTime < duration) {
                requestAnimationFrame(animateScroll);
            } else {
                element.scrollLeft = left;
            }
        };

        animateScroll();
    }
}

export default HorizontalOverflow;
export * from "./horizontal-overflow.props";
export { HorizontalOverflowClassNameContract };
