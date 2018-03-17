
import { getApiSupport, APIName } from "../";

export class OnMessageExternal {
    public addListener(callback: (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => void) {
        switch (getApiSupport()) {
            case APIName.chrome:
                chrome.runtime.onMessageExternal.addListener(callback);
                break;
            case APIName.browser:
                browser.runtime.onMessageExternal.addListener(callback);
        }
    }
}

export default class RuntimeApi {
    /**
     * Remove a context menu by id
     */
    public onMessageExternal = new OnMessageExternal();
}
