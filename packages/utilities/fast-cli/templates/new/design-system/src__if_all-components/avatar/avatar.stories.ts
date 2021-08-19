export default {
    title: "Components/Avatar",
};

const AvatarTemplate = () => `
    </* @echo namespace */-avatar
    alt="Annie's profile image"
    link="#"
    shape="circle"
    fill="accent-primary"
    color="bar"
    >
    <img class="image" slot="media" src="https://via.placeholder.com/32" />
    <//* @echo namespace */-avatar>
`;

export const Avatar = AvatarTemplate.bind({});

const example = `
    </* @echo namespace */-avatar
    alt="Annie's profile image"
    link="#"
    shape="circle"
    fill="accent-primary"
    color="bar"
    >
    <img class="image" slot="media" src="https://via.placeholder.com/32" />
    <//* @echo namespace */-avatar>
`;

Avatar.parameters = {
    docs: {
        soruce: {
            code: example,
        },
    },
};
