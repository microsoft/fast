import { storiesOf } from "@storybook/react";
import React from "react";
import { ContentPlacement, ContentPlacementProps } from "./index";
import { LightweightButton } from "@microsoft/fast-components-react-msft";

const props: ContentPlacementProps = {
    heading: {
        children: "Lorem ipsum"
    },
    paragraph: {
        children:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum suscipit metus quis ex pharetra porta ut eget arcu. Lorem ipsum dolor sit amet."
    }
};

const image: (className: string) => React.ReactNode = (className: string): React.ReactNode => (
    <img className={className} src="https://placehold.it/74x74" alt="Placeholder" />
);

const largeImage: (className: string) => React.ReactNode = (className: string): React.ReactNode => {
    return (
        <picture className={className}>
            <source srcSet="https://placehold.it/358x201" media="(min-width: 1400px)" />
            <source srcSet="https://placehold.it/279x157" media="(min-width: 1084px)" />
            <source srcSet="https://placehold.it/494x278" media="(min-width: 768px)" />
            <source srcSet="https://placehold.it/491x276" media="(min-width:0)" />
            <img srcSet="https://placehold.it/491x276" src="https://placehold.it/491x276" alt="Placeholder" />
        </picture>
    );
};

const action: (className: string) => React.ReactNode = (className: string): React.ReactNode => (
    <LightweightButton className={className}>View full case study</LightweightButton>
);

storiesOf("ContentPlacement", module)
    .add("Default", () => <ContentPlacement {...props} />)
    .add("with image", () => <ContentPlacement {...props} image={image} />)
    .add("with large image", () => <ContentPlacement {...props} image={largeImage} />)
    .add("with action", () => <ContentPlacement {...props} action={action} />)
    .add("with image and action", () => <ContentPlacement {...props} image={image} action={action} />);
