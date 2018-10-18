import { Component } from "@angular/core";

export interface DesignSystem {
    red: any;
    blue: any;
    purple: any;
}

@Component({
    selector: "app-root",
    template: `<div>
                <design-system [config]="config.red">
                  <example>red</example>
                </design-system>
                <design-system [config]="config.blue">
                  <example>blue</example>
                  <design-system [config]="config.purple">
                    <example>purple</example>
                  </design-system>
                </design-system>
            </div>`,
})
export class AppComponent {
    private config: DesignSystem;

    constructor() {
        this.config = {
            red: {
                color: "red",
            },
            blue: {
                color: "blue",
            },
            purple: {
                color: "purple",
            },
        };
    }
}
