import HorizontalScrollTemplate from "./fixtures/horizontal-scroll.html";

export default {
    title: "Components/Horizontal Scroll",
};

export const HorizontalScroll = () => HorizontalScrollTemplate;

const example = `
</* @echo namespace */-horizontal-scroll>
  </* @echo namespace */-card>
    Card number 1
    </* @echo namespace */-button>A button<//* @echo namespace */-button>
  <//* @echo namespace */-card>
  </* @echo namespace */-card>
    Card number 2
    </* @echo namespace */-button>A button<//* @echo namespace */-button>
  <//* @echo namespace */-card>
  </* @echo namespace */-card>
    Card number 3
    </* @echo namespace */-button>A button<//* @echo namespace */-button>
  <//* @echo namespace */-card>
  </* @echo namespace */-card>
    Card number 4
    </* @echo namespace */-button>A button<//* @echo namespace */-button>
  <//* @echo namespace */-card>
  </* @echo namespace */-card>
    Card number 5
    </* @echo namespace */-button>A button<//* @echo namespace */-button>
  <//* @echo namespace */-card>
  </* @echo namespace */-card>
    Card number 6
    </* @echo namespace */-button>A button<//* @echo namespace */-button>
  <//* @echo namespace */-card>
  </* @echo namespace */-card>
    Card number 7
    </* @echo namespace */-button>A button<//* @echo namespace */-button>
  <//* @echo namespace */-card>
  </* @echo namespace */-card>
    Card number 8
    </* @echo namespace */-button>A button<//* @echo namespace */-button>
  <//* @echo namespace */-card>
  </* @echo namespace */-card>
    Card number 9
    </* @echo namespace */-button>A button<//* @echo namespace */-button>
  <//* @echo namespace */-card>
  </* @echo namespace */-card>
    Card number 10
    </* @echo namespace */-button>A button<//* @echo namespace */-button>
  <//* @echo namespace */-card>
  </* @echo namespace */-card>
    Card number 11
    </* @echo namespace */-button>A button<//* @echo namespace */-button>
  <//* @echo namespace */-card>
  </* @echo namespace */-card>
    Card number 12
    </* @echo namespace */-button>A button<//* @echo namespace */-button>
  <//* @echo namespace */-card>
  </* @echo namespace */-card>
    Card number 13
    </* @echo namespace */-button>A button<//* @echo namespace */-button>
  <//* @echo namespace */-card>
  </* @echo namespace */-card>
    Card number 14
    </* @echo namespace */-button>A button<//* @echo namespace */-button>
  <//* @echo namespace */-card>
  </* @echo namespace */-card>
    Card number 15
    </* @echo namespace */-button>A button<//* @echo namespace */-button>
  <//* @echo namespace */-card>
  </* @echo namespace */-card>
    Card number 16
    </* @echo namespace */-button>A button<//* @echo namespace */-button>
  <//* @echo namespace */-card>
<//* @echo namespace */-horizontal-scroll>
`;

HorizontalScroll.parameters = {
    docs: {
        source: {
            code: example,
        },
    },
};
