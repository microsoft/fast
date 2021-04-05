import { MessageSystemType } from "../message-system";
import { MonacoAdapterAction } from "./monaco-adapter.service-action";

describe("MonacoAdapterAction", () => {
    test("should not throw", () => {
        expect(() => {
            new MonacoAdapterAction({
                action: jest.fn(),
                id: "foo",
            });
        }).not.toThrow();
    });
    test("should add config items to an instance of the action", () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();
        const monacoAdapterAction = new MonacoAdapterAction({
            action: jest.fn(),
            id: "foo",
        });

        monacoAdapterAction.addConfig({
            getMonacoModelValue: callback1,
            updateMonacoModelValue: callback2,
            messageSystemType: MessageSystemType.custom,
        });

        expect(monacoAdapterAction["getMonacoModelValue"]).toEqual(callback1);
        expect(monacoAdapterAction["updateMonacoModelValue"]).toEqual(callback2);
        expect(monacoAdapterAction["messageSystemType"]).toEqual(
            MessageSystemType.custom
        );
    });
    test("should invoke an action with config items", () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();
        const action = jest.fn();
        const monacoAdapterAction = new MonacoAdapterAction({
            action,
            id: "foo",
        });

        monacoAdapterAction.addConfig({
            getMonacoModelValue: callback1,
            updateMonacoModelValue: callback2,
            messageSystemType: MessageSystemType.custom,
        });

        expect(action).toHaveBeenCalledTimes(0);

        monacoAdapterAction.invoke();

        expect(action).toHaveBeenCalledTimes(1);
        expect(action.mock.calls[0][0]).toEqual({
            id: "foo",
            getMonacoModelValue: callback1,
            updateMonacoModelValue: callback2,
            messageSystemType: MessageSystemType.custom,
        });
    });
    test("should return the MessageSystemType when using the getMessageSystemType", () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();
        const action = jest.fn();
        const monacoAdapterAction = new MonacoAdapterAction({
            action,
            id: "foo",
        });

        monacoAdapterAction.addConfig({
            getMonacoModelValue: callback1,
            updateMonacoModelValue: callback2,
            messageSystemType: MessageSystemType.custom,
        });

        expect(monacoAdapterAction.getMessageSystemType()).toEqual(
            MessageSystemType.custom
        );
    });
    test("should return true if the MessageSystemType matches", () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();
        const action = jest.fn();
        const monacoAdapterAction = new MonacoAdapterAction({
            action,
            id: "foo",
        });

        monacoAdapterAction.addConfig({
            getMonacoModelValue: callback1,
            updateMonacoModelValue: callback2,
            messageSystemType: MessageSystemType.custom,
        });

        expect(monacoAdapterAction.matches(MessageSystemType.custom)).toEqual(true);
    });
    test("should return false if the MessageSystemType does not match", () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();
        const action = jest.fn();
        const monacoAdapterAction = new MonacoAdapterAction({
            action,
            id: "foo",
        });

        monacoAdapterAction.addConfig({
            getMonacoModelValue: callback1,
            updateMonacoModelValue: callback2,
            messageSystemType: MessageSystemType.custom,
        });

        expect(monacoAdapterAction.matches(MessageSystemType.initialize)).toEqual(false);
    });
});
