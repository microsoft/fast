declare const _default: (
    | string
    | {
          root: {
              schemaId: string;
              data: {
                  foo: string;
                  bar: boolean;
                  Slot: {
                      id: string;
                  }[];
                  style: string;
              };
          };
          span: {
              parent: {
                  id: string;
                  dataLocation: string;
              };
              schemaId: string;
              data: {
                  Slot: {
                      id: string;
                  }[];
              };
          };
          text: {
              parent: {
                  id: string;
                  dataLocation: string;
              };
              schemaId: string;
              data: string;
          };
      }
)[];
export default _default;
