import { attr, observable, FASTElement } from "@microsoft/fast-element";
import {
    CommunityContentPlacementData,
    communityContentPlacementData,
} from "../../data/community.data";

export interface sectionData {
    section: string;
    value: number;
}

export class SideNavigation extends FASTElement {
    @attr
    public category: string;

    @observable
    public currentSection: string = "hero";

    @observable
    public sectionArray: HTMLElement[] = [];

    @observable
    public objArray: sectionData[];

    public socialData: CommunityContentPlacementData[] = communityContentPlacementData.filter(
        x => x.header !== "Github"
    );

    loadScrollers() {
        this.sectionArray = Array.from(document.querySelectorAll("section[id]"));

        this.objArray = this.sectionArray.map(x => {
            return { section: x.id, value: 0 };
        });

        let observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    const intersectingSection: sectionData = this.objArray.find(
                        ({ section }) => section === entry.target.id
                    ) as sectionData;
                    intersectingSection.value = entry.intersectionRatio;
                    this.currentSection = this.objArray.reduce((prev, current) =>
                        prev.value > current.value ? prev : current
                    ).section;
                });
            },
            { threshold: [0, 0.2, 0.4, 0.6, 0.8] }
        );
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
