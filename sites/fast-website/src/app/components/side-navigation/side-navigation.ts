import { attr, observable, FASTElement } from "@microsoft/fast-element";
import {
    CommunityContentPlacementData,
    communityContentPlacementData,
} from "../../data/community.data";

export interface sectionData {
    section: string;
    intersectionRatio: number;
}

export class SideNavigation extends FASTElement {
    @attr
    public category: string;

    @observable
    public currentSection: string = "hero";

    @observable
    public sectionArray: HTMLElement[] = [];

    @observable
    public sectionDataArray: sectionData[];

    @observable
    public previousY: number = 0;

    public socialData: CommunityContentPlacementData[] = communityContentPlacementData.filter(
        x => x.header !== "GitHub"
    );

    reduceFunc = (prev: sectionData, current: sectionData) =>
        prev.intersectionRatio > current.intersectionRatio ? prev : current;

    scrollDirectionFunc = () => {
        const currentY: number = window.pageYOffset;
        const scrollArray: sectionData[] = this.sectionDataArray.concat();

        if (currentY < this.previousY) {
            scrollArray.reverse();
        }

        this.previousY = currentY;
        this.currentSection = scrollArray.reduce(this.reduceFunc).section;
    };

    createObserver = (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
            const intersectingSection: sectionData = this.sectionDataArray.find(
                ({ section }) => section === entry.target.id
            ) as sectionData;
            intersectingSection.intersectionRatio = entry.intersectionRatio;
        });

        this.scrollDirectionFunc();
    };

    loadScrollers() {
        this.sectionArray = Array.from(document.querySelectorAll("section[id]"));

        this.sectionDataArray = this.sectionArray.map(x => {
            return { section: x.id, intersectionRatio: 0 };
        });

        let observer = new IntersectionObserver(this.createObserver, {
            threshold: [0, 0.2, 0.4, 0.6, 0.8],
        });
        this.sectionArray.forEach(section => {
            observer.observe(section);
        });
    }

    connectedCallback() {
        super.connectedCallback();

        if (this.getAttribute("category") === "scroll") {
            window.addEventListener("DOMContentLoaded", () => this.loadScrollers());
        }
    }
}
