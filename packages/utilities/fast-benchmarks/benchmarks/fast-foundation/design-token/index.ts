import { DesignToken } from "@microsoft/fast-foundation";

(window as any).test = () => {
    DesignToken.create<number>("").withDefault(12);
};
