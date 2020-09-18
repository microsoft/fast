import { MessageSystemType } from "../message-system";
import { MonacoAdaptorAction } from "./monaco-adaptor-action";

describe("MonacoAdaptorAction", () => {
    test("should not throw", () => {
        expect(() => {
            new MonacoAdaptorAction({
                action: jest.fn(),
                id: "foo",
            });
        }).not.toThrow();
    });
    test("should add config items to an instance of the action", () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();
        const monacoAdaptorAction = new MonacoAdaptorAction({
            action: jest.fn(),
            id: "foo",
        });

        monacoAdaptorAction.addConfig({
            getMonacoModelValue: callback1,
            updateMonacoModelValue: callback2,
            messageSystemType: MessageSystemType.custom,
        });

        expect(monacoAdaptorAction["getMonacoModelValue"]).toEqual(callback1);
        expect(monacoAdaptorAction["updateMonacoModelValue"]).toEqual(callback2);
        expect(monacoAdaptorAction["messageSystemType"]).toEqual(
            MessageSystemType.custom
        );
    });
    test("should invoke an action with config items", () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();
        const action = jest.fn();
        const monacoAdaptorAction = new MonacoAdaptorAction({
            action,
            id: "foo",
        });

        monacoAdaptorAction.addConfig({
            getMonacoModelValue: callback1,
            updateMonacoModelValue: callback2,
            messageSystemType: MessageSystemType.custom,
        });

        expect(action).toHaveBeenCalledTimes(0);

        monacoAdaptorAction.invoke();

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
        const monacoAdaptorAction = new MonacoAdaptorAction({
            action,
            id: "foo",
        });

        monacoAdaptorAction.addConfig({
            getMonacoModelValue: callback1,
            updateMonacoModelValue: callback2,
            messageSystemType: MessageSystemType.custom,
        });

        expect(monacoAdaptorAction.getMessageSystemType()).toEqual(
            MessageSystemType.custom
        );
    });
    test("should return true if the MessageSystemType matches", () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();
        const action = jest.fn();
        const monacoAdaptorAction = new MonacoAdaptorAction({
            action,
            id: "foo",
        });

        monacoAdaptorAction.addConfig({
            getMonacoModelValue: callback1,
            updateMonacoModelValue: callback2,
            messageSystemType: MessageSystemType.custom,
        });

        expect(monacoAdaptorAction.matches(MessageSystemType.custom)).toEqual(true);
    });
    test("should return false if the MessageSystemType does not match", () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();
        const action = jest.fn();
        const monacoAdaptorAction = new MonacoAdaptorAction({
            action,
            id: "foo",
        });

        monacoAdaptorAction.addConfig({
            getMonacoModelValue: callback1,
            updateMonacoModelValue: callback2,
            messageSystemType: MessageSystemType.custom,
        });

        expect(monacoAdaptorAction.matches(MessageSystemType.initialize)).toEqual(false);
    });
});
