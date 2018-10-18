import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import ExampleComponent from "./components/example.component";
import { DesignSystemModule } from "../src/design-system.module";

@NgModule({
    declarations: [AppComponent, ExampleComponent],
    imports: [BrowserModule, DesignSystemModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
