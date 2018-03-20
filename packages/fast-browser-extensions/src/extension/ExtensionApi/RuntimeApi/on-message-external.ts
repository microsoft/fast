import { getApiSupport, APIName } from "../";

export type SendResponse = (response: any) => void;

export default class OnMessageExternal {
    public addListener(callback: (message: any, sender: chrome.runtime.MessageSender, sendResponse: SendResponse) => void): void {
        switch (getApiSupport()) {
            case APIName.chrome:
                chrome.runtime.onMessageExternal.addListener(callback);
                break;
            case APIName.browser:
                browser.runtime.onMessageExternal.addListener(callback);
                break;
        }
    }
}
