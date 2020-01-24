import { StackPanelClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { classNames, Direction, RtlScrollConverter } from "@microsoft/fast-web-utilities";
import { canUseDOM } from "exenv-es6";
import { get, isEqual, isNil, memoize, merge } from "lodash-es";
import React from "react";
import ReactDOM from "react-dom";
import { toPx } from "@microsoft/fast-jss-utilities";
import {
    DisplayNamePrefix,
    IntersectionObserverEntry,
    ResizeObserverClassDefinition,
    ResizeObserverEntry,
} from "../utilities";
import {
    StackPanelHandledProps,
    stackPanelOrientation,
    StackPanelProps,
    StackPanelUnhandledProps,
} from "./stack-panel.props";
import { isFunction } from "util";

export interface StackPanelState {
    isScrolling: boolean;
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
        defaultItemSpan: 100,
        preloadBufferLength: 1,
        orientation: stackPanelOrientation.vertical,
        nextItemPeek: 50,
        itemSpanOverrides: {},
        enableSmoothScrolling: true,
        scrollDuration: 500,
    };

    private static DirectionAttributeName: string = "dir";

    protected handledProps: HandledProps<StackPanelHandledProps> = {
        nextItemPeek: void 0,
        defaultItemSpan: void 0,
        virtualize: void 0,
        neverVirtualizeIndexes: void 0,
        itemSpanOverrides: void 0,
        preloadBufferLength: void 0,
        orientation: void 0,
        enableSmoothScrolling: void 0,
        scrollDuration: void 0,
        managedClasses: void 0,
        initiallyVisibleItemIndex: void 0,
        onRenderedRangeChange: void 0,
        onScrollChange: void 0,
    };

    private rootElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    private itemContainerElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    private openRequestAnimationFrame: number = null;
    private resizeDetector: ResizeObserverClassDefinition;
    private itemPositions: ItemPosition[];
    private viewPortSpan: number = 0;
    private itemContainerSpan: number = 0;

    /**
     *  The position the current scroll animation started at
     */
    private currentScrollAnimStartPosition: number;

    /**
     * The target position of the current scroll animation
     */
    private currentScrollAnimEndPosition: number;

    /**
     * Start time for current scroll animation
     */
    private currentScrollAnimStartTime: number;

    /**
     * Flag indicates if a scroll animation is in progress
     */
    private isScrollAnimating: boolean = false;

    /**
     * Stores last scroll position from scroll events
     */
    private lastRecordedScroll: number = 0;

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
            isScrolling: false,
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
            >
                <div
                    className={classNames(stackPanel_items)}
                    ref={this.itemContainerElement}
                    style={{
                        position: "relative",
                        ...(this.props.orientation === stackPanelOrientation.horizontal
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
        if (!isNil(this.rootElement.current)) {
            if (((window as unknown) as WindowWithResizeObserver).ResizeObserver) {
                this.resizeDetector = new ((window as unknown) as WindowWithResizeObserver).ResizeObserver(
                    this.handleResize
                );
                this.resizeDetector.observe(this.rootElement.current);
            }
        }

        this.viewPortSpan = this.getViewportSpan();

        if (
            !isNil(this.props.initiallyVisibleItemIndex) &&
            this.itemPositions.length > this.props.initiallyVisibleItemIndex
        ) {
            const newScrollPosition: number = this.getScrollIntoViewPosition(
                this.props.initiallyVisibleItemIndex
            );
            this.setScrollPosition(newScrollPosition);
        }

        this.updateLayout();
    }

    /**
     * React life-cycle method
     */
    public componentDidUpdate(prevProps: StackPanelProps): void {
        if (prevProps.orientation !== this.props.orientation) {
            this.viewPortSpan = this.getViewportSpan();
        }

        if (
            prevProps.itemSpanOverrides !== this.props.itemSpanOverrides ||
            prevProps.defaultItemSpan !== this.props.defaultItemSpan ||
            prevProps.orientation !== this.props.orientation ||
            prevProps.children !== this.props.children
        ) {
            this.updateItemPositions();
            this.updateLayout();
        }

        if (
            prevProps.initiallyVisibleItemIndex !==
                this.props.initiallyVisibleItemIndex &&
            !isNil(this.props.initiallyVisibleItemIndex) &&
            this.itemPositions.length > this.props.initiallyVisibleItemIndex
        ) {
            const newScrollPosition: number = this.getScrollIntoViewPosition(
                this.props.initiallyVisibleItemIndex
            );
            this.scrollContent(this.getScrollPosition(), newScrollPosition);
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
    }

    /**
     * Create class-names
     */
    protected generateClassNames(): string {
        const {
            stackPanel,
            stackPanel__isScrolling,
        }: StackPanelClassNameContract = this.props.managedClasses;

        return super.generateClassNames(
            classNames(stackPanel, [stackPanel__isScrolling, this.state.isScrolling])
        );
    }

    /**
     * Render the items
     */
    private renderItems(): React.ReactFragment[] {
        return React.Children.map(this.props.children, this.renderItem);
    }

    private isClonableElement(node: React.ReactNode): node is React.ReactElement<any> {
        return React.isValidElement(node);
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
            ...(this.props.orientation === stackPanelOrientation.horizontal
                ? {
                      width: toPx(this.itemPositions[index].span),
                      left: toPx(this.itemPositions[index].start),
                  }
                : {
                      height: toPx(this.itemPositions[index].span),
                      top: toPx(this.itemPositions[index].start),
                  }),
        };

        if (this.isClonableElement(item)) {
            const styleProps: React.CSSProperties = get(item.props, "style");
            return React.cloneElement(item, {
                onFocusCapture: this.onItemFocus,
                style: merge({}, styleProps, newStyleProps),
            });
        }

        // it's a string, so wrap it in a div for positioning
        return (
            <div onFocusCapture={this.onItemFocus} style={newStyleProps}>
                {item}
            </div>
        );
    };

    /**
     * Builds a list of positioning data for all items
     */
    private updateItemPositions = (): void => {
        const itemPositions: ItemPosition[] = [];
        let currentItemTop: number = 0;
        const childrenAsArray: React.ReactNode[] = React.Children.toArray(
            this.props.children
        );
        const itemCount: number = childrenAsArray.length;
        const keys: string[] = Object.keys(this.props.itemSpanOverrides);

        for (let i: number = 0; i < itemCount; i++) {
            const itemKey: string = i.toString();
            const itemHeight: number = keys.includes(itemKey)
                ? this.props.itemSpanOverrides[itemKey]
                : this.props.defaultItemSpan;
            const itemBottom: number = currentItemTop + itemHeight;
            itemPositions.push({
                span: itemHeight,
                start: currentItemTop,
                end: itemBottom,
            });

            currentItemTop = itemBottom;
        }

        this.itemPositions = itemPositions;
        this.itemContainerSpan =
            this.itemPositions.length > 0 ? this.itemPositions[itemCount - 1].end : 0;
    };

    /**
     *  Get the size of the viewport along the panel's axis
     */
    private getViewportSpan = (): number => {
        if (isNil(this.rootElement.current)) {
            return 0;
        }
        if (this.props.orientation === stackPanelOrientation.horizontal) {
            return this.rootElement.current.clientWidth;
        } else {
            return this.rootElement.current.clientHeight;
        }
    };

    /**
     * Request's an animation frame if there are currently no open animation frame requests
     */
    private requestFrame = (): void => {
        if (this.openRequestAnimationFrame === null) {
            this.openRequestAnimationFrame = window.requestAnimationFrame(
                this.gotAnimationFrame
            );
        }
    };

    /**
     * Got an animation frame
     */
    private gotAnimationFrame = (): void => {
        this.openRequestAnimationFrame = null;
        this.updateLayout();
        if (this.isScrollAnimating) {
            this.updateScrollAnimation();
        }
    };

    /**
     * Recalculates the layout
     */
    private updateLayout = (): void => {
        if (isNil(this.rootElement.current) || isNil(this.itemContainerElement.current)) {
            return;
        }

        if (this.props.orientation === stackPanelOrientation.horizontal) {
            this.updateDirection();
        }

        const scrollPos: number = this.getScrollPosition();
        const lastIndex: number =
            this.itemPositions.length === 0 ? 0 : this.itemPositions.length - 1;

        const effectiveViewportSpan: number =
            this.viewPortSpan >= this.props.defaultItemSpan
                ? this.viewPortSpan
                : this.props.defaultItemSpan;

        const visibleRangeStartIndex: number = this.getThresholdItemIndex(
            this.itemPositions,
            0,
            scrollPos
        );
        const visibleRangeEndIndex: number = this.getThresholdItemIndex(
            this.itemPositions,
            visibleRangeStartIndex,
            scrollPos + effectiveViewportSpan
        );

        const bufferLength: number = this.getBufferLength();

        let renderStartIndex: number = visibleRangeStartIndex - bufferLength;
        if (renderStartIndex < 0) {
            renderStartIndex = 0;
        }

        let renderEndIndex: number = visibleRangeEndIndex + bufferLength;
        if (renderEndIndex > lastIndex) {
            renderEndIndex = lastIndex;
        }

        if (isFunction(this.props.onRenderedRangeChange)) {
            this.props.onRenderedRangeChange(renderStartIndex, renderEndIndex);
        }

        this.setState({
            renderedRangeStartIndex: renderStartIndex,
            renderedRangeEndIndex: renderEndIndex,
            isScrolling: this.itemContainerSpan > this.viewPortSpan ? true : false,
        });
    };

    /**
     *  Animate one frame of scrolling
     */
    private updateScrollAnimation = (): void => {
        const currentDate: number = new Date().getTime();
        const currentTime: number = currentDate - this.currentScrollAnimStartTime;

        this.setScrollPosition(
            this.getScrollAnimationPosition(currentTime, this.props.scrollDuration)
        );

        if (currentTime < this.props.scrollDuration) {
            this.requestFrame();
        } else {
            this.isScrollAnimating = false;
        }
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
        if (
            !isNil(this.props.preloadBufferLength) &&
            this.props.preloadBufferLength >= 0
        ) {
            return Math.floor(this.props.preloadBufferLength);
        }

        if (!isNil(this.rootElement) && !isNil(this.rootElement.current)) {
            // one page is default
            const bufferSize: number = Math.ceil(
                this.viewPortSpan / this.props.defaultItemSpan
            );
            return bufferSize > 1 ? bufferSize : 1;
        }

        return 1;
    };

    /**
     *  Handle scroll events
     */
    private onScrollCapture = (): void => {
        this.lastRecordedScroll = this.getScrollPosition();
        this.requestFrame();
        if (isFunction(this.props.onScrollChange)) {
            // TODO: store max scroll so we don't recalc
            this.props.onScrollChange(
                this.lastRecordedScroll,
                this.getMaxScrollDistance()
            );
        }
    };

    /**
     *  Handle viewport resize events
     */
    private handleResize = (entries: ResizeObserverEntry[]): void => {
        this.viewPortSpan = this.getViewportSpan();
        this.requestFrame();
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
    private getDirection = (): Direction | null => {
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

        let scrollPos: number = 0;

        if (this.props.orientation === stackPanelOrientation.vertical) {
            scrollPos = this.rootElement.current.scrollTop;
        } else {
            scrollPos = RtlScrollConverter.getScrollLeft(
                this.rootElement.current,
                this.state.direction
            );
            scrollPos = this.state.direction === Direction.rtl ? -scrollPos : scrollPos;
        }

        return scrollPos;
    };

    /**
     *  Sets the scroll position and accounts for direction
     */
    private setScrollPosition = (scrollValue: number): void => {
        if (isNil(this.rootElement.current)) {
            return;
        }

        if (this.props.orientation === stackPanelOrientation.vertical) {
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
     *  Compares viewport, item and desired peek value to come up with
     *  peek value to use. We don't want to clip focused item to get peek on next/previous item.
     */
    private getScrollPeek = (itemSpan: number): number => {
        let maxPeek: number = this.viewPortSpan - itemSpan;
        maxPeek = maxPeek < 0 ? 0 : maxPeek;

        const peek: number =
            this.props.nextItemPeek > maxPeek ? maxPeek : this.props.nextItemPeek;

        return peek;
    };

    /**
     * A child item got focus
     */
    private onItemFocus = (event: React.FocusEvent): void => {
        if (!this.state.isScrolling || !this.props.enableSmoothScrolling) {
            return;
        }

        // smooth scroll into view
        const itemStart: number =
            this.props.orientation === stackPanelOrientation.horizontal
                ? (event.currentTarget as HTMLElement).offsetLeft
                : (event.currentTarget as HTMLElement).offsetTop;

        const itemSpan: number =
            this.props.orientation === stackPanelOrientation.horizontal
                ? (event.currentTarget as HTMLElement).clientWidth
                : (event.currentTarget as HTMLElement).clientHeight;
        const itemEnd: number = itemStart + itemSpan;

        const peek: number = this.getScrollPeek(itemSpan);

        let scrollStart: number = this.lastRecordedScroll;

        if (this.isScrollAnimating) {
            const duration: number = this.props.scrollDuration;
            const currentDate: number = new Date().getTime();
            const currentTime: number = currentDate - this.currentScrollAnimStartTime;

            scrollStart = this.getScrollAnimationPosition(currentTime, duration);
        }

        if (itemStart - this.lastRecordedScroll < 0) {
            this.scrollContent(scrollStart, itemStart - peek);
        } else if (itemEnd - scrollStart > this.viewPortSpan) {
            this.scrollContent(scrollStart, itemEnd - this.viewPortSpan + peek);
        }
    };

    /**
     * Scrolls the container for the items list
     */
    private scrollContent(
        startScrollPosition: number,
        targetScrollPosition: number
    ): void {
        const newScrollPosition: number = Math.max(
            0,
            Math.min(targetScrollPosition, this.getMaxScrollDistance())
        );

        if (this.props.enableSmoothScrolling) {
            this.isScrollAnimating = true;
            this.currentScrollAnimStartPosition = startScrollPosition;
            this.currentScrollAnimEndPosition = newScrollPosition;
            this.currentScrollAnimStartTime = new Date().getTime();
            this.requestFrame();
        } else {
            this.isScrollAnimating = false;
            this.setScrollPosition(newScrollPosition);
        }
    }

    /**
     * Easing animation
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
     * Gets the maximum distance that can be scrolled
     */
    private getMaxScrollDistance(): number {
        if (this.itemPositions.length === 0) {
            return 0;
        }

        const contentSpan: number = this.itemPositions[this.itemPositions.length - 1].end;
        return contentSpan - this.viewPortSpan;
    }

    /**
     *  get scroll animation position for the provided time
     */
    private getScrollAnimationPosition = (
        currentTime: number,
        duration: number
    ): number => {
        if (currentTime < duration) {
            return this.easeInOutQuad(
                currentTime,
                this.currentScrollAnimStartPosition,
                this.currentScrollAnimEndPosition - this.currentScrollAnimStartPosition,
                duration
            );
        } else {
            return this.currentScrollAnimEndPosition;
        }
    };

    /**
     * Gets the scroll position that brings the item at a particular index into the viewport
     * (including peek)
     */
    private getScrollIntoViewPosition = (index: number): number => {
        if (index >= this.itemPositions.length) {
            return 0;
        }

        const itemPosition: ItemPosition = this.itemPositions[index];
        const peek: number = this.getScrollPeek(itemPosition.span);
        const newScrollPosition: number = Math.max(
            0,
            Math.min(itemPosition.start - peek, this.getMaxScrollDistance())
        );
        return newScrollPosition;
    };
}

export default StackPanel;
export * from "./stack-panel.props";
export { StackPanelClassNameContract };
