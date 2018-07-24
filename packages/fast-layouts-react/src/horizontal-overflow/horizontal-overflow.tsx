import * as React from "react";
import { get } from "lodash-es";
import manageJss, { ComponentStyles, IJSSManagerProps, IManagedClasses } from "@microsoft/fast-jss-manager-react";
import Foundation, { IFoundationProps } from "../foundation";
import { HorizontalOverflowProps } from "./horizontal-overflow.props";
import { getItems, scrollLeft } from "./horizontal-overflow.utilities";

export enum ButtonDirection {
    previous = "previous",
    next = "next"
}

export interface IHorizontalOverflowClassNamesContract {
    horizontalOverflow: string;
    horizontalOverflow_items: string;
    horizontalOverflow_next: string;
    horizontalOverflow_previous: string;
}

const styles: ComponentStyles<IHorizontalOverflowClassNamesContract, {}> = {
    horizontalOverflow: {
        position: "relative",
        overflow: "hidden"
    },
    horizontalOverflow_items: {
        position: "relative",
        whiteSpace: "nowrap",
        overflowX: "scroll",
        "&::-webkit-scrollbar": {
            display: "none"
        }
    },
    horizontalOverflow_next: {
        position: "absolute",
        zIndex: "1",
        right: "0",
        top: "0",
        bottom: "0",
        "& > div": {
            display: "flex",
            alignItems: "center",
            height: "100%"
        }
    },
    horizontalOverflow_previous: {
        position: "absolute",
        zIndex: "1",
        left: "0",
        top: "0",
        bottom: "0",
        "& > div": {
            display: "flex",
            alignItems: "center",
            height: "100%"
        }
    }
};

export interface IHorizontalOverflowState {
    items: HTMLElement[];
    itemsHeight: string;
}

class HorizontalOverflow extends Foundation<HorizontalOverflowProps, IHorizontalOverflowState> {

    public static getDerivedStateFromProps(
        nextProps: HorizontalOverflowProps,
        prevState: IHorizontalOverflowState
    ): null | Partial<IHorizontalOverflowState> {
        const items: HTMLElement[] = Array.prototype.slice.call(getItems(nextProps));

        if (items !== prevState.items) {
            return {
                items
            };
        }
    }

    private horizontalOverflowItemsRef: React.RefObject<HTMLDivElement>;

    constructor(props: HorizontalOverflowProps) {
        super(props);

        this.horizontalOverflowItemsRef = React.createRef();

        this.state = {
            items: [],
            itemsHeight: "0"
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
                style={{height: this.state.itemsHeight}}
            >
                <div className={this.props.managedClasses.horizontalOverflow_previous}>
                    <div>
                        <div onClick={this.handlePreviousClick}>
                            {this.getPrevious()}
                        </div>
                    </div>
                </div>
                <div
                    className={this.props.managedClasses.horizontalOverflow_items}
                    ref={this.horizontalOverflowItemsRef}
                >
                    {this.getArrayItems()}
                </div>
                <div className={this.props.managedClasses.horizontalOverflow_next}>
                    <div>
                        <div onClick={this.handleNextClick}>
                            {this.getNext()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    public componentDidMount(): void {
        if (getItems(this.props).length === 0) {
            return;
        }

        const items: HTMLElement[] = Array.prototype.slice.call(getItems(this.props));
        const itemsHeight: string = this.getItemMaxHeight();

        this.setState({
            items,
            itemsHeight
        });
    }

    private itemsOnLoad = (): void => {
        const itemsHeight: string = this.getItemMaxHeight();

        if (itemsHeight !== this.state.itemsHeight) {
            this.setState({
                itemsHeight
            });
        }
    }

    private getItemMaxHeight(): string {
        let itemMaxHeight: number = 0;

        if (get(this.horizontalOverflowItemsRef, "current.childNodes")) {
            const childNodes: HTMLElement[] = Array.prototype.slice.call(get(this.horizontalOverflowItemsRef, "current.childNodes"));

            for (const childNode of childNodes) {
                const childNodeHeight: number = childNode.getBoundingClientRect().height;

                if (childNodeHeight > itemMaxHeight) {
                    itemMaxHeight = childNodeHeight;
                }
            }
        }

        return `${itemMaxHeight}px`;
    }

    private getPrevious(): JSX.Element {
        let previous: JSX.Element = null;
        const children: React.ReactNode[] = Array.isArray(this.props.children) ? this.props.children : [this.props.children];

        children.forEach((child: JSX.Element) => {
            if (child.props && child.props.slot === ButtonDirection.previous) {
                previous = child;
            }
        });

        return previous;
    }

    private getNext(): JSX.Element {
        let next: JSX.Element = null;
        const children: React.ReactNode[] = Array.isArray(this.props.children) ? this.props.children : [this.props.children];

        children.forEach((child: JSX.Element) => {
            if (child.props && child.props.slot === ButtonDirection.next) {
                next = child;
            }
        });

        return next;
    }

    private getArrayItems(): JSX.Element[] {
        return this.state.items.map((item: HTMLElement, index: number) => {
            return (
                <React.Fragment key={index}>
                    {item}
                </React.Fragment>
            );
        });
    }

    private getMoveDistanceFromDirection(
        direction: ButtonDirection,
        availableWidth: number,
        itemWidths: number[],
        distanceFromBeginning: number
    ): number {
        if (itemWidths.length === 0) {
            return 0;
        }

        let distance: number = 0;
        const maxDistance: number = this.getMaxMoveDistance(availableWidth, itemWidths);

        if (direction === ButtonDirection.next) {
            if (distanceFromBeginning === maxDistance) {
                distance = maxDistance;
            } else {
                distance = this.getNextDistance(availableWidth, itemWidths, distanceFromBeginning);

                if (distance >= maxDistance) {
                    distance = maxDistance;
                }
            }
        } else {
            if (distanceFromBeginning === 0) {
                distance = 0;
            } else {
                distance = this.getPreviousDistance(availableWidth, itemWidths, distanceFromBeginning);

                if (distance < 0) {
                    distance = 0;
                }
            }
        }

        return distance;
    }

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

    private getPreviousDistance(availableWidth: number, itemWidths: number[], distanceFromBeginning: number): number {
        let distance: number = this.getMaxMoveDistance(availableWidth, itemWidths) + availableWidth;

        for (let i: number = itemWidths.length - 1; i >= 0; i--) {
            if (distance - itemWidths[i] < distanceFromBeginning - availableWidth) {
                return distance;
            }

            distance -= itemWidths[i];
        }

        return distance;
    }

    private getMaxMoveDistance(availableWidth: number, itemWidths: number[]): number {
        const totalWidth: number = itemWidths.reduce((a: number, b: number) => a + b);
        return totalWidth - availableWidth;
    }

    private handlePreviousClick = (): void => {
        this.handleClick(ButtonDirection.previous);
    }

    private handleNextClick = (): void => {
        this.handleClick(ButtonDirection.next);
    }

    private handleClick(direction: ButtonDirection): void {
        const availableWidth: number = this.horizontalOverflowItemsRef.current.getBoundingClientRect().width;
        const items: HTMLElement[] = Array.prototype.slice.call(this.horizontalOverflowItemsRef.current.childNodes);
        const itemWidths: number[] = [];

        for (const item of items) {
            itemWidths.push(item.getBoundingClientRect().width);
        }

        this.setMoveDistance(
            this.getMoveDistanceFromDirection(
                direction,
                availableWidth,
                itemWidths,
                this.horizontalOverflowItemsRef.current.scrollLeft
            )
        );
    }

    private setMoveDistance(updatedDistance: number): void {
        scrollLeft(
            this.horizontalOverflowItemsRef.current,
            updatedDistance,
            this.props.scrollDuration ? this.props.scrollDuration : 500
        );
    }
}

export default manageJss(styles)(HorizontalOverflow);
