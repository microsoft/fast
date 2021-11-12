import {
    fluentButton,
    fluentCard,
    fluentCheckbox,
    fluentDesignSystemProvider,
    fluentSlider,
    fluentSliderLabel,
    fluentTextField,
    provideFluentDesignSystem,
} from "@fluentui/web-components";
import { TodoApp } from "./todo-app";
import { TodoForm } from "./todo-form";
import { DesignPropertyPanel } from "./design-property-panel";

provideFluentDesignSystem().register(
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
