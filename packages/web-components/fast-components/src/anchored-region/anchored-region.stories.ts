import { Direction, RtlScrollConverter } from "@microsoft/fast-web-utilities";
import addons from "@storybook/addons";
import { STORY_RENDERED } from "@storybook/core-events";
import { AnchoredRegion as FoundationAnchoredRegion } from "@microsoft/fast-foundation";
import AnchoredRegionTemplate from "./fixtures/base.html";
import "./index.js";

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("anchored-region")) {
        //scroll stuff into view
        document.querySelectorAll("div[id^=viewport]").forEach((el: HTMLElement) => {
            el.scrollTop = 280;
            RtlScrollConverter.setScrollLeft(
                el,
                el.dir === Direction.rtl ? -250 : 250,
                el.dir === Direction.rtl ? Direction.rtl : Direction.ltr
            );
        });

        // header region
        const headerFixedButton = document.getElementById("anchor-header-menu-fixed");
        headerFixedButton?.addEventListener("click", (e: MouseEvent) => {
            const menu: FoundationAnchoredRegion = document.getElementById(
                "header-menu-fixed"
            ) as FoundationAnchoredRegion;
            if (menu.style.display === "none") {
                menu.style.display = "";
            } else {
                menu.style.display = "none";
            }
        });

        const headerScalingButton = document.getElementById("anchor-header-menu-scaling");
        headerScalingButton?.addEventListener("click", (e: MouseEvent) => {
            const menu: FoundationAnchoredRegion = document.getElementById(
                "header-menu-scaling"
            ) as FoundationAnchoredRegion;
            if (menu.style.display === "none") {
                menu.style.display = "";
            } else {
                menu.style.display = "none";
            }
        });

        const regionScalingUpdate = document.getElementById(
            "region-upd1"
        ) as FoundationAnchoredRegion;
        const viewPort = document.getElementById("viewport-upd1");
        const togglesRegion = document.getElementById("toggles-region");

        if (!togglesRegion || !viewPort) {
            return;
        }

        viewPort.addEventListener("scroll", () => regionScalingUpdate.update());

        // toggle anchor example
        document.querySelectorAll("[id^=toggles1-anchor").forEach(anchor => {
            anchor.addEventListener("click", (e: MouseEvent) => {
                togglesRegion.setAttribute("anchor", (e.target as HTMLElement).id);
            });
        });

        [
            {
                id: "toggle-positions-horizontal",
                attribute: "horizontal-default-position",
                firstValue: "right",
                secondValue: "left",
            },
            {
                id: "toggle-positions-vertical",
                attribute: "vertical-default-position",
                firstValue: "top",
                secondValue: "bottom",
            },
            {
                id: "toggle-inset-vertical",
                attribute: "vertical-inset",
                firstValue: "true",
                secondValue: "false",
            },
            {
                id: "toggle-inset-horizontal",
                attribute: "horizontal-inset",
                firstValue: "true",
                secondValue: "false",
            },
        ].forEach(({ id, attribute, firstValue, secondValue }) => {
            const toggleElement = document.getElementById(id);
            if (toggleElement) {
                toggleElement.addEventListener("click", () => {
                    togglesRegion.setAttribute(
                        attribute,
                        togglesRegion.getAttribute(attribute) === firstValue
                            ? secondValue
                            : firstValue
                    );
                });
            }
        });

        document
            .querySelectorAll("[id^=anchor-menu-many]")
            .forEach((el: HTMLButtonElement) => {
                el.addEventListener("click", (e: MouseEvent) => {
                    const menuNum = el.id.substr(16);
                    const menu: FoundationAnchoredRegion = document.getElementById(
                        `menu-many${menuNum}`
                    ) as FoundationAnchoredRegion;
                    menu.style.display = menu.style.display === "none" ? "" : "none";
                });
            });
    }
});

export default {
    title: "Anchored Region",
};

export const AnchoredRegion = () => AnchoredRegionTemplate;
