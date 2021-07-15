var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                    ? (desc = Object.getOwnPropertyDescriptor(target, key))
                    : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
import { attr, observable, FASTElement } from "@microsoft/fast-element";
import { communityContentPlacementData } from "../../data/community.data";
export class SideNavigation extends FASTElement {
    constructor() {
        super(...arguments);
        this.currentSection = "hero";
        this.sectionArray = [];
        this.previousY = 0;
        this.socialData = communityContentPlacementData.filter(
            x => x.header !== "GitHub"
        );
        this.reduceFunc = (prev, current) =>
            prev.intersectionRatio > current.intersectionRatio ? prev : current;
        this.scrollDirectionFunc = () => {
            const currentY = window.pageYOffset;
            const scrollArray = this.sectionDataArray.concat();
            if (currentY < this.previousY) {
                scrollArray.reverse();
            }
            this.previousY = currentY;
            this.currentSection = scrollArray.reduce(this.reduceFunc).section;
        };
        this.createObserver = entries => {
            entries.forEach(entry => {
                const intersectingSection = this.sectionDataArray.find(
                    ({ section }) => section === entry.target.id
                );
                intersectingSection.intersectionRatio = entry.intersectionRatio;
            });
            this.scrollDirectionFunc();
        };
    }
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
__decorate([attr], SideNavigation.prototype, "category", void 0);
__decorate([observable], SideNavigation.prototype, "currentSection", void 0);
__decorate([observable], SideNavigation.prototype, "sectionArray", void 0);
__decorate([observable], SideNavigation.prototype, "sectionDataArray", void 0);
__decorate([observable], SideNavigation.prototype, "previousY", void 0);
