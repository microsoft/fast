import { Updates } from "@microsoft/fast-element";
import { keyArrowRight, Orientation } from "@microsoft/fast-web-utilities";
import { expect } from "chai";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";
import { FASTToolbar, toolbarTemplate } from "./index.js";

const toolbarName = uniqueElementName();
FASTToolbar.define({
  name: toolbarName,
  template: toolbarTemplate(),
  shadowOptions: {
    delegatesFocus: true
  }
});

async function setup() {
  const { element, connect, disconnect, parent } = await fixture<FASTToolbar>(toolbarName);

  const startButton = document.createElement("button");
  startButton.textContent = "startButton";
  startButton.slot="start";

  const control1 = document.createElement("button");
  control1.textContent = "control1";

  const control2 = document.createElement("button");
  control2.textContent = "control2";

  const control3 = document.createElement("button");
  control3.textContent = "control3";

  element.appendChild(startButton);
  element.appendChild(control1);
  element.appendChild(control2);
  element.appendChild(control3);

  return { element, connect, disconnect, document, startButton, control1, control2, control3, parent };
}

async function setupEmpty() {
  const { element, connect, disconnect, parent } = await fixture<FASTToolbar>(toolbarName);

  return { element, connect, disconnect, document, parent };
}

function pressRightArrowKey(element: HTMLElement) {
  const event = new KeyboardEvent("keydown", {
      key: keyArrowRight,
  } as KeyboardEventInit);
  element.dispatchEvent(event);
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

  it("should move focus to its first focusable element when it receives focus", async () => {
    const { element, connect, disconnect, document, startButton } = await setup();

    await connect();

    element.focus();

    expect(document.activeElement).to.equal(startButton);

    await disconnect();
  });

  it("should move focus to next element when keyboard incrementer is pressed", async () => {
    const { element, connect, disconnect, document, startButton, control1 } = await setup();

    await connect();

    element.focus();

    expect(document.activeElement).to.equal(startButton);

    pressRightArrowKey(element);

    expect(document.activeElement).to.equal(control1);

    await disconnect();
  });

  it("should skip disabled elements when keyboard incrementer is pressed", async () => {
    const { element, connect, disconnect, document, startButton, control1, control2 } = await setup();
    control1.disabled = true;

    await connect();

    element.focus();

    expect(document.activeElement).to.equal(startButton);

    pressRightArrowKey(element);

    expect(document.activeElement).to.equal(control2);

    await disconnect();
  });

  it("should skip elements that change to disabled after connect when keyboard incrementer is pressed", async () => {
    const { element, connect, disconnect, document, startButton, control1, control2 } = await setup();

    await connect();

    control1.disabled = true;
    await Updates.next();

    element.focus();

    expect(document.activeElement).to.equal(startButton);

    pressRightArrowKey(element);

    expect(document.activeElement).to.equal(control2);

    await disconnect();
  });

  it("should skip hidden elements when keyboard incrementer is pressed", async () => {
    const { element, connect, disconnect, document, startButton, control1, control2 } = await setup();
    control1.hidden = true;

    await connect();

    element.focus();

    expect(document.activeElement).to.equal(startButton);

    pressRightArrowKey(element);

    expect(document.activeElement).to.equal(control2);

    await disconnect();
  });

  it("should skip elements that change to hidden after connect when keyboard incrementer is pressed", async () => {
    const { element, connect, disconnect, document, startButton, control1, control2 } = await setup();

    await connect();

    control1.hidden = true;
    await Updates.next();

    element.focus();

    expect(document.activeElement).to.equal(startButton);

    pressRightArrowKey(element);

    expect(document.activeElement).to.equal(control2);

    await disconnect();
  });

  it("should move focus to next element when keyboard incrementer is pressed and start slot content is added after connect", async () => {
    const { element, connect, disconnect, document } = await setupEmpty();

    await connect();

    const startButton1 = document.createElement("button");
    startButton1.textContent = "startButton1";
    startButton1.slot = "start";

    const startButton2 = document.createElement("button");
    startButton2.textContent = "startButton2";
    startButton2.slot = "start";

    element.appendChild(startButton1);
    element.appendChild(startButton2);

    await Updates.next();

    element.focus();

    expect(document.activeElement).to.equal(startButton1);

    pressRightArrowKey(element);

    expect(document.activeElement).to.equal(startButton2);

    await disconnect();
  });

  it("should move focus to next element when keyboard incrementer is pressed and end slot content is added after connect", async () => {
    const { element, connect, disconnect, document } = await setupEmpty();

    await connect();

    const endButton1 = document.createElement("button");
    endButton1.textContent = "endButton1";
    endButton1.slot = "end";

    const endButton2 = document.createElement("button");
    endButton2.textContent = "endButton2";
    endButton2.slot = "end";

    element.appendChild(endButton1);
    element.appendChild(endButton2);

    await Updates.next();

    element.focus();

    expect(document.activeElement).to.equal(endButton1);

    pressRightArrowKey(element);

    expect(document.activeElement).to.equal(endButton2);

    await disconnect();
  });

  it("should maintain correct activeIndex when the set of focusable children changes", async () => {
    const { element, connect, disconnect, document, startButton, control1, control2, control3 } = await setup();
    startButton.disabled = true;

    await connect();

    element.focus();

    expect(document.activeElement).to.equal(control1);

    pressRightArrowKey(element);

    expect(document.activeElement).to.equal(control2);

    startButton.disabled = false;
    await Updates.next();

    pressRightArrowKey(element);

    expect(document.activeElement).to.equal(control3);

    await disconnect();
  });

  it("should reset activeIndex to 0 when the focused item is no longer focusable", async () => {
    const { element, connect, disconnect, document, startButton, control1 } = await setup();

    await connect();

    element.focus();

    expect(document.activeElement).to.equal(startButton);

    pressRightArrowKey(element);

    expect(document.activeElement).to.equal(control1);

    control1.disabled = true;
    await Updates.next();

    // re-focus the element because focus is lost when control1 became disabled
    element.focus();

    expect(document.activeElement).to.equal(startButton);

    await disconnect();
  });
});
