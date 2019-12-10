/// <reference lib="webworker" />

import {
    MessageSystemComponentTypeAction,
    MessageSystemData,
    MessageSystemType,
} from "./message-system.props";

/**
 * This is the Message System, through which:
 * - Components may opt in/out of the messages
 * - Data manipulation may be performed
 *
 * The main purpose of this is to tie together
 * process heavy actions onto a separate thread,
 * as well as to allow components to opt into a
 * single source for data updates.
 */

const registeredComponents: object = {};

onmessage = function(e: MessageEvent): void {
    switch ((e.data as MessageSystemData).type) {
        case MessageSystemType.component:
            switch (e.data.action) {
                case MessageSystemComponentTypeAction.register:
                    registeredComponents[e.data.id] = {
                        self: e.data.id,
                    };

                    postMessage({
                        type: "component",
                        action: "registered",
                        id: e.data.id,
                    });
                    break;
                case MessageSystemComponentTypeAction.deregister:
                    delete registeredComponents[e.data.id];

                    postMessage({
                        type: "component",
                        action: "de-registered",
                        id: e.data.id,
                    });
                    break;
            }
    }
};
