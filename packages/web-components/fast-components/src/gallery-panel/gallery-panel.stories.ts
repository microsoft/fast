import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";
import type {
    GalleryPanel as FoundationGalleryPanel,
    GalleryPanelData,
    GalleryData,
    GalleryItemData,
} from "@microsoft/fast-foundation";
import GalleryPanelTemplate from "./fixtures/base.html";
import "./index";

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("gallery-panel")) {
        const galleryPanelData: GalleryPanelData = {
            title: "A gallery panel",
            galleries: generateGalleries(1000, ""),
        };

        const galleryPanel = document.getElementById(
            "samplegallery"
        ) as FoundationGalleryPanel;
        galleryPanel.panelData = galleryPanelData;
    }
});

function generateGalleries(galleryCount: number, prefix: string): GalleryData[] {
    const newGalleries: GalleryData[] = [];
    for (let i = 1; i <= galleryCount; i++) {
        newGalleries.push({
            title: `gallery #${i}`,
            items: generateGalleryItems(1000, prefix),
        });
    }
    return newGalleries;
}

function generateGalleryItems(itemCount: number, prefix: string): GalleryItemData[] {
    const newItems: GalleryItemData[] = [];
    for (let i = 1; i <= itemCount; i++) {
        newItems.push({
            title: `item #${i}`,
            image: `https://picsum.photos/200/300?random=${prefix}${1000 + i}`,
        });
    }
    return newItems;
}

export default {
    title: "Gallery Panel",
};

export const GalleryPanel = () => GalleryPanelTemplate;
