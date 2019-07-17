import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import MSFTCarousel, {
    CarouselHandledProps,
    CarouselManagedClasses,
    CarouselProps,
    CarouselSlide,
    CarouselSlideTheme,
    CarouselUnhandledProps,
} from "./carousel";
import {
    CallToAction,
    CallToActionAppearance,
    Heading,
    HeadingSize,
    HeadingTag,
    Image,
    Paragraph,
    ParagraphSize,
} from "../index";
import { DisplayNamePrefix } from "../utilities";

function contentOne(): (className?: string) => React.ReactNode {
    return (className?: string): React.ReactNode => (
        <div className={className}>
            <Image
                src={"http://placehold.it/1399x600/2F2F2F/171717"}
                alt={"Placeholder image"}
            />
        </div>
    );
}

function mockHero(): (className?: string) => React.ReactNode {
    return (className?: string): React.ReactNode => (
        <div className={className}>
            <div
                style={{
                    justifyContent: "center",
                    width: "100%",
                    position: "absolute",
                    top: "0",
                    height: "100%",
                    alignItems: "flex-end",
                    display: "flex",
                    left: "0",
                    right: "0",
                }}
            >
                <div
                    style={{
                        position: "relative",
                        marginBottom: "40px",
                        padding: "16px",
                        background: "hsla(0,0%,100%,.9)",
                        width: "40%",
                        textAlign: "center",
                    }}
                >
                    <Heading
                        tag={HeadingTag.h2}
                        size={HeadingSize._3}
                        children={"Hero title"}
                    />
                    <Paragraph
                        size={ParagraphSize._1}
                        children={"Sample hero paragraph text"}
                    />
                    <CallToAction
                        style={{ marginTop: "16px" }}
                        appearance={CallToActionAppearance.primary}
                        children={"Call to action"}
                        href={"#"}
                    />
                </div>
            </div>
            <Image
                src={"http://placehold.it/1399x600/2F2F2F/171717"}
                alt={"Placeholder image"}
            />
        </div>
    );
}

const detailTabItem: CarouselSlide[] = [
    {
        content: contentOne(),
        id: "id01",
    },
    {
        content: mockHero(),
        id: "id02",
        theme: CarouselSlideTheme.dark,
    },
    {
        content: mockHero(),
        id: "id03",
        theme: CarouselSlideTheme.light,
    },
];

const detailNull: CarouselSlide[] = [
    {
        content: null,
        id: "id01",
    },
    {
        content: null,
        id: "id02",
        theme: CarouselSlideTheme.dark,
    },
];

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("carousel", (): void => {
    const handledProps: CarouselHandledProps = {
        label: "foo",
        items: detailTabItem,
    };
    test("should have a displayName that matches the component name", () => {
        expect(`${DisplayNamePrefix}${(MSFTCarousel as any).name}`).toBe(
            MSFTCarousel.displayName
        );
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<MSFTCarousel {...handledProps} />);
        }).not.toThrow();
    });

    test("should accept unhandledProps", () => {
        const unhandledProps: CarouselUnhandledProps = {
            "aria-hidden": true,
        };

        const props: CarouselHandledProps & CarouselUnhandledProps = {
            ...handledProps,
            ...unhandledProps,
        };

        const rendered: any = mount(<MSFTCarousel {...props} />);

        expect(rendered.first().prop("aria-hidden")).toEqual(true);
    });

    test("should not error with empty item data", () => {
        const rendered: any = mount(<MSFTCarousel label={"foo"} items={[]} />);

        expect(rendered.first().length).toBe(1);
        expect(rendered.find('[role="tablist"]').children().length).toBe(0);
    });

    test("should render with correct tab set as active", () => {
        const rendered: any = mount(
            <MSFTCarousel label={"foo"} items={[]} activeId={"id02"} />
        );

        expect(rendered.state("activeId")).toBe("id02");
    });

    test("should update the active id when new props are passed", () => {
        const rendered: any = mount(<MSFTCarousel label={"foo"} items={detailTabItem} />);

        expect(rendered.state("activeId")).toBe("id01");

        rendered.setProps({ activeId: "id03" });

        expect(rendered.state("activeId")).toBe("id03");
    });

    test("should not throw if items return no functions", () => {
        expect(() => {
            shallow(<MSFTCarousel label={"foo"} items={detailNull} />);
        }).not.toThrow();
    });

    test("should move to next slide on 'next' flipper click", () => {
        const rendered: any = mount(<MSFTCarousel {...handledProps} />);

        expect(rendered.state("activeId")).toBe("id01");
        rendered
            .find('[direction="next"]')
            .first()
            .simulate("click");
        expect(rendered.state("activeId")).toBe("id02");
    });

    test("should cycle to the first slide on last slide 'next' flipper click", () => {
        const rendered: any = mount(<MSFTCarousel {...handledProps} />);

        rendered.setState({ activeId: "id03" });
        rendered
            .find('[direction="next"]')
            .first()
            .simulate("click");
        expect(rendered.state("activeId")).toBe("id01");
    });

    test("should move to previous slide on 'previous' flipper click", () => {
        const rendered: any = mount(<MSFTCarousel {...handledProps} />);

        rendered.setState({ activeId: "id02" });
        rendered
            .find('[direction="previous"]')
            .first()
            .simulate("click");
        expect(rendered.state("activeId")).toBe("id01");
    });

    test("should cycle to the last slide on first slide 'previous' flipper click", () => {
        const rendered: any = mount(<MSFTCarousel {...handledProps} />);

        expect(rendered.state("activeId")).toBe("id01");
        rendered
            .find('[direction="previous"]')
            .first()
            .simulate("click");
        expect(rendered.state("activeId")).toBe("id03");
    });

    test("should move to the second slide on second sequence indicator click", () => {
        const rendered: any = mount(<MSFTCarousel {...handledProps} />);

        expect(rendered.state("activeId")).toBe("id01");

        rendered
            .find('[role="tab"]')
            .at(1)
            .simulate("click");
        expect(rendered.state("activeId")).toBe("id02");
    });

    test("should fire a callback when `onActiveIdUpdate` prop is passed", () => {
        const onActiveIdUpdateMock: any = jest.fn();
        const rendered: any = mount(
            <MSFTCarousel {...handledProps} onActiveIdUpdate={onActiveIdUpdateMock} />
        );

        rendered
            .find('[direction="next"]')
            .first()
            .simulate("click");

        expect(onActiveIdUpdateMock).toHaveBeenCalledTimes(1);

        rendered
            .find('[direction="previous"]')
            .first()
            .simulate("click");

        expect(onActiveIdUpdateMock).toHaveBeenCalledTimes(2);

        rendered
            .find('[role="tab"]')
            .at(1)
            .simulate("click");

        expect(onActiveIdUpdateMock).toHaveBeenCalledTimes(3);
    });

    test("should provide the current active index when `onActiveIdUpdate` prop is passed", () => {
        const onActiveIdUpdateFn: any = jest.fn((id: string) => id);
        const rendered: any = mount(
            <MSFTCarousel {...handledProps} onActiveIdUpdate={onActiveIdUpdateFn} />
        );

        rendered
            .find('[direction="next"]')
            .first()
            .simulate("click");

        expect(onActiveIdUpdateFn.mock.results[0].value).toBe("id02");

        rendered
            .find('[direction="previous"]')
            .first()
            .simulate("click");

        expect(onActiveIdUpdateFn.mock.results[1].value).toBe("id01");

        rendered
            .find('[role="tab"]')
            .at(1)
            .simulate("click");

        expect(onActiveIdUpdateFn.mock.results[2].value).toBe("id02");
    });

    test("should provide the `isAutoplayInitiated` value to `onActiveIdUpdate` when prop is passed", () => {
        const onActiveIdUpdateFn: any = jest.fn(
            (id: string, autoplayInitiated: boolean) => autoplayInitiated
        );
        const rendered: any = mount(
            <MSFTCarousel {...handledProps} onActiveIdUpdate={onActiveIdUpdateFn} />
        );

        rendered
            .find('[role="tab"]')
            .at(1)
            .simulate("click");

        expect(onActiveIdUpdateFn.mock.results[0].value).toBe(false);
    });

    describe("autoplay", (): void => {
        const mockFocus: any = jest.fn();
        const mockHover: any = jest.fn();
        const mockLeave: any = jest.fn();
        const props: CarouselProps = {
            ...handledProps,
            managedClasses: {
                carousel: "carousel",
            },
        };

        test("should initialize with `autoplay` defaulted to false", () => {
            const rendered: any = mount(<MSFTCarousel {...props} />);

            expect(rendered.props().autoplay).toBe(false);
        });

        test("should automatically advance the slide when `autoplay` prop is passed to the component", () => {
            jest.useFakeTimers();

            const rendered: any = mount(<MSFTCarousel {...props} autoplay={true} />);

            expect(rendered.state().activeId).toBe("id01");

            jest.advanceTimersByTime(6001);

            expect(rendered.state().activeId).toBe("id02");
        });

        test("should set `autoplay` to true when `autoplay` is passed as true", () => {
            const rendered: any = mount(<MSFTCarousel {...props} autoplay={true} />);

            expect(rendered.props().autoplay).toBe(true);
        });

        test("should fire a callback when focus is brought to the carousel", () => {
            const rendered: any = mount(<MSFTCarousel {...props} onFocus={mockFocus} />);

            rendered.find(".carousel").simulate("focus");

            expect(mockFocus).toHaveBeenCalledTimes(1);
        });

        test("should fire a callback when mouse enters the carousel", () => {
            const rendered: any = mount(
                <MSFTCarousel {...props} onMouseEnter={mockHover} />
            );

            rendered.simulate("mouseEnter");

            expect(mockHover).toHaveBeenCalledTimes(1);
        });

        test("should fire a callback when mouse leaves the carousel", () => {
            const rendered: any = mount(
                <MSFTCarousel
                    {...handledProps}
                    onMouseEnter={mockHover}
                    onMouseLeave={mockLeave}
                />
            );

            rendered.simulate("mouseEnter");

            expect(mockHover).toHaveBeenCalledTimes(2);

            rendered.simulate("mouseLeave");

            expect(mockLeave).toHaveBeenCalledTimes(1);
        });
    });
});
