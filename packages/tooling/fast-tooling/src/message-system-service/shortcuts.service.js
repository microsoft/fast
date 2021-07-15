import { MessageSystemType } from "../message-system";
import { MessageSystemService } from "./message-system.service";
export const shortcutsId = "fast-tooling::shortcuts-service";
export class Shortcuts extends MessageSystemService {
    constructor(config) {
        super();
        /**
         * The listener to attach to HTML elements
         */
        this.listener = e => {
            this.registeredActions.forEach(action => {
                if (action.matches(e)) {
                    action.invoke();
                }
            });
        };
        /**
         * Handles messages from the message system
         */
        this.handleMessageSystem = e => {
            switch (e.data.type) {
                case MessageSystemType.initialize:
                    this.messageSystem.postMessage({
                        type: MessageSystemType.custom,
                        action: "initialize",
                        id: shortcutsId,
                        shortcuts: this.registeredActions.map(shortcutAction => {
                            return {
                                name: shortcutAction.name,
                                keys: shortcutAction.keys,
                            };
                        }),
                        options: {
                            originatorId: "fast-tooling::shortcuts-service",
                        },
                    });
                    break;
            }
        };
        this.getActionConfig = id => {
            this.registeredActions.forEach(action => {
                if (action.id === id) {
                    return {
                        name: action.name,
                        keys: action.keys,
                    };
                }
            });
            return {
                error: `No such action found.`,
            };
        };
        this.registerMessageSystem(
            Object.assign(Object.assign({}, config), {
                id: shortcutsId,
                config: {
                    eventListener: this.listener,
                    eventListenerType: "keypress",
                },
            })
        );
    }
}
