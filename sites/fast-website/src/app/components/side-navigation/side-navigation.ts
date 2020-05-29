import { attr, observable, FASTElement } from "@microsoft/fast-element";
import {
    CommunityContentPlacementData,
    communityContentPlacementData,
} from "../../data/community.data";
import { throttle } from "lodash-es";

export class SideNavigation extends FASTElement {
    @attr
    public category: string;

    // TODO: can be removed to used sectionArray.length once index is restructured to have the correct amount of sections.
    @attr
    public sections: number;

    @observable
    public currentSection: number = 0;

    // TODO: flter can be removed when index is updated
    @observable
    public sectionArray: HTMLElement[] = Array.from(
        document.querySelectorAll("section")
    ).filter(x => x.id !== "");

    public updateCurrentSection = (): void => {
        const fromTop = window.scrollY;

        // TODO: replace sections with sectionArray.length after rebase with John's code that reduces sections down to 5
        for (let i = 0; i < this.sections; i++) {
            const section: HTMLElement | null = document.getElementById(
                `${this.sectionArray[i].id}`
            );
            if (section === null) {
                continue;
            } else if (
                section.offsetTop <= fromTop &&
                section.offsetTop + section.offsetHeight > fromTop
            ) {
                this.currentSection = i;
            }
        }
    };

    public socialData: CommunityContentPlacementData[] = communityContentPlacementData.filter(
        x => x.header !== "Github"
    );

    constructor() {
        super();

        window.addEventListener("scroll", throttle(this.updateCurrentSection, 100));
    }
}
