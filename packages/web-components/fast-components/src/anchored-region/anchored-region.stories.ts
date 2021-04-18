import { Direction, RtlScrollConverter } from "@microsoft/fast-web-utilities";
import addons from "@storybook/addons";
import { STORY_RENDERED } from "@storybook/core-events";
import AnchoredRegionTemplate from "./fixtures/base.html";
import type { FASTAnchoredRegion } from "./index";
import "./index";

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
            const menu: FASTAnchoredRegion = document.getElementById(
                "header-menu-fixed"
            ) as FASTAnchoredRegion;
            if (menu.style.display === "none") {
                menu.style.display = "";
            } else {
                menu.style.display = "none";
            }
        });

        const headerScalingButton = document.getElementById("anchor-header-menu-scaling");
        headerScalingButton?.addEventListener("click", (e: MouseEvent) => {
            const menu: FASTAnchoredRegion = document.getElementById(
                "header-menu-scaling"
            ) as FASTAnchoredRegion;
            if (menu.style.display === "none") {
                menu.style.display = "";
            } else {
                menu.style.display = "none";
            }
        });

        const regionScalingUpdate = document.getElementById(
            "region-upd1"
        ) as FASTAnchoredRegion;
        document
            .getElementById("viewport-upd1")!
            .addEventListener("scroll", () => regionScalingUpdate.update());

        const togglesRegion = document.getElementById("toggles-region");

        // toggle anchor example
        document.querySelectorAll("[id^=toggles1-anchor").forEach(anchor => {
            anchor.addEventListener("click", (e: MouseEvent) => {
                togglesRegion!.setAttribute("anchor", (e.target as HTMLElement).id);
            });
        });

        document
            .getElementById("toggle-positions-horizontal")!
            .addEventListener("click", (e: MouseEvent) => {
                if (
                    togglesRegion?.getAttribute("horizontal-default-position") === "right"
                ) {
                    togglesRegion!.setAttribute("horizontal-default-position", "left");
                } else {
                    togglesRegion!.setAttribute("horizontal-default-position", "right");
                }
            });

        document
            .getElementById("toggle-positions-vertical")!
            .addEventListener("click", (e: MouseEvent) => {
                if (togglesRegion?.getAttribute("vertical-default-position") === "top") {
                    togglesRegion!.setAttribute("vertical-default-position", "bottom");
                } else {
                    togglesRegion!.setAttribute("vertical-default-position", "top");
                }
            });

        document
            .querySelectorAll("[id^=anchor-menu-many]")
            .forEach((el: HTMLButtonElement) => {
                el.addEventListener("click", (e: MouseEvent) => {
                    const menuNum = el.id.substr(16, el.id.length - 16);
                    const menu: FASTAnchoredRegion = document.getElementById(
                        `menu-many${menuNum}`
                    ) as FASTAnchoredRegion;
                    if (menu.style.display === "none") {
                        menu.style.display = "";
                    } else {
                        menu.style.display = "none";
                    }
                });
            });

        // document.getElementById("toggle-inset-vertical")!.addEventListener("click", (e: MouseEvent) => {
        //     if ((togglesRegion as FASTAnchoredRegion)!.verticalInset === true){
        //         (togglesRegion as FASTAnchoredRegion)!.verticalInset = false;
        //     } else {
        //         (togglesRegion as FASTAnchoredRegion)!.verticalInset = true;
        //     }
        // });

        // document.getElementById("toggle-inset-horizontal")!.addEventListener("click", (e: MouseEvent) => {
        //     if ((togglesRegion as FASTAnchoredRegion)!.horizontalInset === true){
        //         (togglesRegion as FASTAnchoredRegion)!.horizontalInset = false;
        //     } else {
        //         (togglesRegion as FASTAnchoredRegion)!.horizontalInset = true;
        //     }
        // });
    }
});

const providerStyles = `
fast-design-system-provider {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
`;

export default {
    title: "Anchored Region",
    decorators: [
        Story => `
            <style>${providerStyles}</style>
            ${Story()}
        `,
    ],
};

export const AnchoredRegion = () => AnchoredRegionTemplate;
