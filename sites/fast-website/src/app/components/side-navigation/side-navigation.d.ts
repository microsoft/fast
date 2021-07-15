import { FASTElement } from "@microsoft/fast-element";
import { CommunityContentPlacementData } from "../../data/community.data";
export interface sectionData {
    section: string;
    intersectionRatio: number;
}
export declare class SideNavigation extends FASTElement {
    category: string;
    currentSection: string;
    sectionArray: HTMLElement[];
    sectionDataArray: sectionData[];
    previousY: number;
    socialData: CommunityContentPlacementData[];
    reduceFunc: (prev: sectionData, current: sectionData) => sectionData;
    scrollDirectionFunc: () => void;
    createObserver: (entries: IntersectionObserverEntry[]) => void;
    loadScrollers(): void;
    connectedCallback(): void;
}
