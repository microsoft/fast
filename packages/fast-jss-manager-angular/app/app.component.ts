import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: `<div>
                <design-system [config]="redConfig">
                  <example>red</example>
                </design-system>
                <design-system [config]="blueConfig">
                  <example>blue</example>
                  <design-system [config]="purpleConfig">
                    <example>purple</example>
                  </design-system>
                </design-system>
            </div>`
})
export class AppComponent {
  private redConfig: any;
  private blueConfig: any;
  private purpleConfig: any;

  constructor() {
    this.redConfig = {
      color: "red"
    };

    this.blueConfig = {
      color: "blue"
    };

    this.purpleConfig = {
      color: "purple"
    };
  }
}
