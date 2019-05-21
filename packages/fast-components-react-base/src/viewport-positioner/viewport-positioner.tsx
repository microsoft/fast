import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { get, isNil } from "lodash-es";
import { ViewportPositionerClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import {
    AxisPositioningMode,
    HorizontalPosition,
    VerticalPosition,
    ViewportPositionerHandledProps,
    ViewportPositionerProps,
    ViewportPositionerUnhandledProps,
} from "./viewport-positioner.props";
import {
    IntersectionObserverClassDefinition,
    IntersectionObserverEntry,
    ResizeObserverClassDefinition,
    ResizeObserverEntry,
} from "../utilities";
import { DisplayNamePrefix } from "../utilities";
import { canUseDOM } from "exenv-es6";

export interface ViewportPositionerState {
    disabled: boolean;
    noOberverMode: boolean;
    xTransformOrigin: string;
    yTransformOrigin: string;
    xTranslate: number;
    yTranslate: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
    currentVerticalPosition: VerticalPosition;
    currentHorizontalPosition: HorizontalPosition;

    initialLayoutComplete: boolean;
}

class ViewportPositioner extends Foundation<
    ViewportPositionerHandledProps,
    ViewportPositionerUnhandledProps,
    ViewportPositionerState
> {
    public static displayName: string = `${DisplayNamePrefix}ViewportPositioner`;

    public static defaultProps: Partial<ViewportPositionerProps> = {
        horizontalPositioningMode: AxisPositioningMode.uncontrolled,
        defaultHorizontalPosition: HorizontalPosition.uncontrolled,
        verticalPositioningMode: AxisPositioningMode.uncontrolled,
        defaultVerticalPosition: VerticalPosition.uncontrolled,
        horizontalAlwaysInView: false,
        verticalAlwaysInView: false,
        fixedAfterInitialPlacement: false,
    };

    protected handledProps: HandledProps<ViewportPositionerHandledProps> = {
        managedClasses: void 0,
        anchor: void 0,
        viewport: void 0,
        horizontalPositioningMode: void 0,
        defaultHorizontalPosition: void 0,
        horizontalThreshold: void 0,
        horizontalAlwaysInView: void 0,
        verticalPositioningMode: void 0,
        defaultVerticalPosition: void 0,
        verticalThreshold: void 0,
        verticalAlwaysInView: void 0,
        fixedAfterInitialPlacement: void 0,
        disabled: void 0,
    };

    private rootElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    private openRequestAnimationFrame: number = null;

    /**
     * Throttle resize request animation frame usage
     */
    // private throttledResize: throttle;

    private collisionDetector: IntersectionObserver;
    private resizeDetector: ResizeObserverClassDefinition;

    private viewportRect: ClientRect | DOMRect;
    private positionerRect: ClientRect | DOMRect;
    private anchorTop: number = 0;
    private anchorRight: number = 0;
    private anchorBottom: number = 0;
    private anchorLeft: number = 0;
    private anchorHeight: number = 0;
    private anchorWidth: number = 0;

    private scrollTop: number = 0;
    private scrollLeft: number = 0;

    /**
     * constructor
     */
    constructor(props: ViewportPositionerProps) {
        super(props);

        this.state = {
            disabled: true,
            noOberverMode: false,
            xTransformOrigin: "left",
            yTransformOrigin: "top",
            xTranslate: 0,
            yTranslate: 0,
            top: null,
            right: null,
            bottom: null,
            left: null,
            currentHorizontalPosition: HorizontalPosition.uncontrolled,
            currentVerticalPosition: VerticalPosition.uncontrolled,
            initialLayoutComplete: false,
        };
    }

    public componentDidMount(): void {
        this.checkComponentConfig();
        this.requestFrame();
    }

    public componentWillUnmount(): void {
        this.disableComponent();
    }

    public componentDidUpdate(prevProps: ViewportPositionerProps): void {
        if (
            isNil(prevProps.anchor) !== isNil(this.props.anchor) ||
            isNil(prevProps.viewport) !== isNil(this.props.viewport) ||
            prevProps.disabled !== this.props.disabled
        ) {
            this.checkComponentConfig();
        }
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div
                ref={this.rootElement}
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                style={this.getPositioningStyles()}
            >
                {this.props.children}
            </div>
        );
    }

    /**
     * Create class-names
     */
    protected generateClassNames(): string {
        let classNames: string = get(this.props, "managedClasses.viewportPositioner", "");

        switch (this.state.currentHorizontalPosition) {
            case HorizontalPosition.left:
                classNames = classNames.concat(
                    " ",
                    get(this.props.managedClasses, "viewportPositioner__left", "")
                );
                break;

            case HorizontalPosition.centerLeft:
                classNames = classNames.concat(
                    " ",
                    get(this.props.managedClasses, "viewportPositioner__centerLeft", "")
                );
                break;

            case HorizontalPosition.centerRight:
                classNames = classNames.concat(
                    " ",
                    get(this.props.managedClasses, "viewportPositioner__centerRight", "")
                );
                break;

            case HorizontalPosition.right:
                classNames = classNames.concat(
                    " ",
                    get(this.props.managedClasses, "viewportPositioner__right", "")
                );
                break;
        }

        switch (this.state.currentVerticalPosition) {
            case VerticalPosition.top:
                classNames = classNames.concat(
                    " ",
                    get(this.props.managedClasses, "viewportPositioner__top", "")
                );
                break;

            case VerticalPosition.middleTop:
                classNames = classNames.concat(
                    " ",
                    get(this.props.managedClasses, "viewportPositioner__middleTop", "")
                );
                break;

            case VerticalPosition.middleBottom:
                classNames = classNames.concat(
                    " ",
                    get(this.props.managedClasses, "viewportPositioner__middleBottom", "")
                );
                break;

            case VerticalPosition.bottom:
                classNames = classNames.concat(
                    " ",
                    get(this.props.managedClasses, "viewportPositioner__bottom", "")
                );
                break;
        }

        return super.generateClassNames(classNames);
    }

    /**
     *  gets the CSS classes to be programmatically applied to the component
     */
    private getPositioningStyles = (): {} => {
        // determine if we should hide the positioner because we don't have data to position it yet
        // (avoiding flicker)
        let shouldHide: boolean = false;
        if (this.state.disabled) {
            if (
                (this.props.disabled === undefined || this.props.disabled === false) &&
                isNil(this.positionerRect) &&
                !isNil(this.props.anchor)
            ) {
                shouldHide = true;
            }
        } else if (isNil(this.positionerRect) && !this.state.noOberverMode) {
            shouldHide = true;
        }

        return {
            opacity: shouldHide ? 0 : undefined,
            position: "relative",
            transformOrigin: `${this.state.xTransformOrigin} ${
                this.state.yTransformOrigin
            }`,
            transform: `translate(
                ${Math.floor(this.state.xTranslate)}px, 
                ${Math.floor(this.state.yTranslate)}px
            )`,
            top: this.state.top === null ? null : `${this.state.top}px`,
            right: this.state.right === null ? null : `${this.state.right}px`,
            bottom: this.state.bottom === null ? null : `${this.state.bottom}px`,
            left: this.state.left === null ? null : `${this.state.left}px`,
        };
    };

    /**
     *  Checks whether component should be disabled or not
     */
    private checkComponentConfig = (): void => {
        if (!canUseDOM() || this.props.disabled === true || isNil(this.props.anchor)) {
            this.disableComponent();
            return;
        }
        this.enableComponent();
    };

    /**
     *  Enable the component
     */
    private enableComponent = (): void => {
        if (
            !this.state.disabled ||
            this.props.disabled ||
            this.props.anchor === undefined ||
            isNil(this.rootElement.current)
        ) {
            return;
        }

        if (
            !(window as WindowWithIntersectionObserver).IntersectionObserver ||
            !(window as WindowWithResizeObserver).ResizeObserver
        ) {
            this.setNoObserverMode();
            return;
        }

        this.setState({
            disabled: false,
            noOberverMode: false,
        });

        this.collisionDetector = new (window as WindowWithIntersectionObserver).IntersectionObserver(
            this.handleCollision,
            {
                root:
                    this.props.viewport !== undefined &&
                    this.props.viewport.current !== null
                        ? this.props.viewport.current
                        : null,
                rootMargin: "0px",
                threshold: [0, 1],
            }
        );
        this.collisionDetector.observe(this.rootElement.current);
        this.collisionDetector.observe(this.props.anchor.current);

        this.resizeDetector = new (window as WindowWithResizeObserver).ResizeObserver(
            this.handleAnchorResize
        );
        this.resizeDetector.observe(this.props.anchor.current);

        this.props.viewport !== undefined && this.props.viewport.current !== null
            ? this.props.viewport.current.addEventListener("scroll", this.handleScroll)
            : document.addEventListener("scroll", this.handleScroll);
    };

    /**
     *  Disable the component
     */
    private setNoObserverMode = (): void => {
        // observers not supported so the best we do is try to set the default position if there is one
        this.positionerRect = {
            top: 0,
            right: this.rootElement.current.clientHeight,
            bottom: this.rootElement.current.clientHeight,
            left: 0,
            height: this.rootElement.current.clientHeight,
            width: this.rootElement.current.clientHeight,
        };

        if (this.props.horizontalPositioningMode !== AxisPositioningMode.uncontrolled) {
            const horizontalPositions: HorizontalPosition[] = this.getHorizontalPositioningOptions();
            if (
                this.props.defaultHorizontalPosition !== undefined &&
                horizontalPositions.indexOf(this.props.defaultHorizontalPosition) !== -1
            ) {
                this.applyBaseHorizontalPositioningState(
                    this.props.defaultHorizontalPosition
                );
            } else {
                this.applyBaseHorizontalPositioningState(horizontalPositions[0]);
            }
        }

        if (this.props.verticalPositioningMode !== AxisPositioningMode.uncontrolled) {
            const verticalPositions: VerticalPosition[] = this.getVerticalPositioningOptions();
            if (
                this.props.defaultVerticalPosition !== undefined &&
                verticalPositions.indexOf(this.props.defaultVerticalPosition) !== -1
            ) {
                this.applyBaseVerticalPositioningState(
                    this.props.defaultVerticalPosition
                );
            } else {
                this.applyBaseVerticalPositioningState(verticalPositions[0]);
            }
        }

        this.setState({
            disabled: false,
            noOberverMode: true,
        });
    };

    /**
     *  Disable the component
     */
    private disableComponent = (): void => {
        if (this.state.disabled) {
            return;
        }
        this.setState({
            disabled: true,
        });

        if (!this.state.noOberverMode) {
            if (
                this.collisionDetector &&
                typeof this.collisionDetector.disconnect === "function"
            ) {
                this.collisionDetector.unobserve(this.rootElement.current);
                this.collisionDetector.unobserve(this.props.anchor.current);
                this.collisionDetector.disconnect();
                this.collisionDetector = null;
            }

            // TODO #1142 https://github.com/Microsoft/fast-dna/issues/1142
            // Full browser support imminent
            // Revisit usage once Safari and Firefox adapt
            // https://bugzilla.mozilla.org/show_bug.cgi?id=1272409
            // https://bugs.webkit.org/show_bug.cgi?id=157743
            if (
                this.resizeDetector &&
                typeof this.resizeDetector.disconnect === "function"
            ) {
                this.resizeDetector.unobserve(this.props.anchor.current);
                this.resizeDetector.disconnect();
                this.resizeDetector = null;
            }

            this.props.viewport !== undefined && this.props.viewport.current !== null
                ? this.props.viewport.current.addEventListener(
                      "scroll",
                      this.handleScroll
                  )
                : document.addEventListener("scroll", this.handleScroll);
        }
    };

    /**
     *  Get available Horizontal positions based on positioning mode
     */
    private getHorizontalPositioningOptions = (): HorizontalPosition[] => {
        switch (this.props.horizontalPositioningMode) {
            case AxisPositioningMode.flipInward:
                return [HorizontalPosition.centerLeft, HorizontalPosition.centerRight];

            case AxisPositioningMode.flipOutward:
                return [HorizontalPosition.left, HorizontalPosition.right];
        }
    };

    /**
     * Get available Vertical positions based on positioning mode
     */
    private getVerticalPositioningOptions = (): VerticalPosition[] => {
        switch (this.props.verticalPositioningMode) {
            case AxisPositioningMode.flipInward:
                return [VerticalPosition.middleTop, VerticalPosition.middleBottom];

            case AxisPositioningMode.flipOutward:
                return [VerticalPosition.top, VerticalPosition.bottom];
        }
    };

    /**
     *  Get the width available for a particular horizontal position
     */
    private getOptionWidth = (positionOption: HorizontalPosition): number => {
        const spaceLeft: number = this.anchorLeft - this.viewportRect.left;
        const spaceRight: number =
            this.viewportRect.right - (this.anchorLeft + this.anchorWidth);

        switch (positionOption) {
            case HorizontalPosition.left:
                return spaceLeft;
            case HorizontalPosition.centerLeft:
                return spaceLeft + this.anchorWidth;
            case HorizontalPosition.centerRight:
                return spaceRight + this.anchorWidth;
            case HorizontalPosition.right:
                return spaceRight;
        }
    };

    /**
     *  Get the height available for a particular vertical position
     */
    private getOptionHeight = (positionOption: VerticalPosition): number => {
        const spaceAbove: number = this.anchorTop - this.viewportRect.top;
        const spaceBelow: number =
            this.viewportRect.bottom - (this.anchorTop + this.anchorHeight);

        switch (positionOption) {
            case VerticalPosition.top:
                return spaceAbove;
            case VerticalPosition.middleTop:
                return spaceAbove + this.anchorHeight;
            case VerticalPosition.middleBottom:
                return spaceBelow + this.anchorHeight;
            case VerticalPosition.bottom:
                return spaceBelow;
        }
    };

    /**
     *  Handle scroll events
     */
    private handleScroll = (): void => {
        this.requestFrame();
    };

    /**
     *  Handle anchor resize events
     */
    private handleAnchorResize = (entries: ResizeObserverEntry[]): void => {
        const entry: ResizeObserverEntry = entries[0];
        this.anchorHeight = entry.contentRect.height;
        this.anchorWidth = entry.contentRect.width;

        if (this.state.currentVerticalPosition === VerticalPosition.top) {
            this.anchorBottom = this.anchorTop + this.anchorHeight;
        } else {
            this.anchorTop = this.anchorBottom - this.anchorHeight;
        }

        if (this.state.currentHorizontalPosition === HorizontalPosition.left) {
            this.anchorRight = this.anchorLeft + this.anchorWidth;
        } else {
            this.anchorLeft = this.anchorRight - this.anchorWidth;
        }

        this.requestFrame();
    };

    /**
     *  Handle collisions
     */
    private handleCollision = (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
    ): void => {
        entries.forEach((entry: IntersectionObserverEntry) => {
            if (entry.target === this.rootElement.current) {
                this.processPositionerCollision(entry);
            } else {
                this.processAnchorCollision(entry);
            }
        });

        this.scrollTop =
            this.props.viewport !== undefined
                ? this.props.viewport.current.scrollTop
                : document.scrollingElement.scrollTop;

        this.scrollLeft =
            this.props.viewport !== undefined
                ? this.props.viewport.current.scrollLeft
                : document.scrollingElement.scrollLeft;

        this.requestFrame();
    };

    /**
     *  Update data based on anchor collisions
     */
    private processAnchorCollision = (anchorEntry: IntersectionObserverEntry): void => {
        this.viewportRect = anchorEntry.rootBounds;
        this.anchorTop = anchorEntry.boundingClientRect.top;
        this.anchorRight = anchorEntry.boundingClientRect.right;
        this.anchorBottom = anchorEntry.boundingClientRect.bottom;
        this.anchorHeight = anchorEntry.boundingClientRect.height;
        this.anchorWidth = anchorEntry.boundingClientRect.width;
    };

    /**
     *  Update data based on positioner collisions
     */
    private processPositionerCollision = (
        positionerEntry: IntersectionObserverEntry
    ): void => {
        this.viewportRect = positionerEntry.rootBounds;
        this.positionerRect = positionerEntry.boundingClientRect;

        switch (this.state.currentVerticalPosition) {
            case VerticalPosition.top:
                this.anchorTop = this.positionerRect.bottom - this.state.yTranslate;
                this.anchorBottom = this.anchorTop + this.anchorHeight;
                break;

            case VerticalPosition.middleTop:
                this.anchorBottom = this.positionerRect.bottom - this.state.yTranslate;
                this.anchorTop = this.anchorBottom - this.anchorHeight;
                break;

            case VerticalPosition.middleBottom:
                this.anchorTop = this.positionerRect.top - this.state.yTranslate;
                this.anchorBottom = this.anchorTop + this.anchorHeight;
                break;

            case VerticalPosition.bottom:
                this.anchorBottom = this.positionerRect.top - this.state.yTranslate;
                this.anchorTop = this.anchorBottom - this.anchorHeight;
                break;
        }

        switch (this.state.currentHorizontalPosition) {
            case HorizontalPosition.left:
                this.anchorLeft = this.positionerRect.right - this.state.xTranslate;
                this.anchorRight = this.anchorLeft + this.anchorWidth;
                break;

            case HorizontalPosition.centerLeft:
                this.anchorRight = this.positionerRect.right - this.state.xTranslate;
                this.anchorLeft = this.anchorRight - this.anchorWidth;
                break;

            case HorizontalPosition.centerRight:
                this.anchorLeft = this.positionerRect.left - this.state.xTranslate;
                this.anchorRight = this.anchorLeft + this.anchorWidth;
                break;

            case HorizontalPosition.right:
                this.anchorRight = this.positionerRect.left - this.state.xTranslate;
                this.anchorLeft = this.anchorRight - this.anchorWidth;
                break;
        }
    };

    /**
     * Check for scroll changes in viewport and adjust position data
     */
    private updateForScrolling = (): void => {
        const scrollingContainer: Element = !isNil(this.props.viewport)
            ? this.props.viewport.current
            : document.scrollingElement;

        if (isNil(scrollingContainer) || isNaN(scrollingContainer.scrollTop)) {
            return;
        }

        const scrollTop: number = scrollingContainer.scrollTop;
        const scrollLeft: number = scrollingContainer.scrollLeft;

        if (this.scrollTop !== scrollTop) {
            const verticalScrollDelta: number = this.scrollTop - scrollTop;
            this.scrollTop = scrollTop;
            this.anchorTop = this.anchorTop + verticalScrollDelta;
            this.anchorBottom = this.anchorBottom + verticalScrollDelta;
        }

        if (this.scrollLeft !== scrollLeft) {
            const horizontalScrollDelta: number = this.scrollLeft - scrollLeft;
            this.scrollLeft = scrollLeft;
            this.anchorLeft = this.anchorLeft + horizontalScrollDelta;
            this.anchorRight = this.anchorRight + horizontalScrollDelta;
        }
    };

    /**
     *  Recalculate layout related state values
     */
    private updateLayout = (): void => {
        this.openRequestAnimationFrame = null;
        if (
            this.state.disabled ||
            isNil(this.viewportRect) ||
            isNil(this.positionerRect) ||
            (this.props.fixedAfterInitialPlacement && this.state.initialLayoutComplete)
        ) {
            return;
        }

        this.updateForScrolling();

        let desiredVerticalPosition: VerticalPosition = VerticalPosition.uncontrolled;
        let desiredHorizontalPosition: HorizontalPosition =
            HorizontalPosition.uncontrolled;

        if (this.props.horizontalPositioningMode !== AxisPositioningMode.uncontrolled) {
            const horizontalOptions: HorizontalPosition[] = this.getHorizontalPositioningOptions();

            if (horizontalOptions.indexOf(this.props.defaultHorizontalPosition) !== -1) {
                desiredHorizontalPosition = this.props.defaultHorizontalPosition;
            }

            const horizontalThreshold: number =
                this.props.horizontalThreshold !== undefined
                    ? this.props.horizontalThreshold
                    : this.positionerRect.width;

            if (
                desiredHorizontalPosition === HorizontalPosition.uncontrolled ||
                this.getOptionWidth(desiredHorizontalPosition) < horizontalThreshold
            ) {
                desiredHorizontalPosition =
                    this.getOptionWidth(horizontalOptions[0]) >
                    this.getOptionWidth(horizontalOptions[1])
                        ? horizontalOptions[0]
                        : horizontalOptions[1];
            }

            this.applyBaseHorizontalPositioningState(desiredHorizontalPosition);
        }

        if (this.props.verticalPositioningMode !== AxisPositioningMode.uncontrolled) {
            const verticalOptions: VerticalPosition[] = this.getVerticalPositioningOptions();

            if (verticalOptions.indexOf(this.props.defaultVerticalPosition) !== -1) {
                desiredVerticalPosition = this.props.defaultVerticalPosition;
            }

            const verticalThreshold: number =
                this.props.verticalThreshold !== undefined
                    ? this.props.verticalThreshold
                    : this.positionerRect.height;

            if (
                desiredVerticalPosition === VerticalPosition.uncontrolled ||
                this.getOptionHeight(desiredVerticalPosition) < verticalThreshold
            ) {
                desiredVerticalPosition =
                    this.getOptionHeight(verticalOptions[0]) >
                    this.getOptionHeight(verticalOptions[1])
                        ? verticalOptions[0]
                        : verticalOptions[1];
            }

            this.applyBaseVerticalPositioningState(desiredVerticalPosition);
        }

        this.setState({
            xTranslate: this.calculateHorizontalTranslate(desiredHorizontalPosition),
            yTranslate: this.calculateVerticalTranslate(desiredVerticalPosition),
            initialLayoutComplete: true,
        });
    };

    /**
     * Apply base horizontal positioning state based on desired position
     */
    private applyBaseHorizontalPositioningState = (
        desiredHorizontalPosition: HorizontalPosition
    ): void => {
        let right: number = null;
        let left: number = null;
        let xTransformOrigin: string = "left";

        switch (desiredHorizontalPosition) {
            case HorizontalPosition.left:
                xTransformOrigin = "right";
                right = this.positionerRect.width;
                break;

            case HorizontalPosition.centerLeft:
                xTransformOrigin = "right";
                right = 0;
                break;

            case HorizontalPosition.centerRight:
                xTransformOrigin = "left";
                left = 0;
                break;

            case HorizontalPosition.right:
                xTransformOrigin = "left";
                left = this.anchorWidth;
                break;
        }

        this.setState({
            xTransformOrigin,
            right,
            left,
            currentHorizontalPosition: desiredHorizontalPosition,
        });
    };

    /**
     * Apply base vertical positioning state based on desired position
     */
    private applyBaseVerticalPositioningState = (
        desiredVerticalPosition: VerticalPosition
    ): void => {
        let top: number = null;
        let bottom: number = null;
        let yTransformOrigin: string = "top";

        switch (desiredVerticalPosition) {
            case VerticalPosition.top:
                yTransformOrigin = "bottom";
                bottom = this.positionerRect.height + this.anchorHeight;
                break;

            case VerticalPosition.middleTop:
                yTransformOrigin = "bottom";
                bottom = this.positionerRect.height;
                break;

            case VerticalPosition.middleBottom:
                yTransformOrigin = "top";
                top = -this.anchorHeight;
                break;

            case VerticalPosition.bottom:
                yTransformOrigin = "top";
                top = 0;
                break;
        }
        this.setState({
            yTransformOrigin,
            top,
            bottom,
            currentVerticalPosition: desiredVerticalPosition,
        });
    };

    /**
     *  Calculate horizontal tranlation to keep positioner in view
     */
    private calculateHorizontalTranslate = (
        horizontalPosition: HorizontalPosition
    ): number => {
        if (!this.props.horizontalAlwaysInView) {
            return 0;
        }

        let translate: number = 0;

        switch (horizontalPosition) {
            case HorizontalPosition.left:
                translate = this.viewportRect.right - this.anchorLeft;
                translate = translate < 0 ? translate - 1 : 0;
                break;

            case HorizontalPosition.centerLeft:
                translate = this.viewportRect.right - this.anchorRight;
                translate = translate < 0 ? translate - 1 : 0;
                break;

            case HorizontalPosition.centerRight:
                translate = this.viewportRect.left - this.anchorLeft;
                translate = translate > 0 ? translate + 1 : 0;
                break;

            case HorizontalPosition.right:
                translate = this.viewportRect.left - this.anchorRight;
                translate = translate > 0 ? translate + 1 : 0;
                break;
        }
        return translate;
    };

    /**
     *  Calculate vertical tranlation to keep positioner in view
     */
    private calculateVerticalTranslate = (verticalPosition: VerticalPosition): number => {
        if (!this.props.verticalAlwaysInView) {
            return 0;
        }

        let translate: number = 0;

        switch (verticalPosition) {
            case VerticalPosition.top:
                translate = this.viewportRect.bottom - this.anchorTop;
                translate = translate < 0 ? translate - 1 : 0;
                break;

            case VerticalPosition.middleTop:
                translate = this.viewportRect.bottom - this.anchorBottom;
                translate = translate < 0 ? translate - 1 : 0;
                break;

            case VerticalPosition.middleBottom:
                translate = this.viewportRect.top - this.anchorTop;
                translate = translate < 0 ? 0 : translate + 1;
                break;

            case VerticalPosition.bottom:
                translate = this.viewportRect.top - this.anchorBottom;
                translate = translate < 0 ? 0 : translate + 1;
                break;
        }

        return translate;
    };

    /**
     * Request's an animation frame if there are currently no open animation frame requests
     */
    private requestFrame = (): void => {
        if (this.openRequestAnimationFrame === null && !this.state.disabled) {
            this.openRequestAnimationFrame = window.requestAnimationFrame(
                this.updateLayout
            );
        }
    };
}

export default ViewportPositioner;
export * from "./viewport-positioner.props";
export { ViewportPositionerClassNameContract };
