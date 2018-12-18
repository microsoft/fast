import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import ViewerContentBase from "./viewer-content.base";
import { ViewerContentHandledProps } from "./";
import {
    ViewerMessage,
    ViewerMessageTarget,
    ViewerMessageType,
} from "../utilities/message-system";
import Example from "../../app/components/example";
import * as exampleSchema from "../../app/components/example.schema.json";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("ViewerContent", (): void => {
    test("should send a message to the window when the component has mounted", () => {
        const props: ViewerContentHandledProps = {
            components: [],
        };

        let hasRecievedMessage: boolean = false;

        (global as any).addEventListener = jest.fn((event: string) => {
            if (event === "message") {
                hasRecievedMessage = true;
            }
        });

        const rendered: any = mount(<ViewerContentBase managedClasses={{}} {...props} />);

        expect((global as any).addEventListener).toHaveBeenCalled();
        expect(hasRecievedMessage).toEqual(true);
    });
    test("should initialize components with data when an initialization message is sent", () => {
        const props: ViewerContentHandledProps = {
            components: [
                {
                    schema: exampleSchema,
                    component: Example,
                },
            ],
        };
        const initializationMessage: ViewerMessage = {
            target: ViewerMessageTarget.viewerContent,
            type: ViewerMessageType.initializeComponent,
            componentData: [
                {
                    id: "example",
                    props: {},
                },
            ],
        };

        const rendered: any = mount(<ViewerContentBase managedClasses={{}} {...props} />);

        expect(rendered.state().componentData).toEqual([]);

        rendered
            .instance()
            .handleMessage({ data: JSON.stringify(initializationMessage) });

        expect(rendered.state().componentData).toEqual(
            initializationMessage.componentData
        );
    });
    test("should update components when an update message is sent", () => {
        const props: ViewerContentHandledProps = {
            components: [
                {
                    schema: exampleSchema,
                    component: Example,
                },
            ],
        };
        const initializationMessage: ViewerMessage = {
            target: ViewerMessageTarget.viewerContent,
            type: ViewerMessageType.initializeComponent,
            componentData: [
                {
                    id: "example",
                    props: {},
                },
            ],
        };

        const rendered: any = mount(<ViewerContentBase managedClasses={{}} {...props} />);

        expect(rendered.state().componentData).toEqual([]);

        rendered
            .instance()
            .handleMessage({ data: JSON.stringify(initializationMessage) });

        expect(rendered.state().componentData).toEqual(
            initializationMessage.componentData
        );

        const updateMessage: ViewerMessage = {
            target: ViewerMessageTarget.viewerContent,
            type: ViewerMessageType.updateComponentData,
            componentData: [
                {
                    id: "example",
                    props: {},
                },
                {
                    id: "example",
                    props: {},
                },
            ],
        };

        rendered.instance().handleMessage({ data: JSON.stringify(updateMessage) });

        expect(rendered.state().componentData).toEqual(updateMessage.componentData);
    });
});
