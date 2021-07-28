import {
    fluentButton,
    fluentCard,
    fluentCheckbox,
    fluentDesignSystemProvider,
    fluentSlider,
    fluentSliderLabel,
    fluentTextField,
} from "@fluentui/web-components";
import { DesignSystem } from "@microsoft/fast-foundation";
import { TodoApp } from "./todo-app";
import { TodoForm } from "./todo-form";
import { DesignPropertyPanel } from "./design-property-panel";

DesignSystem.getOrCreate()
    .withPrefix("fluent")
    .register(
        fluentDesignSystemProvider(),
        fluentButton(),
        fluentCheckbox(),
        fluentTextField(),
        fluentCard(),
        fluentSlider(),
        fluentSliderLabel()
    );

TodoForm;
TodoApp;
DesignPropertyPanel;
