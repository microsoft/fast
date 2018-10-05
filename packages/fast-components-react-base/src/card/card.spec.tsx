import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import Card, {
    CardClassNameContract,
    CardHandledProps,
    CardManagedClasses,
    CardProps,
    CardTag,
    CardUnhandledProps
} from "./card";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("card", (): void => {
    const managedClasses: CardClassNameContract = {
        card: "card"
    };

    test("should have a displayName that matches the component name", () => {
        expect((Card as any).name).toBe(Card.displayName);
    });

    test("should return an object that includes all valid props which are not enumerated as handledProps", () => {
        const handledProps: CardHandledProps = {
            managedClasses
        };

        const unhandledProps: CardUnhandledProps = {
            "aria-hidden": true
        };

        const props: CardProps = {...handledProps, ...unhandledProps};

        const rendered: any = shallow(
            <Card {...props} />
        );

        expect(rendered.prop("aria-hidden")).not.toBe(undefined);
        expect(rendered.prop("aria-hidden")).toEqual(true);
    });

    test("should render by default as a `div` element", () => {
        const rendered: any = shallow(
            <Card managedClasses={managedClasses} />
        );

        expect(rendered.type()).toBe("div");
    });

    test("should render as a `section` element if the `prop.tag` is equal to `section`", () => {
        const rendered: any = shallow(
            <Card tag={CardTag.section} managedClasses={managedClasses} />
        );

        expect(rendered.type()).toBe("section");
    });

    test("should render as a `article` element if the `prop.tag` is equal to `article`", () => {
        const rendered: any = shallow(
            <Card tag={CardTag.article} managedClasses={managedClasses} />
        );

        expect(rendered.type()).toBe("article");
    });
});
