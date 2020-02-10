import { storiesOf } from "@storybook/react";
import React from "react";
import { Feature, FeatureProps } from "./index";
import { LightweightButton } from "@microsoft/fast-components-react-msft";

const props: FeatureProps = {
    badge: "CASE STUDY",
    heading: {
        children: "Lorem ipsum"
    },
    paragraph: {
        children:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum suscipit metus quis ex pharetra porta ut eget arcu. Lorem ipsum dolor sit amet."
    },
    action: (className: string): React.ReactNode => (
        <LightweightButton className={className}>View full case study</LightweightButton>
    ),
    image: (className: string): React.ReactNode => (
        <img className={className} src="https://placehold.it/327x457" alt="Placeholder image" />
    )
};

storiesOf("Feature", module).add("Default", () => <Feature {...props} />);
