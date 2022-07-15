import { DesignToken } from "@microsoft/fast-foundation";

const test = () =>
    DesignToken.create<number>("").withDefault(12);

    console.log("I'm being executed")
globalThis.myTest = test;
