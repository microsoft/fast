import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import MSFTCarousel, {
    CarouselHandledProps,
    CarouselManagedClasses,
    CarouselUnhandledProps,
    Slide,
    SlideTheme,
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
                    JustifyContent: "center",
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

const detailTabItem: Slide[] = [
    {
        content: contentOne(),
        id: "id01",
    },
    {
        content: mockHero(),
        id: "id02",
        theme: SlideTheme.dark,
    },
    {
        content: mockHero(),
        id: "id03",
        theme: SlideTheme.light,
    },
];

const detailNull: Slide[] = [
    {
        content: null,
        id: "id01",
    },
    {
        content: null,
        id: "id02",
        theme: SlideTheme.dark,
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
});
