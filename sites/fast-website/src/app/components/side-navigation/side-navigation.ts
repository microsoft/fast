import { attr, observable, FASTElement } from "@microsoft/fast-element";
import {
    CommunityContentPlacementData,
    communityContentPlacementData,
} from "../../data/community.data";

export class SideNavigation extends FASTElement {
    @attr
    public category: string;

    @observable
    public currentSection: string = "hero";

    @observable
    public sectionArray: HTMLElement[] = Array.from(
        document.querySelectorAll("section[id]")
    );

    public socialData: CommunityContentPlacementData[] = communityContentPlacementData.filter(
        x => x.header !== "Github"
    );

    public updateCurrentSection = (): void => {
        const config = {
            threshold: 0.5,
        };

        let observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.currentSection = entry.target.id;
                }
            });
        }, config);

        this.sectionArray.forEach(section => observer.observe(section));
    };

    public clickHandler = (event, parent: boolean): void => {
        const link = parent
            ? event.target.getAttribute("href")
            : event.target.parentElement.getAttribute("href");

        event.preventDefault();

        document.querySelector(link).scrollIntoView({
            behavior: "smooth",
        });
    };

    constructor() {
        super();

        window.addEventListener("scroll", this.updateCurrentSection);
    }
}
