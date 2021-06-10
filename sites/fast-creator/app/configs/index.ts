import { fastLinkedDataExamples } from "./library.fast.examples";
import { nativeLinkedDataExamples } from "./library.native.examples";
import { ExampleData } from "./typings";

const linkedDataExamples: ExampleData = {
    ...fastLinkedDataExamples,
    ...nativeLinkedDataExamples,
};

export { linkedDataExamples };
