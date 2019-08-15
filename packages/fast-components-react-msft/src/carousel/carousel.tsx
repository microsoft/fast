import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    CarouselHandledProps,
    CarouselProps,
    CarouselSlide,
    CarouselSlideTheme,
    CarouselState,
    CarouselUnhandledProps,
} from "./carousel.props";
import { Flipper, FlipperDirection } from "../flipper";
import { Tabs, TabsItem } from "@microsoft/fast-components-react-base";
import { TabsClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { get, isNil } from "lodash-es";
import { DisplayNamePrefix } from "../utilities";
import { canUseDOM } from "exenv-es6";

class Carousel extends Foundation<
    CarouselHandledProps,
    CarouselUnhandledProps,
    CarouselState
> {
    public static displayName: string = `${DisplayNamePrefix}Carousel`;

    public static defaultProps: Partial<CarouselProps> = {
        autoplay: false,
        autoplayInterval: 6000,
    };

    /**
     * React life-cycle method
     */
    public static getDerivedStateFromProps(
        nextProps: CarouselProps,
        prevState: CarouselState
    ): null | Partial<CarouselState> {
        if (nextProps.activeId && nextProps.activeId !== prevState.activeId) {
            return {
                activeId: nextProps.activeId,
            };
        }

        return null;
    }

    /**
     * Handled props
     */
    protected handledProps: HandledProps<CarouselHandledProps> = {
        autoplay: void 0,
        autoplayInterval: void 0,
        managedClasses: void 0,
        nextFlipper: void 0,
        previousFlipper: void 0,
        label: void 0,
        activeId: void 0,
        onActiveIdUpdate: void 0,
        items: void 0,
    };

    /**
     * Store a reference to the autoplay timer
     */
    private autoplayTimer: number | void;

    /**
     * Store a reference to the root element
     */
    private rootEl: React.RefObject<HTMLDivElement>;

    /**
     * Initial slide transition direction is none (on carousel load)
     */
    private slideTransitionDirection: FlipperDirection = null;

    /**
     * Define constructor
     */
    constructor(props: CarouselProps) {
        super(props);

        this.rootEl = React.createRef();

        if (Array.isArray(this.props.items)) {
            this.state = {
                activeId:
                    typeof this.props.activeId === "string"
                        ? this.props.activeId
                        : get(this.props.items[0], "id", " "),
            };
        }
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                ref={this.rootEl}
            >
                {this.generatePreviousFlipper()}
                <Tabs
                    label={this.props.label}
                    activeId={this.state.activeId}
                    onUpdate={this.handleUpdate}
                    items={this.slides as TabsItem[]}
                    managedClasses={this.generateTabsClassNames()}
                    disableTabFocus={this.props.autoplay}
                />
                {this.generateNextFlipper()}
            </div>
        );
    }

    /**
     * React lifecycle hook
     */
    public componentDidMount(): void {
        if (canUseDOM() && this.props.autoplay) {
            // Set initial interval for autoplay
            this.autoplayTimer = window.setInterval(
                this.autoplayNextSlide,
                this.props.autoplayInterval
            );
        }
    }

    /**
     * React lifecycle hook
     */
    public componentDidUpdate(prevProps: CarouselProps, prevState: CarouselState): void {
        if (this.props.autoplay && isNil(this.autoplayTimer)) {
            // Set the window interval if we are in autplay and don't have a timer
            this.autoplayTimer = window.setInterval(
                this.autoplayNextSlide,
                this.props.autoplayInterval
            );
        } else if (!this.props.autoplay && !isNil(this.autoplayTimer)) {
            // Clear the interval if we should not be autoplaying
            this.autoplayTimer = window.clearInterval(this.autoplayTimer as number);
        }
    }

    /**
     * React lifecycle hook
     */
    public componentWillUnmount(): void {
        if (!isNil(this.autoplayTimer)) {
            this.autoplayTimer = window.clearInterval(this.autoplayTimer as number);
        }
    }

    /**
     * Generate class names
     */
    protected generateClassNames(): string {
        let className: string = get(this.props, "managedClasses.carousel", "");

        if (this.getSlideTheme()) {
            className += this.assignSlideThemeClassName();
        }

        if (this.slideTransitionDirection) {
            className += this.assignTransitionDirectionClassName();
        }

        return super.generateClassNames(className);
    }

    /**
     * Returns tabs managedclasses with new carousel-specific JSS
     */
    protected generateTabsClassNames(): TabsClassNameContract {
        return {
            tabs: get(this.props, "managedClasses.carousel_slides", ""),
            tabs_tabPanels: get(this.props, "managedClasses.carousel_tabPanels", ""),
            tabs_tabList: get(
                this.props,
                "managedClasses.carousel_sequenceIndicators",
                ""
            ),
            tabs_tabPanelContent: get(
                this.props,
                "managedClasses.carousel_tabPanelContent",
                ""
            ),
            tab: get(this.props, "managedClasses.carousel_sequenceIndicator", ""),
            tab__active: get(
                this.props,
                "managedClasses.carousel_sequenceIndicator__active",
                ""
            ),
            tabPanel: get(this.props, "managedClasses.carousel_tabPanel", ""),
            tabPanel__hidden: get(
                this.props,
                "managedClasses.carousel_tabPanel__hidden",
                ""
            ),
        };
    }

    /**
     * Get an array of slides
     * Coerce tab shape
     */
    private get slides(): CarouselSlide[] {
        if (Array.isArray(this.props.items)) {
            return this.props.items.map((slide: any) =>
                Object.assign({}, slide, {
                    tab: (): React.ReactNode => <React.Fragment />,
                })
            );
        } else {
            return [];
        }
    }

    /**
     * Single slide carousels do not require certain interface elements
     */
    private get isMultipleSlides(): boolean {
        return this.slides.length !== 1;
    }

    /**
     * Get the active slide index
     */
    private getActiveIndex(): number {
        return this.slides
            .map((slide: CarouselSlide) => slide.id)
            .indexOf(this.state.activeId);
    }

    /**
     * Get the current slide theme (needed for UI overlay contrast)
     */
    private getSlideTheme(): string {
        if (this.slides.length <= 0) {
            return;
        }

        return this.slides[this.getActiveIndex()].theme
            ? this.slides[this.getActiveIndex()].theme
            : CarouselSlideTheme.dark;
    }

    /**
     * Set the transition direction based on incoming index
     */
    private setTransitionDirection(incomingIndex: number): void {
        if (this.getActiveIndex() < incomingIndex) {
            this.slideTransitionDirection = FlipperDirection.next;
        } else {
            this.slideTransitionDirection = FlipperDirection.previous;
        }
    }

    /**
     * Return transition direction class name
     */
    private assignTransitionDirectionClassName(): string {
        const transitionDirection: string =
            this.slideTransitionDirection === FlipperDirection.next
                ? get(this.props, "managedClasses.carousel__slideAnimateNext", "")
                : get(this.props, "managedClasses.carousel__slideAnimatePrevious", "");

        return ` ${transitionDirection}`;
    }

    /**
     * Return slide theme class name
     */
    private assignSlideThemeClassName(): string {
        const theme: string =
            this.getSlideTheme() === CarouselSlideTheme.light
                ? get(this.props, "managedClasses.carousel__themeLight", "")
                : get(this.props, "managedClasses.carousel__themeDark", "");

        return ` ${theme}`;
    }

    /**
     * Generates previous flipper if more than one slide
     */
    private generatePreviousFlipper(): any {
        if (!this.isMultipleSlides) {
            return;
        }

        const previousFlipperClassName: string = get(
            this.props,
            "managedClasses.carousel_flipperPrevious",
            ""
        );

        if (typeof this.props.previousFlipper === "function") {
            return this.props.previousFlipper(
                this.previousSlide,
                previousFlipperClassName
            );
        } else {
            return (
                <Flipper
                    direction={FlipperDirection.previous}
                    onClick={this.previousSlide}
                    className={previousFlipperClassName}
                />
            );
        }
    }

    /**
     * Generates next flipper if more than one slide
     */
    private generateNextFlipper(): any {
        if (!this.isMultipleSlides) {
            return;
        }

        const nextFlipperClassName: string = get(
            this.props,
            "managedClasses.carousel_flipperNext",
            ""
        );

        if (typeof this.props.nextFlipper === "function") {
            return this.props.nextFlipper(this.nextSlide, nextFlipperClassName);
        } else {
            return (
                <Flipper
                    direction={FlipperDirection.next}
                    onClick={this.nextSlide}
                    className={nextFlipperClassName}
                />
            );
        }
    }

    /**
     * Change active tab
     */
    private handleUpdate = (activeTab: string): void => {
        if (typeof this.props.onActiveIdUpdate === "function") {
            this.props.onActiveIdUpdate(activeTab, false);
        }

        this.setState({
            activeId: activeTab,
        });

        const activeTabIndex: number = this.slides
            .map((slide: CarouselSlide) => slide.id)
            .indexOf(activeTab);

        this.setTransitionDirection(activeTabIndex);
    };

    /**
     * Handles automation of slide movement
     */
    private autoplayNextSlide = (): void => {
        let nextPosition: number = this.getActiveIndex() + 1;

        if (nextPosition > this.slides.length - 1) {
            nextPosition = 0;
        }

        const activeId: string = this.slides[nextPosition].id;

        this.setTransitionDirection(nextPosition);

        if (typeof this.props.onActiveIdUpdate === "function") {
            this.props.onActiveIdUpdate(activeId, true);
        }

        this.setState({
            activeId,
        });
    };

    /**
     * Move to next slide if applicable
     */
    private nextSlide = (): void => {
        let newPosition: number = this.getActiveIndex() + 1;

        if (newPosition > this.slides.length - 1) {
            newPosition = 0;
        }

        this.setTransitionDirection(newPosition);
        this.setNewSlidePosition(newPosition);
    };

    /**
     * Move to previous slide if applicable
     */
    private previousSlide = (): void => {
        let newPosition: number = this.getActiveIndex() - 1;

        if (newPosition < 0) {
            newPosition = this.slides.length - 1;
        }

        this.setTransitionDirection(newPosition);
        this.setNewSlidePosition(newPosition);
    };

    /**
     * Sets new slide based on position
     */
    private setNewSlidePosition(position: number): void {
        const newActiveId: string = this.slides[position].id;

        if (typeof this.props.onActiveIdUpdate === "function") {
            this.props.onActiveIdUpdate(newActiveId, false);
        }

        this.setState({
            activeId: newActiveId,
        });
    }
}

export default Carousel;
export * from "./carousel.props";
