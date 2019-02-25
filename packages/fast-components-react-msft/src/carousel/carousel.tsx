import * as React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    CarouselHandledProps,
    CarouselProps,
    CarouselUnhandledProps,
    Slide,
    SlideTheme,
} from "./carousel.props";
import { Flipper, FlipperDirection } from "../flipper";
import { Tabs, TabsItem } from "@microsoft/fast-components-react-base";
import { TabsClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { get } from "lodash-es";

/**
 * The carousel state interface
 */
export interface CarouselState {
    /**
     * Holds the active tab id to share with other controls
     */
    activeId: string;
}

class Carousel extends Foundation<
    CarouselHandledProps,
    CarouselUnhandledProps,
    CarouselState
> {
    public static displayName: string = "Carousel";

    /**
     * Handled props
     */
    protected handledProps: HandledProps<CarouselHandledProps> = {
        managedClasses: void 0,
        label: void 0,
        activeId: void 0,
        items: void 0,
    };

    /**
     * Initial slide transition direction is none (on carousel load)
     */
    private slideTransitionDirection: FlipperDirection = null;

    /**
     * Define constructor
     */
    constructor(props: CarouselProps) {
        super(props);

        if (Array.isArray(this.props.items)) {
            this.state = {
                activeId:
                    typeof this.props.activeId === "string"
                        ? this.props.activeId
                        : get(this.props.items[0], "id", ""),
            };
        }
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div {...this.unhandledProps()} className={this.generateClassNames()}>
                {this.generatePreviousFlipper()}
                <Tabs
                    label={this.props.label}
                    activeId={this.state.activeId}
                    onUpdate={this.handleUpdate}
                    items={this.slides as TabsItem[]}
                    managedClasses={this.generateTabsClassNames()}
                />
                {this.generateNextFlipper()}
            </div>
        );
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
    private get slides(): Slide[] {
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
        return this.slides.map((slide: Slide) => slide.id).indexOf(this.state.activeId);
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
            : SlideTheme.dark;
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
                ? get(
                      this.props,
                      "managedClasses.carousel__slideTransitionDirectionNext",
                      ""
                  )
                : get(
                      this.props,
                      "managedClasses.carousel__slideTransitionDirectionPrevious",
                      ""
                  );

        return ` ${transitionDirection}`;
    }

    /**
     * Return slide theme class name
     */
    private assignSlideThemeClassName(): string {
        const theme: string =
            this.getSlideTheme() === SlideTheme.light
                ? get(this.props, "managedClasses.carousel__themeLight", "")
                : get(this.props, "managedClasses.carousel__themeDark", "");

        return ` ${theme}`;
    }

    /**
     * Generates previous flipper if more than one slide
     */
    private generatePreviousFlipper(): any {
        if (this.isMultipleSlides) {
            return (
                <Flipper
                    direction={FlipperDirection.previous}
                    onClick={this.handlePreviousClick}
                    className={get(
                        this.props,
                        "managedClasses.carousel_flipperPrevious",
                        ""
                    )}
                />
            );
        }
    }

    /**
     * Generates next flipper if more than one slide
     */
    private generateNextFlipper(): any {
        if (this.isMultipleSlides) {
            return (
                <Flipper
                    direction={FlipperDirection.next}
                    onClick={this.handleNextClick}
                    className={get(this.props, "managedClasses.carousel_flipperNext", "")}
                />
            );
        }
    }

    /**
     * Change active tab
     */
    private handleUpdate = (activeTab: string): void => {
        this.setState({
            activeId: activeTab,
        });

        const activeTabIndex: number = this.slides
            .map((slide: Slide) => slide.id)
            .indexOf(activeTab);

        this.setTransitionDirection(activeTabIndex);
    };

    /**
     * Move to previous slide if applicable
     */
    private handlePreviousClick = (): void => {
        let newPosition: number = this.getActiveIndex() - 1;

        if (newPosition < 0) {
            newPosition = this.slides.length - 1;
        }

        this.setTransitionDirection(newPosition);
        this.setNewSlidePosition(newPosition);
    };

    /**
     * Move to next slide if applicable
     */
    private handleNextClick = (): void => {
        let newPosition: number = this.getActiveIndex() + 1;

        if (newPosition > this.slides.length - 1) {
            newPosition = 0;
        }

        this.setTransitionDirection(newPosition);
        this.setNewSlidePosition(newPosition);
    };

    /**
     * Sets new slide based on position
     */
    private setNewSlidePosition(position: number): void {
        this.setState({
            activeId: this.slides[position].id,
        });
    }
}

export default Carousel;
export * from "./carousel.props";
