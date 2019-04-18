import React from "react";
import { AppShell } from "./index";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";

configure({ adapter: new Adapter() });

describe("AppShell", (): void => {
    test("should not throw", (): void => {
        expect(() => {
            mount(
                <AppShell
                    apps={[
                        {
                            name: "test",
                            id: "test",
                            rootPath: "/test",
                            render: (): JSX.Element => <h1>hello world</h1>,
                            icon: <svg />,
                        },
                    ]}
                />
            );
        }).not.toThrow();
    });
});
