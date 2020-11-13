import { DI, InterfaceSymbol } from "../di";
import { FASTDesignTokenLibrary } from "./library";

export const DesignTokens: InterfaceSymbol<FASTDesignTokenLibrary<
    any
>> = DI.createDOMInterface<FASTDesignTokenLibrary<any>>("DesignTokens").noDefault();
