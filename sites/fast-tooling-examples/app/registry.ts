import exampleReact1 from "./example-react-1";
import exampleWebComponent1 from "./example-web-component-1";

export default {
    [exampleReact1.id]: {
        text: exampleReact1.text,
    },
    [exampleWebComponent1.id]: {
        text: exampleWebComponent1.text,
    },
};
