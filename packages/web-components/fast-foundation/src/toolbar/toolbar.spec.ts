import { customElement } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import { expect } from "chai";
import { fixture } from "../test-utilities/fixture";
import { Toolbar, toolbarTemplate as template } from "./index";

const FASTToolbar = Toolbar.compose({
  baseName: "toolbar",
  template,
  shadowOptions: {
    delegatesFocus: true
  }
})

async function setup() {
  const { element, connect, disconnect, parent } = await fixture(
    FASTToolbar()
  );

  const startButton = document.createElement("button");
  startButton.textContent = "startButton";
  startButton.slot="start";

  const control1 = document.createElement("button");
  control1.textContent = "control1";

  const control2 = document.createElement("button");
  control2.textContent = "control2";

  const control3 = document.createElement("button");
  control3.textContent = "control3";

  element.appendChild(control1);
  element.appendChild(control1);
  element.appendChild(control2);
  element.appendChild(control3);

  return { element, connect, disconnect, document, parent };
}

describe("Toolbar", () => {
  it("should have a role of `toolbar`", async () => {
    const { element, connect, disconnect } = await setup();

    await connect();

    expect(element.getAttribute("role")).to.equal("toolbar");

    await disconnect();
  });

  it("should have a default orientation of `horizontal`", async () => {
    const { element, connect, disconnect } = await setup();

    await connect();

    expect(element.getAttribute("orientation")).to.equal(Orientation.horizontal);

    await disconnect();
  });

  it("should move focus to its first control when it receives focus", async () => {
    const { element, connect, disconnect, document } = await setup();

    await connect();

    element.focus();
    console.log(document.activeElement);

    expect(document.activeElement?.textContent).to.equal("control1");

    await disconnect();
  });
});
