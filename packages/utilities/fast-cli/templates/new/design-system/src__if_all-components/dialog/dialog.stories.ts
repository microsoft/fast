import DialogTemplate from "./fixtures/dialog.html";
import "./index";

export default {
    title: "Components/Dialog",
};

export const Dialog = (): string => DialogTemplate;

const dialogExample = `
</* @echo namespace */-dialog id="foo" aria-label="Simple dialog" modal="true">
  <h2>Dialog with text and button. The button should recieve focus</h2>
  <button>Button A</button>
  <button id="element" autofocus>Should autofocus</button>
<//* @echo namespace */-dialog>
`;

Dialog.parameters = {
    docs: {
        source: {
            code: dialogExample,
        },
    },
};
