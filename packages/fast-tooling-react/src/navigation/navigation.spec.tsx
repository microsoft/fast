import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, render, shallow } from "enzyme";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { NavigationProps } from "./navigation.props";
import { Navigation } from "./navigation";
import { MessageSystem, MessageSystemType } from "../message-system";
import { Register } from "../message-system/message-system.props";
import { InitializeMessageOutgoing } from "../message-system/message-system.utilities.props";
import { TreeNavigationConfig } from "../message-system/navigation.props";
import { DataType } from "../data-utilities/types";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const navigationProps: NavigationProps = {
    messageSystem: void 0,
};

const DragDropNavigation: React.FC<NavigationProps> = (
    props: React.PropsWithChildren<NavigationProps>
): React.ReactElement => {
    return (
        <DndProvider backend={HTML5Backend}>
            <Navigation {...props} />
        </DndProvider>
    );
};

describe("Navigation", () => {
    test("should not throw if there is no drag and drop available", () => {
        expect(() => {
            shallow(<Navigation {...navigationProps} />);
        }).not.toThrow();
    });
    test("should not throw if drag and drop is available", () => {
        expect(() => {
            shallow(<DragDropNavigation {...navigationProps} />);
        }).not.toThrow();
    });
    test("should register with the message system", () => {
        const fastMessageSystem: MessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    "": {
                        schemaId: "foo",
                        data: {},
                    },
                },
                "",
            ],
            schemaDictionary: {
                foo: {
                    id: "foo",
                    type: "object",
                    properties: {
                        foo: {
                            type: "string",
                        },
                    },
                },
            },
        });

        /* tslint:disable-next-line */
        expect(fastMessageSystem["register"].size).toEqual(0);

        const rendered: any = mount(
            <Navigation {...navigationProps} messageSystem={fastMessageSystem} />
        );

        /* tslint:disable-next-line */
        expect(fastMessageSystem["register"].size).toEqual(1);
    });
    test("should deregister the component with the message system on unmount", () => {
        const fastMessageSystem: MessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    "": {
                        schemaId: "foo",
                        data: {},
                    },
                },
                "",
            ],
            schemaDictionary: {
                foo: {
                    id: "foo",
                    type: "object",
                    properties: {
                        foo: {
                            type: "string",
                        },
                    },
                },
            },
        });

        const rendered: any = mount(
            <Navigation {...navigationProps} messageSystem={fastMessageSystem} />
        );

        rendered.unmount();

        /* tslint:disable-next-line */
        expect(fastMessageSystem["register"].size).toEqual(0);
    });
    test("should render a single navigation item as a collapsible item", () => {
        const schema: any = {
            id: "foo",
            type: "object",
            properties: {
                bar: {
                    type: "object",
                    properties: {
                        bat: {
                            type: "string",
                        },
                    },
                },
            },
        };
        const data: any = {
            bar: "hello world",
        };
        const navigation: TreeNavigationConfig = [
            {
                "": {
                    self: "",
                    parent: null,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema,
                    data,
                    text: "bat",
                    type: DataType.object,
                    items: [],
                },
            },
            "",
        ];
        const fastMessageSystem: MessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    "": {
                        schemaId: schema.id,
                        data,
                    },
                },
                "",
            ],
            schemaDictionary: {
                [schema.id]: schema,
            },
        });

        const rendered: any = mount(
            <Navigation {...navigationProps} messageSystem={fastMessageSystem} />
        );

        /* tslint:disable-next-line */
        fastMessageSystem["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeDictionaryId: "",
                    activeNavigationConfigId: "",
                    schema,
                    data,
                    dataDictionary: [
                        {
                            "": {
                                schemaId: schema.id,
                                data,
                            },
                        },
                        "",
                    ],
                    navigationDictionary: [
                        {
                            "": navigation,
                        },
                        "",
                    ],
                    navigation,
                    schemaDictionary: {
                        foo: schema,
                    },
                } as InitializeMessageOutgoing,
            } as any);
        });

        rendered.setState({
            navigationDictionary: [
                {
                    "": navigation,
                },
                "",
            ],
        });

        const item: any = rendered.find('div[role="treeitem"]');
        expect(item).toHaveLength(1);
    });
    test("should render a single navigation item as an end leaf item", () => {
        const schema: any = {
            id: "foo",
            type: "object",
            properties: {
                bar: {
                    type: "string",
                },
            },
        };
        const data: any = {
            bar: "hello world",
        };
        const navigation: TreeNavigationConfig = [
            {
                "": {
                    self: "",
                    parent: null,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema,
                    data,
                    text: "bat",
                    type: DataType.object,
                    items: ["bar"],
                },
                bar: {
                    self: "bar",
                    parent: "",
                    relativeDataLocation: "bar",
                    schemaLocation: "properties.bar",
                    schema,
                    data,
                    text: "bat",
                    type: DataType.string,
                    items: [],
                },
            },
            "",
        ];
        const fastMessageSystem: MessageSystem = new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    "": {
                        schemaId: schema.id,
                        data,
                    },
                },
                "",
            ],
            schemaDictionary: {
                [schema.id]: schema,
            },
        });

        const rendered: any = mount(
            <Navigation {...navigationProps} messageSystem={fastMessageSystem} />
        );

        /* tslint:disable-next-line */
        fastMessageSystem["register"].forEach((registeredItem: Register) => {
            registeredItem.onMessage({
                data: {
                    type: MessageSystemType.initialize,
                    activeDictionaryId: "",
                    activeNavigationConfigId: "",
                    schema,
                    data,
                    dataDictionary: [
                        {
                            "": {
                                schemaId: schema.id,
                                data,
                            },
                        },
                        "",
                    ],
                    navigationDictionary: [
                        {
                            "": navigation,
                        },
                        "",
                    ],
                    navigation,
                    schemaDictionary: {
                        foo: schema,
                    },
                } as InitializeMessageOutgoing,
            } as any);
        });

        rendered.setState({
            navigationDictionary: [
                {
                    "": navigation,
                },
                "",
            ],
        });

        const item: any = rendered.find('a[role="treeitem"]');
        expect(item).toHaveLength(1);
    });
});
