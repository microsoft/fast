import {
    MessageSystemIncoming,
    MessageSystemOutgoing,
} from "./message-system.utilities.props";
/**
 * The default name that the display text maps to
 */
export declare const dataSetName: string;
export declare function getMessage<C = {}>(
    data: MessageSystemIncoming<C>
): MessageSystemOutgoing<C>;
