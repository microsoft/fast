export default {
    title: "Components/Divider",
};

const DividerTemplate = () =>
    `</* @echo namespace */-divider role="presentation"><//* @echo namespace */-divider>`;

export const Divider = DividerTemplate.bind({});

const example = `
</* @echo namespace */-divider><//* @echo namespace */-divider>
`;

Divider.parameters = {
    docs: {
        source: {
            code: example,
        },
    },
};
