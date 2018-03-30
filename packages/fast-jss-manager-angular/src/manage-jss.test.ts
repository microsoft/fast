import {Component, ElementRef, Input} from "@angular/core";
import {async, TestBed} from "@angular/core/testing";
import manageJss, {ComponentStyles} from "./manage-jss";
import {DesignSystemDirective} from "./design-system.directive";

/**
 * Component definition
 */
@Component({
    selector: "example-with-directive",
    template: `<design-system config="{color: 'red'}"><span [class]="className || ''">{{ text }}</span></design-system>`
})

/**
 * Class definition
 */
class SimpleDirectiveComponent {
    @Input() private className: string;
    @Input() private text: string;

    constructor(private el: ElementRef) { }
}

const styles: any = {
    example: {
        color: (config: any): string => {
            return config.color;
        },
        fontWeight: (config: any): string => {
            return config.weight;
        },
        background: "yellow"
    }
};

const JSSComponent: any = manageJss(styles)(SimpleDirectiveComponent);

describe("The return value of manage JSS", (): void => {
    test("should return a function", (): void => {
        expect(typeof manageJss()).toBe("function");
    });

    test("should return a function that returns a function", (): void => {
        expect(typeof manageJss()(SimpleDirectiveComponent)).toBe("function");
    });
});

describe("The directive", (): void => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                DesignSystemDirective,
                JSSComponent
            ],
        }).compileComponents();
    }));
    it("should create a component wrapped with the directive", async(() => {
        const fixture: any = TestBed.createComponent(JSSComponent);
        const directiveComponent: any = fixture.debugElement.componentInstance;

        expect(directiveComponent).toBeTruthy();
    }));
});
