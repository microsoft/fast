import chai, { expect } from "chai";
import spies from "chai-spies";
import { MessageSystemType } from "../message-system";
import { MonacoAdapterAction } from "./monaco-adapter.service-action";

chai.use(spies);

/* eslint-disable @typescript-eslint/no-empty-function */
describe("MonacoAdapterAction", () => {
    it("should not throw", () => {
        expect(() => {
            new MonacoAdapterAction({
                action: () => {},
                id: "foo",
            });
        }).not.to.throw();
    });
    it("should add config items to an instance of the action", () => {
        const callback1: any = () => {};
        const callback2: any = () => {};
        const monacoAdapterAction = new MonacoAdapterAction({
            action: () => {},
            id: "foo",
        });

        monacoAdapterAction.addConfig({
            getMonacoModelValue: callback1,
            updateMonacoModelValue: callback2,
            messageSystemType: MessageSystemType.custom,
        });

        expect(monacoAdapterAction["getMonacoModelValue"]).to.equal(callback1);
        expect(monacoAdapterAction["updateMonacoModelValue"]).to.equal(callback2);
        expect(monacoAdapterAction["messageSystemType"]).to.equal(
            MessageSystemType.custom
        );
    });
    it("should invoke an action with config items", () => {
        const callback1: any = chai.spy(() => {});
        const callback2: any = chai.spy(() => {});
        const action: any = chai.spy(() => {});
        const monacoAdapterAction = new MonacoAdapterAction({
            action,
            id: "foo",
        });

        monacoAdapterAction.addConfig({
            getMonacoModelValue: callback1,
            updateMonacoModelValue: callback2,
            messageSystemType: MessageSystemType.custom,
        });

        expect(action).to.have.been.called.exactly(0);

        monacoAdapterAction.invoke();

        expect(action).to.have.been.called.exactly(1);
        expect(action).to.have.been.called.with({
            id: "foo",
            getMonacoModelValue: callback1,
            updateMonacoModelValue: callback2,
            messageSystemType: MessageSystemType.custom,
        });
    });
    it("should return the MessageSystemType when using the getMessageSystemType", () => {
        const callback1: any = () => {};
        const callback2: any = () => {};
        const action: any = () => {};
        const monacoAdapterAction = new MonacoAdapterAction({
            action,
            id: "foo",
        });

        monacoAdapterAction.addConfig({
            getMonacoModelValue: callback1,
            updateMonacoModelValue: callback2,
            messageSystemType: MessageSystemType.custom,
        });

        expect(monacoAdapterAction.getMessageSystemType()).to.equal(
            MessageSystemType.custom
        );
    });
    it("should return true if the MessageSystemType matches", () => {
        const callback1: any = () => {};
        const callback2: any = () => {};
        const action: any = () => {};
        const monacoAdapterAction = new MonacoAdapterAction({
            action,
            id: "foo",
        });

        monacoAdapterAction.addConfig({
            getMonacoModelValue: callback1,
            updateMonacoModelValue: callback2,
            messageSystemType: MessageSystemType.custom,
        });

        expect(monacoAdapterAction.matches(MessageSystemType.custom)).to.equal(true);
    });
    it("should return false if the MessageSystemType does not match", () => {
        const callback1: any = () => {};
        const callback2: any = () => {};
        const action: any = () => {};
        const monacoAdapterAction = new MonacoAdapterAction({
            action,
            id: "foo",
        });

        monacoAdapterAction.addConfig({
            getMonacoModelValue: callback1,
            updateMonacoModelValue: callback2,
            messageSystemType: MessageSystemType.custom,
        });

        expect(monacoAdapterAction.matches(MessageSystemType.initialize)).to.equal(false);
    });
});
