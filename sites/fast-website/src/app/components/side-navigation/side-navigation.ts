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

    public lastScrollPosition: number = 0;
    public scrollIncreasing: boolean = true;
    public tick: boolean = false;

    public updateScrollIncreasing = (): void => {
        if (!this.tick) {
            setTimeout((): void => {
                this.lastScrollPosition = window.scrollY;
                if (window.scrollY > this.lastScrollPosition) {
                    this.scrollIncreasing = true;
                } else {
                    this.scrollIncreasing = false;
                }
                this.tick = false;
            }, 100);
        }
        this.tick = true;
    };

    public updateCurrentSection = (): void => {
        const config = {
            threshold: this.scrollIncreasing ? 0.2 : 0.8,
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
        window.addEventListener("scroll", this.updateScrollIncreasing);
    }
}
