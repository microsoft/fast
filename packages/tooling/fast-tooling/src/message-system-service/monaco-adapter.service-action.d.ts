import { MessageSystemType } from "../message-system";
import { MessageSystemServiceAction } from "./message-system.service-action";
export interface MonacoAdapterActionCallbackConfig {
    /**
     * Retrieve the Monaco Model value
     */
    getMonacoModelValue: () => string[];
    /**
     * Update the Monaco Model value
     */
    updateMonacoModelValue: (value: string[], isExternal: boolean) => void;
    /**
     * The message system type to run on
     */
    messageSystemType: MessageSystemType;
}
/**
 * Actions for the monaco adapter
 */
export declare class MonacoAdapterAction extends MessageSystemServiceAction<
    MonacoAdapterActionCallbackConfig,
    MessageSystemType
> {
    private getMonacoModelValue;
    private updateMonacoModelValue;
    private messageSystemType;
    constructor(config: any);
    /**
     * Invokes the action
     */
    invoke: () => void;
    /**
     * Retrieve callbacks from parent adapter
     */
    addConfig(config: MonacoAdapterActionCallbackConfig): void;
    /**
     * Retrieve the message system type for this action
     */
    getMessageSystemType(): MessageSystemType;
    matches: (type: MessageSystemType) => boolean;
}
