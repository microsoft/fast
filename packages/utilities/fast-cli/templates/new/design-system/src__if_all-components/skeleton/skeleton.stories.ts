export default {
    title: "Components/Skeleton",
    argTypes: {
        shape: {
            options: ["circle", "rect"],
            control: { type: "radio" },
        },
        shimmer: {
            control: { type: "boolean" },
        },
    },
};

const SkeletonTemplate = ({ shape, shimmer }) => `
  </* @echo namespace */-skeleton 
    ${shape ? `shape="${shape}"` : ""}
    ${shimmer ? "shimmer" : ""} 
    style="border-radius: 4px; margin-top: 10px; height: 10px" width: 100px"
  ><//* @echo namespace */-skeleton>
`;

export const Skeleton = SkeletonTemplate.bind({});

Skeleton.args = {
    shape: "rect",
    shimmer: false,
};

const example = `
</* @echo namespace */-skeleton style="border-radius: 4px; margin-top: 10px; height: 10px" shape="rect"><//* @echo namespace */-skeleton>
`;

Skeleton.parameters = {
    docs: {
        source: {
            code: example,
        },
    },
};
