import { MessageSystemOutgoing } from "./message-system.utilities.props";

export type HistoryItem = MessageSystemOutgoing;

export interface History {
    items: HistoryItem[];
    limit: number;
}
