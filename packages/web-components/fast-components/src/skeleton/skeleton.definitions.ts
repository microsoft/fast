import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastSkeletonDefinitions: WebComponentDefinition = {
  version: 1,
  tags: [
    {
      name: "fluent-skeleton",
      description: "The Fluent skeleton element",
      attributes: [
        {
          name: "fill",
          description: "The fill attribute",
          type: DataType.string,
          default: undefined,
          required: false
        },
        {
          name: "shape",
          description: "The shape attribute",
          type: DataType.string,
          default: "",
          required: false
        },
        {
          name: "pattern",
          description: "The pattern attribute",
          type: DataType.string,
          default: "",
          required: false
        },
        {
          name: "shimmer",
          description: "The shimmer attribute",
          type: DataType.boolean,
          default: "",
          required: false
        }
      ],
      slots: [
        {
          name: "",
          description: "The default slot"
        }
      ]
    }
  ]
}