import { ConfigurationImpl } from "@microsoft/fast-foundation";
import { FASTCard } from "../src/card";

const MyAppConfig = new ConfigurationImpl();

MyAppConfig.registerDesignToken({
    key: "backgroundColor",
    customProperty: "background-color",
    value: "#F7F7F7",
})
    .register(FASTCard())
    .attachDesignTokensTo(document);

(window as any).appConfig = MyAppConfig;

const picker = document.querySelector("input") as HTMLInputElement;

if (picker) {
    picker.value = MyAppConfig["designTokens"].get("backgroundColor");
    picker.addEventListener("change", e => {
        MyAppConfig.designTokens.set(
            "backgroundColor",
            (e.target as HTMLInputElement).value
        );
    });
}
