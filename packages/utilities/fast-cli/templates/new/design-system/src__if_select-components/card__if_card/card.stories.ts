import CardTemplate from "./fixtures/card.html";

export default {
    title: "Components/Card",
};

export const Card = (): string => CardTemplate;

const example = `
</* @echo namespace */-card>Card Content<//* @echo namespace */-card>
`;

Card.parameters = {
    docs: {
        source: {
            code: example,
        },
    },
};
