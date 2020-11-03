import { FASTDesignTokenLibrary } from "./library";
import { DI } from "../di";

export interface IDesignTokens {
    backgroundColor: string;
}

const defaults: IDesignTokens = {
    backgroundColor: "#FFFFFF",
};

export const DefaultDesignTokens = new FASTDesignTokenLibrary<IDesignTokens>(defaults);
export const DesignTokens = DI.createInterface<
    FASTDesignTokenLibrary<IDesignTokens>
>().withDefault(x => x.instance(DefaultDesignTokens));
