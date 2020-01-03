import jest from "jest";
import {
    AddDataMessageOutgoing,
    DeregisterComponentOutgoing,
    DuplicateDataMessageOutgoing,
    InitializeMessageOutgoing,
    MessageSystemComponentTypeAction,
    MessageSystemDataTypeAction,
    MessageSystemType,
    RegisterComponentOutgoing,
    RemoveDataMessageOutgoing,
    UpdateDataMessageOutgoing,
} from "./message-system.props";
import { getMessage } from "./message-system";
import { DataType } from "../data-utilities/types";

describe("getMessage", () => {
    describe("initialize", () => {
        test("should return messages sent with initial values provided", () => {
            const dataBlob: any = {
                foo: "bar",
            };
            const schema: any = { id: "foo" };
            const plugins: any[] = [];
            const message: InitializeMessageOutgoing = getMessage({
                type: MessageSystemType.initialize,
                data: dataBlob,
                schema,
                plugins,
            }) as InitializeMessageOutgoing;

            expect(message.type).toEqual(MessageSystemType.initialize);
            expect(message.data).toEqual(dataBlob);
            expect(message.schema).toEqual(schema);
            expect(message.plugins).toEqual(plugins);
        });
    });
    describe("component", () => {
        test("should return messages sent with component registration values provided", () => {
            const message: RegisterComponentOutgoing = getMessage({
                type: MessageSystemType.component,
                action: MessageSystemComponentTypeAction.register,
                id: "foo",
                subscribe: [],
            }) as RegisterComponentOutgoing;

            expect(message.type).toEqual(MessageSystemType.component);
            expect(message.action).toEqual(MessageSystemComponentTypeAction.register);
            expect(message.id).toEqual("foo");
            expect(message.registry).toEqual(["foo"]);
        });
        test("should return messages sent with component deregistration values provided", () => {
            getMessage({
                type: MessageSystemType.component,
                action: MessageSystemComponentTypeAction.register,
                id: "foo",
                subscribe: [],
            });
            const deregistrationMessage: DeregisterComponentOutgoing = getMessage({
                type: MessageSystemType.component,
                action: MessageSystemComponentTypeAction.deregister,
                id: "foo",
            }) as DeregisterComponentOutgoing;

            expect(deregistrationMessage.type).toEqual(MessageSystemType.component);
            expect(deregistrationMessage.action).toEqual(
                MessageSystemComponentTypeAction.deregister
            );
            expect(deregistrationMessage.id).toEqual("foo");
            expect(deregistrationMessage.registry).toEqual([]);
        });
    });
    describe("data", () => {
        test("should return a data blob with duplicated values", () => {
            getMessage({
                type: MessageSystemType.initialize,
                data: {
                    foo: "bar",
                },
                schema: {},
                plugins: [],
            });
            const message: DuplicateDataMessageOutgoing = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.duplicate,
                sourceDataLocation: "foo",
            }) as DuplicateDataMessageOutgoing;

            expect(message.data).toEqual({ foo: ["bar", "bar"] });
        });
        test("should return a data blob without removed values", () => {
            getMessage({
                type: MessageSystemType.initialize,
                data: {
                    foo: "bar",
                },
                schema: {},
                plugins: [],
            });
            const message: RemoveDataMessageOutgoing = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.remove,
                dataLocation: "foo",
            }) as RemoveDataMessageOutgoing;

            expect(message.data).toEqual({});
        });
        test("should return a data blob with added values", () => {
            getMessage({
                type: MessageSystemType.initialize,
                data: {},
                schema: {},
                plugins: [],
            });
            const message: AddDataMessageOutgoing = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.add,
                dataLocation: "hello",
                data: "world",
                dataType: DataType.object,
            }) as AddDataMessageOutgoing;

            expect(message.data).toEqual({ hello: "world" });
        });
        test("should return a data blob with updated values", () => {
            getMessage({
                type: MessageSystemType.initialize,
                data: {},
                schema: {},
                plugins: [],
            });
            const message: UpdateDataMessageOutgoing = getMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.update,
                dataLocation: "hello",
                data: "venus",
            }) as UpdateDataMessageOutgoing;

            expect(message.data).toEqual({ hello: "venus" });
        });
    });
});
