import { attr, observable, FASTElement } from "@microsoft/fast-element";
import {
    CommunityContentPlacementData,
    communityContentPlacementData,
} from "../../data/community.data";
import { throttle } from "lodash";

export class SideNavigation extends FASTElement {
    @attr
    public position: string;

    @attr
    public sections: number;

    @observable
    public currentSection: number = 0;

    // public createArray(): void {
    //     // let newArr: string[] = [];
    //     for (let i = 0; i < this.sections; i++) {
    //         // newArr.push(`${i}`);
    //         this.sectionArray.push(`${i}`);
    //     }
    //     // return(newArr)
    // };

    @observable
    public sectionArray: string[] = ["0", "1", "2", "3", "4"];

    public updatecurrentSection = (): void => {
        const fromTop = window.scrollY;

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

    // @observable
    // public sectionArray: string[] =[];

    public socialData: CommunityContentPlacementData[] = communityContentPlacementData.filter(
        x => x.header !== "Github"
    );

    constructor() {
        super();

        window.addEventListener("scroll", throttle(this.updatecurrentSection, 100));
    }

    // connectedCallback() {
    //     super.connectedCallback();
    //     this.createArray();
    //     console.log(this.sectionArray)
    //   }
}
