import { Directive, ElementRef, Input, SimpleChanges } from "@angular/core";
import { eventTypes } from "./utilities/get-event-types";
import jss, { stylesheetManager } from "./jss";

/**
 * Directive definition
 */
@Directive({
    selector: "design-system",
})

/**.
 * Class definition
 */
export class DesignSystemDirective {
    @Input() private config: any;

    private el: HTMLElement;
    private children: EventTarget[];

    constructor(el: ElementRef) {
        this.el = el.nativeElement;
        this.children = [];

        this.el.addEventListener(eventTypes.getConfig, (e: CustomEvent) => {
            Object.assign(e.detail, this.config);
        }, true);

        this.el.addEventListener(eventTypes.registerComponent, (e: CustomEvent) => {
            this.children.push(e.target);
        }, true);

        this.el.addEventListener(eventTypes.deregisterComponent, (e: CustomEvent) => {
            this.children.filter((child: EventTarget) => child !== e.target);
        }, true);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.config.currentValue !== changes.config.previousValue) {
            const event: CustomEvent = new CustomEvent(eventTypes.update);

            this.children.forEach((child: EventTarget) => {
                child.dispatchEvent(event);
            });
        }
    }
}
