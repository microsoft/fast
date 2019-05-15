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
import { ResizeObserverClassDefinition } from "../horizontal-overflow/resize-observer";
import { ResizeObserverEntry } from "../horizontal-overflow/resize-observer-entry";
import { DisplayNamePrefix } from "../utilities";
import { canUseDOM } from "exenv-es6";

export interface ViewportPositionerState {
    disabled: boolean;
    transformOrigin: string;
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
        vericalAlwaysInView: false,
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
        vericalAlwaysInView: void 0,
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
    private anchorHeight: number = 0;
    private anchorWidth: number = 0;
    private anchorTop: number = 0;
    private anchorRight: number = 0;
    private anchorBottom: number = 0;
    private anchorLeft: number = 0;

    private scrollTop: number = 0;
    private scrollLeft: number = 0;

    /**
     * constructor
     */
    constructor(props: ViewportPositionerProps) {
        super(props);

        this.state = {
            disabled: true,

            transformOrigin: "",
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
        if (this.state.disabled) {
            if (
                (this.props.disabled === undefined || this.props.disabled === false) &&
                isNil(this.positionerRect) &&
                !isNil(this.props.anchor)
            ) {
                return {
                    position: "relative",
                    opacity: "0",
                };
            }
            return null;
        } else if (isNil(this.positionerRect)) {
            return {
                position: "relative",
                opacity: "0",
            };
        }

        return {
            position: "relative",
            transformOrigin: this.state.transformOrigin,
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
     *  Get available Horizontal positions based on positioning mode
     */
    private getHorizontalPositiontingOptions = (): HorizontalPosition[] => {
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
    private getVerticalPositiontingOptions = (): VerticalPosition[] => {
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
     *  Enable the component
     */
    private enableComponent = (): void => {
        if (!this.state.disabled || this.props.disabled) {
            return;
        }

        this.setState({
            disabled: false,
        });

        this.collisionDetector = new IntersectionObserver(this.handleCollision, {
            root:
                this.props.viewport !== undefined && this.props.viewport.current !== null
                    ? this.props.viewport.current
                    : null,
            rootMargin: "0px",
            threshold: [0, 1],
        });

        this.collisionDetector.observe(this.rootElement.current);
        this.collisionDetector.observe(this.props.anchor.current);

        if ((window as WindowWithResizeObserver).ResizeObserver) {
            this.resizeDetector = new (window as WindowWithResizeObserver).ResizeObserver(
                this.handleAnchorResize
            );
            this.resizeDetector.observe(this.props.anchor.current);
        }

        this.props.viewport !== undefined && this.props.viewport.current !== null
            ? this.props.viewport.current.addEventListener("scroll", this.handleScroll)
            : document.addEventListener("scroll", this.handleScroll);
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
        if (this.openRequestAnimationFrame !== null) {
            window.cancelAnimationFrame(this.openRequestAnimationFrame);
            this.openRequestAnimationFrame = null;
        }

        this.collisionDetector.unobserve(this.rootElement.current);
        this.collisionDetector.unobserve(this.props.anchor.current);
        this.collisionDetector.disconnect();
        this.collisionDetector = null;

        // TODO #1142 https://github.com/Microsoft/fast-dna/issues/1142
        // Full browser support imminent
        // Revisit usage once Safari and Firefox adapt
        // https://bugzilla.mozilla.org/show_bug.cgi?id=1272409
        // https://bugs.webkit.org/show_bug.cgi?id=157743
        if (this.resizeDetector && typeof this.resizeDetector.disconnect === "function") {
            this.resizeDetector.unobserve(this.props.anchor.current);
            this.resizeDetector.disconnect();
            this.resizeDetector = null;
        }

        this.props.viewport !== undefined && this.props.viewport.current !== null
            ? this.props.viewport.current.addEventListener("scroll", this.handleScroll)
            : document.addEventListener("scroll", this.handleScroll);
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
                ? this.props.viewport.current.scrollingElement.scrollTop
                : window.document.scrollingElement.scrollTop;

        this.scrollLeft =
            this.props.viewport !== undefined
                ? this.props.viewport.current.scrollingElement.scrollLeft
                : window.document.scrollingElement.scrollLeft;

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
        const scrollTop: number =
            this.props.viewport !== undefined
                ? this.props.viewport.current.scrollingElement.scrollTop
                : window.document.scrollingElement.scrollTop;

        const scrollLeft: number =
            this.props.viewport !== undefined
                ? this.props.viewport.current.scrollingElement.scrollLeft
                : window.document.scrollingElement.scrollLeft;

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

        let top: number = null;
        let right: number = null;
        let bottom: number = null;
        let left: number = null;
        let xTransformOrigin: string = "left";
        let yTransformOrigin: string = "top";

        let desiredVerticalPosition: VerticalPosition = this.props
            .defaultVerticalPosition;
        let desiredHorizontalPosition: HorizontalPosition = this.props
            .defaultHorizontalPosition;

        if (this.props.horizontalPositioningMode !== AxisPositioningMode.uncontrolled) {
            const horizontalOptions: HorizontalPosition[] = this.getHorizontalPositiontingOptions();

            const horizontalThreshold: number =
                this.props.horizontalThreshold !== undefined
                    ? this.props.horizontalThreshold
                    : this.positionerRect.width;

            if (
                horizontalOptions.indexOf(desiredHorizontalPosition) === -1 ||
                this.getOptionWidth(desiredHorizontalPosition) < horizontalThreshold
            ) {
                let widest: number = 0;
                horizontalOptions.forEach((horizontalPosition: HorizontalPosition) => {
                    const thisWidth: number = this.getOptionWidth(horizontalPosition);
                    if (thisWidth > widest) {
                        widest = thisWidth;
                        desiredHorizontalPosition = horizontalPosition;
                    }
                });
            }

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
        }

        if (this.props.verticalPositioningMode !== AxisPositioningMode.uncontrolled) {
            const verticalOptions: VerticalPosition[] = this.getVerticalPositiontingOptions();

            const verticalThreshold: number =
                this.props.verticalThreshold !== undefined
                    ? this.props.verticalThreshold
                    : this.positionerRect.height;

            if (
                verticalOptions.indexOf(desiredVerticalPosition) === -1 ||
                this.getOptionHeight(desiredVerticalPosition) < verticalThreshold
            ) {
                let tallest: number = 0;
                verticalOptions.forEach((verticalPosition: VerticalPosition) => {
                    const thisHeight: number = this.getOptionHeight(verticalPosition);
                    if (thisHeight > tallest) {
                        tallest = thisHeight;
                        desiredVerticalPosition = verticalPosition;
                    }
                });
            }

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
        }

        this.setState({
            transformOrigin: `${xTransformOrigin} ${yTransformOrigin}`,
            xTranslate: this.calclulateHorizontalTranslate(desiredHorizontalPosition),
            yTranslate: this.calclulateVerticalTranslate(desiredVerticalPosition),
            top,
            right,
            bottom,
            left,
            currentHorizontalPosition: desiredHorizontalPosition,
            currentVerticalPosition: desiredVerticalPosition,
            initialLayoutComplete: true,
        });
    };

    /**
     *  Calculate horizontal tranlation to keep positioner in view
     */
    private calclulateHorizontalTranslate = (
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
    private calclulateVerticalTranslate = (
        verticalPosition: VerticalPosition
    ): number => {
        if (!this.props.vericalAlwaysInView) {
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
        if (this.openRequestAnimationFrame === null) {
            this.openRequestAnimationFrame = window.requestAnimationFrame(
                this.updateLayout
            );
        }
    };
}

export default ViewportPositioner;
export * from "./viewport-positioner.props";
export { ViewportPositionerClassNameContract };
