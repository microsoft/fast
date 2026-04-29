import { RenderableFASTElement } from "@microsoft/fast-html";
import "@microsoft/fast-test-harness/ssr/entry-client.js";
import { definition, TestWidget } from "./main.js";

RenderableFASTElement(TestWidget).defineAsync({
    name: definition.name,
    templateOptions: "defer-and-hydrate",
});
