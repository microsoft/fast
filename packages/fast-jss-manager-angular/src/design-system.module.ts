import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DesignSystemDirective } from "./design-system.directive";

@NgModule({
    declarations: [
        DesignSystemDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        DesignSystemDirective
    ]
})

export class DesignSystemModule {}
