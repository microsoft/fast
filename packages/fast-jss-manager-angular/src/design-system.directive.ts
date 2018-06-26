import { Directive, ElementRef, Inject, Input, SimpleChanges } from "@angular/core";
import { eventNames } from "./utilities/get-event-names";

/**
 * This directive stores and manages custom events requesting the design system configuration
 */
@Directive({
    selector: "design-system",
})
export class DesignSystemDirective {
    @Input() private config: any;

    private el: HTMLElement;
    private children: EventTarget[];

    constructor(@Inject(ElementRef) private hostElement: ElementRef) {
        this.el = hostElement.nativeElement;
        this.children = [];

        this.el.addEventListener(eventNames.getConfig, this.handleGetConfig, true);
        this.el.addEventListener(eventNames.registerComponent, this.handleRegisterComponent, true);
        this.el.addEventListener(eventNames.deregisterComponent, this.handleDeregisterComponent, true);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.config.currentValue !== changes.config.previousValue) {
            const event: CustomEvent = new CustomEvent(eventNames.update);

            this.children.forEach((child: EventTarget) => {
                child.dispatchEvent(event);
            });
        }
    }

    public ngOnDestroy(): void {
        this.el.removeEventListener(eventNames.getConfig, this.handleGetConfig, true);
        this.el.removeEventListener(eventNames.registerComponent, this.handleRegisterComponent, true);
        this.el.removeEventListener(eventNames.deregisterComponent, this.handleDeregisterComponent, true);
    }

    /**
     * Handles merging the event details with the config given to the directive
     */
    private handleGetConfig = (e: CustomEvent): void => {
        Object.assign(e.detail, this.config);
    }

    /**
     * Handles registering the component with the design system directive
     */
    private handleRegisterComponent = (e: CustomEvent): void => {
        this.children.push(e.target);
    }

    /**
     * Handles de-registering the component with the design system directive
     */
    private handleDeregisterComponent = (e: CustomEvent): void => {
        this.children.filter((child: EventTarget) => child !== e.target);
    }
}
