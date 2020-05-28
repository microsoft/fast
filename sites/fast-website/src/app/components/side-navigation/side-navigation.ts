import { attr, observable, FASTElement } from "@microsoft/fast-element";
import {
    CommunityContentPlacementData,
    communityContentPlacementData,
} from "../../data/community.data";
import { throttle } from "lodash";

export class SideNavigation extends FASTElement {
    @attr
    public position: string;

    //can be removed to used sectionArray.length once index is restructured to have the correct amount of sections.
    @attr
    public sections: number;

    @observable
    public currentSection: number = 0;

    @observable
    public sectionArray: HTMLElement[] = Array.from(document.querySelectorAll("section"));

    public updatecurrentSection = (): void => {
        const fromTop = window.scrollY;

        //replace sections with sectionArray.length after rebase with John's code that reduces sections down to 5
        for (let i = 0; i < this.sections; i++) {
            const section: HTMLElement | null = document.querySelector(`#section-${i}`);
            if (section === null) {
                break;
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

        window.addEventListener("scroll", throttle(this.updatecurrentSection, 100));
    }
}
