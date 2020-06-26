import { FASTDesignSystemProvider } from "../design-system-provider";
import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";
import UnityHostTemplate from "./fixtures/unity-host.html";
import { FASTUnityHost } from "./";
import { FASTSwitch } from "../switch";

// Prevent tree-shaking
FASTUnityHost;
FASTDesignSystemProvider;

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("unity-host")) {
        configureUi();
    }
});

function configureUi(): void {
    document.querySelectorAll("fast-switch").forEach(el => {
        if (el.id.startsWith("switch-")) {
            const instanceId: string = el.id.slice(7);

            (el as FASTSwitch).onchange = event => {
                const host: HTMLElement | null = document.getElementById(
                    `unity-host-${instanceId}`
                );
                if (host === null) {
                    return;
                }
                (host.parentNode as FASTUnityHost).messageUnity(
                    "Background",
                    "SetEnableUFOs",
                    boolToNumber((el as FASTSwitch).checked)
                );
            };
        }
    });
}

function boolToNumber(valAsBool: boolean): number {
    return valAsBool ? 1 : 0;
}

export default {
    title: "Unity Host",
};

export const UnityHost = () => UnityHostTemplate;
