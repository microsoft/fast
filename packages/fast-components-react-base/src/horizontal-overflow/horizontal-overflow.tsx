import * as React from "react";
import { get } from "lodash-es";
import { canUseDOM } from "exenv-es6";
import { IHorizontalOverflowClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { getClientRectWithMargin } from "@microsoft/fast-web-utilities";
import { Direction } from "@microsoft/fast-application-utilities";
import Foundation, { HandledProps } from "../foundation";
import { HorizontalOverflowProps, IHorizontalOverflowHandledProps, IScrollObject } from "./horizontal-overflow.props";
import throttle from "raf-throttle";

export enum ButtonDirection {
    previous = "previous",
    next = "next"
}

export interface IHorizontalOverflowState {
    itemsHeight: number;
}

export type AnimateScroll = () => void;

class HorizontalOverflow extends Foundation<HorizontalOverflowProps,  React.AllHTMLAttributes<HTMLDivElement>, IHorizontalOverflowState> {

    protected handledProps: HandledProps<IHorizontalOverflowHandledProps & IManagedClasses<IHorizontalOverflowClassNameContract>> = {
        scrollDuration: void 0,
        managedClasses: void 0,
        onScrollChange: void 0
    };

    private horizontalOverflowItemsRef: React.RefObject<HTMLUListElement>;

    /**
     * Throttle request animation frame usage
     */
    private throttled: any;

    /**
     * Constructor
     */
    constructor(props: HorizontalOverflowProps) {
        super(props);

        this.horizontalOverflowItemsRef = React.createRef();
        this.throttled = throttle(this.onScrollChange);

        this.state = {
            itemsHeight: 0
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
                <div style={{height: `${this.state.itemsHeight}px`, position: "relative", overflow: "hidden"}}>
                    <ul
                        className={this.props.managedClasses.horizontalOverflow_items}
                        style={this.getListStyle()}
                        ref={this.horizontalOverflowItemsRef}
                    >
                        {this.getItems()}
                    </ul>
                </div>
                {this.renderPreviousButton()}
                {this.renderNextButton()}
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
            itemsHeight
        });

        if (canUseDOM() && this.horizontalOverflowItemsRef.current) {
            this.horizontalOverflowItemsRef.current.addEventListener("scroll", this.throttled);
        }
    }

    /**
     * React life-cycle method
     */
    public componentWillUnmount(): void {
        if (canUseDOM() && this.horizontalOverflowItemsRef.current) {
            this.horizontalOverflowItemsRef.current.removeEventListener("scroll", this.throttled);
        }
    }

    /**
     * Callback on scroll change
     */
    public onScrollChange = (): IScrollObject => {
        let scrollObject: IScrollObject;
        const isLtr: boolean = this.getLTR() === Direction.ltr;
        const distanceRemaining: number =
            this.horizontalOverflowItemsRef.current.scrollWidth - this.horizontalOverflowItemsRef.current.scrollLeft;

        if (this.horizontalOverflowItemsRef.current.scrollLeft === 0) {
            scrollObject = { start: isLtr, end: !isLtr };
        } else if (distanceRemaining === this.horizontalOverflowItemsRef.current.clientWidth) {
            scrollObject = { start: !isLtr, end: isLtr };
        } else {
            scrollObject = { start: false, end: false };
        }

        if (this.props.onScrollChange) {
            this.props.onScrollChange(scrollObject);
        }

        return scrollObject;
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(get(this.props, "managedClasses.horizontalOverflow"));
    }

    /**
     * Gets the style for the `ul` element containing the items
     */
    private getListStyle(): React.CSSProperties {
        return {position: "relative", whiteSpace: "nowrap", overflowX: "scroll", padding: 0, margin: 0};
    }

    /**
     * onLoad handler to make sure any children affecting height are accounted for
     */
    private itemsOnLoad = (): void => {
        const itemsHeight: number = this.getItemMaxHeight();

        if (itemsHeight !== this.state.itemsHeight) {
            this.setState({
                itemsHeight
            });
        }
    }

    private renderPreviousButton(): JSX.Element {
        return (
            <div className={this.props.managedClasses.horizontalOverflow_previous} onClick={this.handlePreviousClick}>
                {this.getChildBySlot(ButtonDirection.previous)}
            </div>
        );
    }

    private renderNextButton(): JSX.Element {
        return (
            <div className={this.props.managedClasses.horizontalOverflow_next} onClick={this.handleNextClick}>
                {this.getChildBySlot(ButtonDirection.next)}
            </div>
        );
    }

    /**
     * Identifies and returns the tallest child height
     */
    private getItemMaxHeight(): number {
        let itemMaxHeight: number = 0;
        const children: HTMLElement = get(this.horizontalOverflowItemsRef, "current.childNodes");

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
     * Gets children by slot name
     */
    private getChildBySlot(slot: ButtonDirection): JSX.Element {
        let childBySlot: JSX.Element = null;

        React.Children.forEach(this.props.children, (child: JSX.Element): void => {
            if (child.props && child.props.slot === slot) {
                childBySlot = child;
            }
        });

        return childBySlot;
    }

    /**
     * Gets the children displayed as items to be scrolled
     */
    private getItems(): JSX.Element[] {
        const previousButton: JSX.Element = this.getChildBySlot(ButtonDirection.previous);
        const nextButton: JSX.Element = this.getChildBySlot(ButtonDirection.next);

        return React.Children.map(this.props.children, (child: JSX.Element, index: number) => {
            if (child !== nextButton && child !== previousButton) {
                return (
                    <li key={index} style={{display: "inline-block"}}>
                        {child}
                    </li>
                );
            }
        });
    }

    /**
     * Gets the direction of the element
     */
    private getLTR(): Direction {
        return !this.horizontalOverflowItemsRef.current
            ? Direction.ltr
            : getComputedStyle(this.horizontalOverflowItemsRef.current).direction === Direction.rtl
            ? Direction.rtl
            : Direction.ltr;
    }

    private isMovingNext(direction: ButtonDirection, ltr: Direction): boolean {
        return (direction === ButtonDirection.next && ltr === Direction.ltr)
            || (direction === ButtonDirection.previous && ltr === Direction.rtl);
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
            distance = this.getWithinMaxDistance(distanceFromBeginning, availableWidth, itemWidths, maxDistance);
        } else {
            distance = this.getWithinMinDistance(distanceFromBeginning, availableWidth, itemWidths);
        }

        return distance;
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

        const distance: number = this.getNextDistance(availableWidth, itemWidths, distanceFromBeginning);

        return distance >= maxDistance ? maxDistance : distance;
    }

    /**
     * Gets the distance unless it is under the minimum distance, then use minimum distance instead
     */
    private getWithinMinDistance(distanceFromBeginning: number, availableWidth: number, itemWidths: number[]): number {
        if (distanceFromBeginning === 0) {
            return 0;
        }

        const distance: number = this.getPreviousDistance(availableWidth, itemWidths, distanceFromBeginning);

        return distance <= 0 ? 0 : distance;
    }

    /**
     * Gets the distance to scroll if the next button has been clicked
     */
    private getNextDistance(availableWidth: number, itemWidths: number[], distanceFromBeginning: number): number {
        let distance: number = 0;

        for (let i: number = 0, itemWidthsLength: number = itemWidths.length; i < itemWidthsLength; i++) {
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
    private getPreviousDistance(availableWidth: number, itemWidths: number[], distanceFromBeginning: number): number {
        let distance: number = this.getMaxScrollDistance(availableWidth, itemWidths) + availableWidth;

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
    }

    /**
     * Handler for the next click event
     */
    private handleNextClick = (): void => {
        this.handleClick(ButtonDirection.next);
    }

    /**
     * Handler for the click event fired after next or previous has been clicked
     */
    private handleClick(direction: ButtonDirection): void {
        const availableWidth: number = getClientRectWithMargin(this.horizontalOverflowItemsRef.current).width;
        const items: HTMLElement[] = Array.prototype.slice.call(this.horizontalOverflowItemsRef.current.childNodes);
        const itemWidths: number[] = [];

        for (const item of items) {
            itemWidths.push(getClientRectWithMargin(item).width);
        }

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
            return changeInValue / 2 * currentTime * currentTime + startValue;
        }

        currentTime--;

        return -changeInValue / 2 * (currentTime * (currentTime - 2) - 1) + startValue;
    }

    /**
     * Scrolls the container for the items list
     */
    private scrollLeft(element: HTMLUListElement, left: number, duration: number): void {
        const start: number = element.scrollLeft;
        const change: number = left - start;
        const startDate: number = new Date().getTime();
        const animateScroll: AnimateScroll = (): void => {
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
export { IHorizontalOverflowClassNameContract };
