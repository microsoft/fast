import { Component, ElementRef, Inject, Input } from "@angular/core";
import manageJss from "../../src";

@Component({
    selector: "example",
    template: `<span [class]="className"><ng-content></ng-content></span>`
})
class ExampleComponent {
    @Input()
    private className: string;

    constructor(@Inject(ElementRef) private el: ElementRef) {}
}

const styles: any = {
    example: {
        color: (config: any): string => {
            return config.color;
        },
        background: "yellow"
    }
};

const JSSComponent: any = manageJss(styles)(ExampleComponent);

export default JSSComponent;
