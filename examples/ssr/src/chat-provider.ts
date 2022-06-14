import { DI } from "@microsoft/fast-foundation";

export interface ChatMessage {
    author: string | "self";
    content: string[];
}
export interface ChatProvider {
    readonly messages: ChatMessage[];
    add(message: ChatMessage): void;
}

export const ChatProvider = DI.createContext<ChatProvider>();
