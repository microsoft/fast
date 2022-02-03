import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";
import type {
    GalleryPanel as FoundationGalleryPanel,
    GalleryData,
} from "@microsoft/fast-foundation";
import GalleryPanelTemplate from "./fixtures/base.html";
import "./index";

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("gallery-panel")) {
        const galleryPanelData: GalleryData = {
            title: "A gallery panel",
            galleryType: "gallery-group",
            items: generateGalleryGroups(500),
        };

        const galleryPanel = document.getElementById(
            "samplegallery"
        ) as FoundationGalleryPanel;
        galleryPanel.galleryData = galleryPanelData;
    }
});

function generateGalleryGroups(galleryCount: number): GalleryData[] {
    const newGalleries: GalleryData[] = [];
    for (let i = 1; i <= galleryCount; i++) {
        newGalleries.push({
            title: `gallery group #${i}`,
            galleryType: "gallery-group",
            items: generateGalleries(
                Math.floor(Math.random() * 9 + 1),
                `gallery group #${i} - `
            ),
        });
    }
    return newGalleries;
}

function generateGalleries(galleryCount: number, prefix: string): GalleryData[] {
    const newGalleries: GalleryData[] = [];
    for (let i = 1; i <= galleryCount; i++) {
        newGalleries.push({
            title: `${prefix} gallery #${i}`,
            galleryType: "gallery",
            items: generateGalleryItems(1000, i),
        });
    }
    return newGalleries;
}

function generateGalleryItems(itemCount: number, galleryNum: number): GalleryData[] {
    const newItems: GalleryData[] = [];
    for (let i = 1; i <= itemCount; i++) {
        newItems.push({
            title: `item #${i}`,
            galleryType: "gallery-item",
            image: `https://picsum.photos/200/200?random=${galleryNum * 100 + i}`,
        });
    }
    return newItems;
}

export default {
    title: "Gallery Panel",
};

export const GalleryPanel = () => GalleryPanelTemplate;
