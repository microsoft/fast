import "@microsoft/fast-test-harness/ssr/entry-client.js";

import { RenderableFASTElement } from "@microsoft/fast-html";
import { definition, TestWidget } from "./test-widget/test-widget.js";

RenderableFASTElement(TestWidget).defineAsync({
    name: definition.name,
    templateOptions: "defer-and-hydrate",
});
