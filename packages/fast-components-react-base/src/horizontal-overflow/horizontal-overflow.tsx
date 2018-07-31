import * as React from "react";
import { get } from "lodash-es";
import { canUseDOM } from "exenv-es6";
import { IHorizontalOverflowClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { getClientRectWithMargin } from "@microsoft/fast-web-utilities";
import Foundation, { HandledProps } from "../foundation";
import { HorizontalOverflowProps, IHorizontalOverflowHandledProps } from "./horizontal-overflow.props";

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
        children: void 0,
        scrollDuration: void 0,
        managedClasses: void 0
    };

    private horizontalOverflowItemsRef: React.RefObject<HTMLUListElement>;

    constructor(props: HorizontalOverflowProps) {
        super(props);

        this.horizontalOverflowItemsRef = React.createRef();

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
                className={this.props.managedClasses.horizontalOverflow}
                onLoad={this.itemsOnLoad}
            >
                <div style={{height: `${this.state.itemsHeight}px`, position: "relative", overflow: "hidden"}}>
                    <ul
                        className={this.props.managedClasses.horizontalOverflow_items}
                        style={{position: "relative", whiteSpace: "nowrap", overflowX: "scroll", padding: 0, margin: 0}}
                        ref={this.horizontalOverflowItemsRef}
                    >
                        {this.getItems()}
                    </ul>
                </div>
                <div className={this.props.managedClasses.horizontalOverflow_previous}>
                    <div>
                        <div onClick={this.handlePreviousClick}>
                            {this.getChildBySlot(ButtonDirection.previous)}
                        </div>
                    </div>
                </div>
                <div className={this.props.managedClasses.horizontalOverflow_next}>
                    <div>
                        <div onClick={this.handleNextClick}>
                            {this.getChildBySlot(ButtonDirection.next)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    public componentDidMount(): void {
        if (!this.props.children) {
            return;
        }

        const itemsHeight: number = this.getItemMaxHeight();

        this.setState({
            itemsHeight
        });
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

    /**
     * Identifies and returns the tallest child height
     */
    private getItemMaxHeight(): number {
        let itemMaxHeight: number = 0;

        if (!canUseDOM()) {
            return itemMaxHeight;
        }

        const children: HTMLElement = get(this.horizontalOverflowItemsRef, "current.childNodes");

        if (children) {
            const childNodes: HTMLElement[] = Array.prototype.slice.call(children);

            for (const childNode of childNodes) {
                const childNodeHeight: number = getClientRectWithMargin(childNode).height;

                if (childNodeHeight > itemMaxHeight) {
                    itemMaxHeight = childNodeHeight;
                }
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
     * Gets the children displayed is items to be scrolled
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
     * Gets the distance to scroll based on the direction
     */
    private getScrollDistanceFromDirection(
        direction: ButtonDirection,
        availableWidth: number,
        itemWidths: number[],
        distanceFromBeginning: number
    ): number {
        if (itemWidths.length === 0) {
            return 0;
        }

        let distance: number = 0;
        const maxDistance: number = this.getMaxScrollDistance(availableWidth, itemWidths);

        if (direction === ButtonDirection.next) {
            distance = this.getWithinMaxDistance(distanceFromBeginning, availableWidth, itemWidths, maxDistance);
        } else {
            distance = this.getWithinMinDistance(distanceFromBeginning, availableWidth, itemWidths);
        }

        return distance;
    }

    /**
     * Gets the distance unless it is over the maximum distance, then use maximum distance instead
     */
    private getWithinMaxDistance(distanceFromBeginning: number, availableWidth: number, itemWidths: number[], maxDistance: number): number {
        let distance: number = 0;

        if (distanceFromBeginning === maxDistance) {
            distance = maxDistance;
        } else {
            distance = this.getNextDistance(availableWidth, itemWidths, distanceFromBeginning);

            if (distance >= maxDistance) {
                distance = maxDistance;
            }
        }

        return distance;
    }

    /**
     * Gets the distance unless it is under the minimum distance, then use minimum distance instead
     */
    private getWithinMinDistance(distanceFromBeginning: number, availableWidth: number, itemWidths: number[]): number {
        let distance: number = 0;

        if (distanceFromBeginning === 0) {
            distance = 0;
        } else {
            distance = this.getPreviousDistance(availableWidth, itemWidths, distanceFromBeginning);
        }

        return distance;
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
     * Handler for the click event
     */
    private handleClick(direction: ButtonDirection): void {
        if (!canUseDOM()) {
            return;
        }

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
