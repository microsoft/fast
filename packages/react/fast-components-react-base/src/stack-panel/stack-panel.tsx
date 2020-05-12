import { StackPanelClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { classNames, Direction, RtlScrollConverter } from "@microsoft/fast-web-utilities";
import { get, isFunction, isNil, merge } from "lodash-es";
import React from "react";
import { toPx } from "@microsoft/fast-jss-utilities";
import { Orientation } from "@microsoft/fast-web-utilities";
import { DisplayNamePrefix, ResizeObserverClassDefinition } from "../utilities";
import {
    StackPanelHandledProps,
    StackPanelProps,
    StackPanelUnhandledProps,
} from "./stack-panel.props";

export interface StackPanelState {
    isScrollable: boolean;
    renderedRangeStartIndex: number;
    renderedRangeEndIndex: number;
    direction: Direction;
}

/**
 * Used to store the pixel coordinates and span of items
 * along the stackpanel's axis
 */
interface ItemPosition {
    start: number;
    span: number;
    end: number;
}

class StackPanel extends Foundation<
    StackPanelHandledProps,
    StackPanelUnhandledProps,
    StackPanelState
> {
    public static displayName: string = `${DisplayNamePrefix}StackPanel`;

    public static defaultProps: Partial<StackPanelProps> = {
        managedClasses: {},
        virtualize: true,
        neverVirtualizeIndexes: [],
        itemSpan: 100,
        preloadBufferCount: 1,
        orientation: Orientation.vertical,
        scrollLayoutUpdateDelay: 0,
    };

    private static DirectionAttributeName: string = "dir";

    protected handledProps: HandledProps<StackPanelHandledProps> = {
        itemSpan: void 0,
        virtualize: void 0,
        neverVirtualizeIndexes: void 0,
        preloadBufferCount: void 0,
        orientation: void 0,
        managedClasses: void 0,
        initiallyVisibleItemIndex: void 0,
        onScrollChange: void 0,
        scrollLayoutUpdateDelay: void 0,
    };

    // ref to the root element of the component
    private rootElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    /**
     * ref to the element which is the container all children are rendered into
     * It is sized accomodate all children and is the container that is being scrolled
     */
    private itemContainerElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    private resizeDetector: ResizeObserverClassDefinition;
    private itemPositions: ItemPosition[];
    private viewportSpan: number = 0;
    private itemContainerSpan: number = 0;
    private maxScroll: number = 0;

    /**
     * Stores last scroll position from scroll events
     */
    private lastRecordedScroll: number = 0;

    /**
     * Delays updating ui during scrolling
     * (to avoid rendering of items that just scroll by)
     */
    private scrollLayoutUpdateTimer: number | null = null;

    /**
     * constructor
     */
    constructor(props: StackPanelProps) {
        super(props);

        this.updateItemPositions();

        this.state = {
            renderedRangeStartIndex: 0,
            renderedRangeEndIndex: 0,
            direction: Direction.ltr,
            isScrollable: false,
        };
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        const {
            stackPanel_items,
        }: StackPanelClassNameContract = this.props.managedClasses;

        return (
            <div
                {...this.unhandledProps()}
                ref={this.rootElement}
                className={this.generateClassNames()}
                onScrollCapture={this.onScrollCapture}
                tabIndex={-1}
            >
                <div
                    className={classNames(stackPanel_items)}
                    ref={this.itemContainerElement}
                    style={{
                        position: "relative",
                        ...(this.props.orientation === Orientation.horizontal
                            ? {
                                  height: "100%",
                                  width: `${this.itemContainerSpan}px`,
                                  overflow: "hidden",
                              }
                            : {
                                  width: "100%",
                                  height: `${this.itemContainerSpan}px`,
                                  overflow: "hidden",
                              }),
                    }}
                >
                    {this.renderItems()}
                </div>
            </div>
        );
    }

    /**
     * React life-cycle method
     */
    public componentDidMount(): void {
        // set up resize observer so we can update layout when component is resized
        if (!isNil(this.rootElement.current)) {
            if (((window as unknown) as WindowWithResizeObserver).ResizeObserver) {
                this.resizeDetector = new ((window as unknown) as WindowWithResizeObserver).ResizeObserver(
                    this.handleResize
                );
                this.resizeDetector.observe(this.rootElement.current);
            }
        }

        this.viewportSpan = this.getViewportSpan();
        this.updateLayout();

        // if we need to have a particular child scrolled into view on mount do so
        if (
            !isNil(this.props.initiallyVisibleItemIndex) &&
            this.itemPositions.length > this.props.initiallyVisibleItemIndex
        ) {
            const newScrollPosition: number = this.getScrollIntoViewPosition(
                this.props.initiallyVisibleItemIndex
            );
            this.setScrollPosition(newScrollPosition);
        }
    }

    /**
     * React life-cycle method
     */
    public componentDidUpdate(prevProps: StackPanelProps): void {
        if (prevProps.orientation !== this.props.orientation) {
            this.viewportSpan = this.getViewportSpan();
        }

        if (
            prevProps.itemSpan !== this.props.itemSpan ||
            prevProps.orientation !== this.props.orientation ||
            prevProps.children !== this.props.children
        ) {
            this.updateItemPositions();
            this.updateLayout();
        }

        // if the initiallyVisibleItemIndex prop is changed to a non-null value
        // after initial mount we scroll to that position
        if (
            prevProps.initiallyVisibleItemIndex !==
                this.props.initiallyVisibleItemIndex &&
            !isNil(this.props.initiallyVisibleItemIndex) &&
            this.itemPositions.length > this.props.initiallyVisibleItemIndex
        ) {
            const newScrollPosition: number = this.getScrollIntoViewPosition(
                this.props.initiallyVisibleItemIndex
            );
            this.scrollContent(newScrollPosition);
        }
    }

    /**
     * React life-cycle method
     */
    public componentWillUnmount(): void {
        if (!isNil(this.rootElement.current)) {
            if (((window as unknown) as WindowWithResizeObserver).ResizeObserver) {
                this.resizeDetector.disconnect();
                this.resizeDetector = null;
            }
        }
        window.clearTimeout(this.scrollLayoutUpdateTimer);
    }

    /**
     * Create class-names
     */
    protected generateClassNames(): string {
        const {
            stackPanel,
            stackPanel__scrollable,
        }: StackPanelClassNameContract = this.props.managedClasses;

        return super.generateClassNames(
            classNames(stackPanel, [stackPanel__scrollable, this.state.isScrollable])
        );
    }

    /**
     * Render the items
     */
    private renderItems(): React.ReactFragment[] {
        return React.Children.map(this.props.children, this.renderItem);
    }

    /**
     * Render a single item
     */
    private renderItem = (item: React.ReactNode, index: number): React.ReactChild => {
        if (
            this.props.virtualize &&
            !this.props.neverVirtualizeIndexes.includes(index) &&
            (index < this.state.renderedRangeStartIndex ||
                index > this.state.renderedRangeEndIndex)
        ) {
            return;
        }

        const newStyleProps: React.CSSProperties = {
            position: "absolute",
            ...(this.props.orientation === Orientation.horizontal
                ? {
                      width: toPx(this.itemPositions[index].span),
                      ...(this.state.direction === Direction.ltr
                          ? { left: toPx(this.itemPositions[index].start) }
                          : { right: toPx(this.itemPositions[index].start) }),
                  }
                : {
                      height: toPx(this.itemPositions[index].span),
                      top: toPx(this.itemPositions[index].start),
                  }),
        };

        if (React.isValidElement(item)) {
            const styleProps: React.CSSProperties = get(item.props, "style");
            return React.cloneElement(item as React.ReactElement<any>, {
                style: merge({}, styleProps, newStyleProps),
            });
        }

        // it's a string, so wrap it in a div for positioning
        return <div style={newStyleProps}>{item}</div>;
    };

    /**
     * Builds a list of positioning data for all items
     */
    private updateItemPositions = (): void => {
        const itemPositions: ItemPosition[] = [];
        let currentItemStart: number = 0;
        const childrenAsArray: React.ReactNode[] = React.Children.toArray(
            this.props.children
        );
        const itemCount: number = childrenAsArray.length;

        for (let i: number = 0; i < itemCount; i++) {
            const itemSpan: number = Array.isArray(this.props.itemSpan)
                ? this.props.itemSpan[i]
                : this.props.itemSpan;
            const currentItemBottom: number = currentItemStart + itemSpan;
            itemPositions.push({
                span: itemSpan,
                start: currentItemStart,
                end: currentItemBottom,
            });

            currentItemStart = currentItemBottom;
        }

        this.itemPositions = itemPositions;
        this.itemContainerSpan =
            this.itemPositions.length > 0 ? this.itemPositions[itemCount - 1].end : 0;

        this.maxScroll = this.getMaxScrollDistance();
    };

    /**
     * Gets the maximum distance that can be scrolled
     */
    private getMaxScrollDistance(): number {
        if (this.itemPositions.length === 0) {
            return 0;
        }

        const contentSpan: number = this.itemPositions[this.itemPositions.length - 1].end;
        return contentSpan - this.viewportSpan;
    }

    /**
     *  Get the size of the viewport along the panel's axis
     */
    private getViewportSpan = (): number => {
        if (isNil(this.rootElement.current)) {
            return 0;
        }
        if (this.props.orientation === Orientation.horizontal) {
            return this.rootElement.current.clientWidth;
        } else {
            return this.rootElement.current.clientHeight;
        }
    };

    /**
     * Recalculates the layout
     */
    private updateLayout = (): void => {
        if (isNil(this.rootElement.current) || isNil(this.itemContainerElement.current)) {
            return;
        }

        if (this.props.orientation === Orientation.horizontal) {
            this.updateDirection();
        }

        const scrollPos: number = this.getScrollPosition();
        const lastIndex: number =
            this.itemPositions.length === 0 ? 0 : this.itemPositions.length - 1;

        const visibleRangeStartIndex: number = this.getThresholdItemIndex(
            this.itemPositions,
            0,
            scrollPos
        );
        const visibleRangeEndIndex: number = this.getThresholdItemIndex(
            this.itemPositions,
            visibleRangeStartIndex,
            scrollPos + this.viewportSpan
        );

        const bufferLength: number = this.getBufferLength();

        window.clearTimeout(this.scrollLayoutUpdateTimer);

        this.setState({
            renderedRangeStartIndex: Math.max(visibleRangeStartIndex - bufferLength, 0),
            renderedRangeEndIndex: Math.min(
                visibleRangeEndIndex + bufferLength,
                lastIndex
            ),
            isScrollable: this.itemContainerSpan > this.viewportSpan,
        });
    };

    /**
     * gets the first row where the row bottom exceeds the threshold value
     * returns final item index if no rows reach threshold value
     */
    private getThresholdItemIndex = (
        itemPositions: ItemPosition[],
        startIndex: number,
        threshold: number
    ): number => {
        if (itemPositions.length === 0) {
            return 0;
        }
        let thresholdIndex: number = itemPositions.length - 1;
        for (
            let i: number = startIndex, rowCount: number = itemPositions.length;
            i < rowCount;
            i++
        ) {
            const thisItemPosition: ItemPosition = itemPositions[i];
            if (thisItemPosition.end >= threshold) {
                thresholdIndex = i;
                break;
            }
        }
        return thresholdIndex;
    };

    /**
     * gets the current buffer size (number of items to render outside the viewport)
     */
    private getBufferLength = (): number => {
        if (!isNil(this.props.preloadBufferCount) && this.props.preloadBufferCount >= 0) {
            return Math.floor(this.props.preloadBufferCount);
        }

        return 1;
    };

    /**
     *  Handle scroll events
     */
    private onScrollCapture = (): void => {
        this.lastRecordedScroll = this.getScrollPosition();
        clearTimeout(this.scrollLayoutUpdateTimer);
        if (this.props.scrollLayoutUpdateDelay !== 0) {
            this.scrollLayoutUpdateTimer = window.setTimeout((): void => {
                this.updateLayout();
            }, this.props.scrollLayoutUpdateDelay);
        } else {
            this.updateLayout();
        }
        this.reportScrollChange();
    };

    /**
     *  Handle viewport resize events
     */
    private handleResize = (): void => {
        this.viewportSpan = this.getViewportSpan();
        this.reportScrollChange();
        this.updateLayout();
    };

    /**
     *  report scroll changes to callback
     */
    private reportScrollChange = (): void => {
        if (isFunction(this.props.onScrollChange)) {
            this.props.onScrollChange(
                this.lastRecordedScroll,
                this.maxScroll,
                this.viewportSpan
            );
        }
    };

    /**
     *  updates the direction in state if necessary
     */
    private updateDirection = (): void => {
        const newDirection: Direction = this.getDirection();
        if (newDirection !== this.state.direction) {
            this.setState({
                direction: newDirection,
            });
        }
    };

    /**
     *  gets the current direction
     */
    private getDirection = (): Direction => {
        if (this.rootElement.current === null) {
            return Direction.ltr;
        }

        const closest: Element = this.rootElement.current.closest(
            `[${StackPanel.DirectionAttributeName}]`
        );

        return closest === null ||
            closest.getAttribute(StackPanel.DirectionAttributeName) === Direction.ltr
            ? Direction.ltr
            : Direction.rtl;
    };

    /**
     *  Gets the scroll position and accounts for direction
     */
    private getScrollPosition = (): number => {
        if (isNil(this.rootElement.current)) {
            return 0;
        }

        return this.props.orientation === Orientation.vertical
            ? this.rootElement.current.scrollTop
            : this.state.direction === Direction.rtl
            ? RtlScrollConverter.getScrollLeft(
                  this.rootElement.current,
                  this.state.direction
              )
            : -RtlScrollConverter.getScrollLeft(
                  this.rootElement.current,
                  this.state.direction
              );
    };

    /**
     *  Sets the scroll position and accounts for direction
     */
    private setScrollPosition = (scrollValue: number): void => {
        if (isNil(this.rootElement.current)) {
            return;
        }

        if (this.props.orientation === Orientation.vertical) {
            this.rootElement.current.scrollTop = scrollValue;
        } else {
            RtlScrollConverter.setScrollLeft(
                this.rootElement.current,
                this.state.direction === Direction.rtl ? -scrollValue : scrollValue,
                this.state.direction
            );
        }
    };

    /**
     * Scrolls the container for the items list
     */
    private scrollContent(targetScrollPosition: number): void {
        const newScrollPosition: number = Math.max(
            0,
            Math.min(targetScrollPosition, this.maxScroll)
        );

        this.setScrollPosition(newScrollPosition);
        this.updateLayout();
    }

    /**
     * Gets the scroll position that brings the item at a particular index into the viewport
     */
    private getScrollIntoViewPosition = (index: number): number => {
        if (index === -1 || index >= this.itemPositions.length) {
            return 0;
        }

        const itemPosition: ItemPosition = this.itemPositions[index];
        return Math.max(0, Math.min(itemPosition.start, this.maxScroll));
    };
}

export default StackPanel;
export * from "./stack-panel.props";
export { StackPanelClassNameContract };
