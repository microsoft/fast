import React, { ReactNode } from "react";
import Unity, { UnityContent } from "react-unity-webgl";
import { FASTDesignSystemProvider } from "../design-system-provider";
import { STORY_RENDERED } from "@storybook/core-events";
import addons from "@storybook/addons";
import MockUiTemplate from "./fixtures/mock-ui.html";
import { FASTMockUi } from "./";

// Prevent tree-shaking
FASTMockUi;
FASTDesignSystemProvider;

interface TestUiMockProps {}

interface TestUiMockState {
    unityContent: UnityContent | null;
}

class TestUiMock extends React.Component<TestUiMockProps, TestUiMockState> {
    private rootElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    constructor(props: TestUiMockProps) {
        super(props);

        this.state = {
            unityContent: null,
        };
    }

    public render(): JSX.Element | null {
        return null;
    }
}

addons.getChannel().addListener(STORY_RENDERED, (name: string) => {
    if (name.toLowerCase().startsWith("mock-ui")) {
        createUnityContent();
    }
});

function createUnityContent(): void {
    const unityContent: UnityContent = new UnityContent(
        "fixtures/wasm/build/ActiveBackground.json",
        "fixtures/wasm/build/UnityLoader.js",
        {
            adjustOnWindowResize: true,
        }
    );
}

export default {
    title: "Mock Ui",
};

export const MockUi = () => MockUiTemplate;
