import * as React from "react";
import * as ReactDOM from "react-dom";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    CarouselHandledProps,
    CarouselProps,
    CarouselUnhandledProps,
    Slide,
    SlideTheme,
} from "./carousel.props";
import { Flipper, FlipperDirection } from "../flipper";
import {
    Tab,
    TabItem,
    TabPanel,
    Tabs,
    TabsItem,
    TabsSlot,
} from "@microsoft/fast-components-react-base";

export interface CarouselState {
    activeId: string;
}

class Carousel extends Foundation<
    CarouselHandledProps,
    CarouselUnhandledProps,
    CarouselState
> {
    public static displayName: string = "Carousel";

    protected handledProps: HandledProps<CarouselHandledProps> = {
        managedClasses: void 0,
        label: void 0,
        activeId: void 0,
        items: void 0,
    };

    private slides: Slide[];

    /**
     * Define constructor
     */
    constructor(props: CarouselProps) {
        super(props);

        if (this.props.items) {
            this.state = {
                activeId:
                    typeof this.props.activeId === "string"
                        ? this.props.activeId
                        : this.props.items.length > 0
                            ? get(this.props.items[0], "id")
                            : "",
            };

            this.updateSlides();
        }
    }

    /**
     * React life-cycle method
     */
    public componentDidUpdate(): void {
        if (this.slides !== this.props.items) {
            this.updateSlides();
        }
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div {...this.unhandledProps()} className={this.generateClassNames()}>
                <Flipper
                    direction={FlipperDirection.previous}
                    onClick={this.handlePreviousInvoke}
                    className={get(
                        this.props,
                        "managedClasses.carousel_flipperPrevious",
                        ""
                    )}
                />
                <Tabs
                    label={this.props.label}
                    activeId={this.state.activeId}
                    onUpdate={this.handleUpdate}
                    className={get(this.props, "managedClasses.carousel_tabs", "")}
                >
                    {this.renderItems()}
                </Tabs>
                <Flipper
                    direction={FlipperDirection.next}
                    onClick={this.handleNextInvoke}
                    className={get(this.props, "managedClasses.carousel_flipperNext", "")}
                />
            </div>
        );
    }

    /**
     * Generate class names
     */
    protected generateClassNames(): string {
        let className: string = get(this.props, "managedClasses.carousel", "");
        let theme: string = "";

        if (this.getSlideTheme()) {
            theme =
                this.getSlideTheme() === SlideTheme.light
                    ? get(this.props, "managedClasses.theme__light", "")
                    : get(this.props, "managedClasses.theme__dark", "");

            className += ` ${theme}`;
        }

        return super.generateClassNames(className);
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
        if (!this.slides || this.slides.length <= 0) {
            return;
        }

        return this.slides[this.getActiveIndex()].theme
            ? this.slides[this.getActiveIndex()].theme
            : SlideTheme.dark;
    }

    /**
     * Updates slides
     */
    private updateSlides(): void {
        if (this.props.items.length > 0) {
            this.slides = this.props.items.map((item: Slide): Slide => item);
        }
    }

    /**
     * Change active tab
     */
    private handleUpdate = (activeTab: string): void => {
        this.setState({
            activeId: activeTab,
        });
    };

    /**
     * Move to previous slide if applicable
     */
    private handlePreviousInvoke = (): void => {
        let newPosition: number = this.getActiveIndex() - 1;

        if (newPosition < 0) {
            newPosition = this.slides.length - 1;
        }

        this.setNewSlidePosition(newPosition);
    };

    /**
     * Move to next slide if applicable
     */
    private handleNextInvoke = (): void => {
        let newPosition: number = this.getActiveIndex() + 1;

        if (newPosition > this.slides.length - 1) {
            newPosition = 0;
        }

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

    /**
     * Renders the tab item
     */
    private renderItems = (): JSX.Element[] => {
        if (!this.slides || this.slides.length <= 0) {
            return;
        }

        return this.slides.map(
            (item: TabsItem, index: number): JSX.Element => {
                return (
                    <TabItem
                        key={index}
                        slot={TabsSlot.tabItem}
                        id={item.id}
                        className={get(
                            this.props,
                            "managedClasses.carousel_tabsTabItem",
                            ""
                        )}
                    >
                        <Tab
                            slot={TabsSlot.tab}
                            className={get(
                                this.props,
                                "managedClasses.carousel_tabsTabItemTab",
                                ""
                            )}
                        >
                            {this.renderTab(item)}
                        </Tab>
                        <TabPanel
                            slot={TabsSlot.tabPanel}
                            className={get(
                                this.props,
                                "managedClasses.carousel_tabsTabItemTabPanel",
                                ""
                            )}
                        >
                            {this.renderTabPanel(item)}
                        </TabPanel>
                    </TabItem>
                );
            }
        );
    };

    /**
     * Render tab
     */
    private renderTab(item: TabsItem): React.ReactNode {
        if (typeof item.tab === "function") {
            return item.tab(
                get(this.props, "managedClasses.carousel_tabsTabItemTabContent", "")
            );
        }
    }

    /**
     * Render tab panel
     */
    private renderTabPanel(item: TabsItem): React.ReactNode {
        if (typeof item.content === "function") {
            return item.content(
                get(this.props, "managedClasses.carousel_tabsTabItemTabPanelContent", "")
            );
        }
    }
}

export default Carousel;
export * from "./carousel.props";
